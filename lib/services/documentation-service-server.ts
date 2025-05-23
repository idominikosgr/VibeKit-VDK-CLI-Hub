import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import type {
  DocumentationPage,
  DocumentationPageWithRelations,
  DocumentationVersion,
  DocumentationComment,
  DocumentationCommentWithAuthor,
  DocumentationTag,
  DocumentationTemplate,
  DocumentationSearchResult,
  DocumentationBreadcrumb,
  DocumentationTree,
  DocumentationListResponse,
  DocumentationSearchParams,
  CreateDocumentationPageRequest,
  UpdateDocumentationPageRequest,
  CreateDocumentationCommentRequest,
  UpdateDocumentationCommentRequest,
  DocumentationAnalytics
} from '@/types/documentation';

export class DocumentationServiceServer {
  private async getSupabase() {
    return createServerSupabaseClient();
  }

  // ========================================
  // PAGE OPERATIONS
  // ========================================

  async getPage(slug: string, includeRelations = false): Promise<DocumentationPageWithRelations | null> {
    const supabase = await this.getSupabase();
    
    const { data: page, error } = await (supabase as any)
      .from('documentation_pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !page) {
      return null;
    }

    if (!includeRelations) {
      return page as DocumentationPageWithRelations;
    }

    // Fetch related data
    const [
      { data: author },
      { data: lastEditor },
      { data: tags },
      { data: comments },
      { data: breadcrumbs },
      { data: children }
    ] = await Promise.all([
      // Author
      page.author_id ? (supabase as any)
        .from('profiles')
        .select('id, name, email, avatar_url')
        .eq('id', page.author_id)
        .single() : Promise.resolve({ data: null }),
      
      // Last editor
      page.last_edited_by ? (supabase as any)
        .from('profiles')
        .select('id, name, email, avatar_url')
        .eq('id', page.last_edited_by)
        .single() : Promise.resolve({ data: null }),
      
      // Tags
      (supabase as any)
        .from('documentation_page_tags')
        .select(`
          documentation_tags (
            id, name, slug, description, color
          )
        `)
        .eq('page_id', page.id),
      
      // Comments with authors
      (supabase as any)
        .from('documentation_comments')
        .select('*')
        .eq('page_id', page.id)
        .eq('is_resolved', false)
        .order('created_at', { ascending: true }),
      
      // Breadcrumbs
      (supabase as any).rpc('get_documentation_breadcrumbs', { page_id: page.id }),
      
      // Child pages
      (supabase as any)
        .from('documentation_pages')
        .select('id, title, slug, path, icon, order_index, status')
        .eq('parent_id', page.id)
        .eq('status', 'published')
        .order('order_index', { ascending: true })
    ]);

    // Increment view count
    await (supabase as any)
      .from('documentation_pages')
      .update({ view_count: page.view_count + 1 })
      .eq('id', page.id);

    // Manually fetch authors for comments
    const commentAuthorIds = Array.from(new Set(comments?.map((c: any) => c.author_id).filter(Boolean)));
    const { data: commentAuthors } = commentAuthorIds.length > 0 ? await (supabase as any)
      .from('profiles')
      .select('id, name, email, avatar_url')
      .in('id', commentAuthorIds) : { data: [] };

    // Attach authors to comments
    const commentsWithAuthors = comments?.map((comment: any) => ({
      ...comment,
      author: commentAuthors?.find((author: any) => author.id === comment.author_id) || null
    })) || [];

    return {
      ...page,
      author: author || undefined,
      last_editor: lastEditor || undefined,
      tags: tags?.map((t: any) => t.documentation_tags).filter(Boolean) || [],
      comments: commentsWithAuthors,
      breadcrumbs: breadcrumbs || [],
      children: children || []
    } as DocumentationPageWithRelations;
  }

  async searchPages(params: DocumentationSearchParams): Promise<DocumentationListResponse> {
    const supabase = await this.getSupabase();
    const {
      query,
      tag,
      author,
      status = 'published',
      visibility = 'public',
      content_type,
      limit = 20,
      offset = 0,
      sort_by = 'updated_at',
      sort_order = 'desc'
    } = params;

    // Regular filtered query (always use this approach for now)
    let queryBuilder = (supabase as any)
      .from('documentation_pages')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .eq('visibility', visibility);

    if (query) {
      // Use simple text search instead of the search function for now
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);
    }

    if (tag) {
      queryBuilder = queryBuilder.contains('tags', [tag]);
    }

    if (author) {
      queryBuilder = queryBuilder.eq('author_id', author);
    }

    if (content_type) {
      queryBuilder = queryBuilder.eq('content_type', content_type);
    }

    queryBuilder = queryBuilder
      .order(sort_by, { ascending: sort_order === 'asc' })
      .range(offset, offset + limit - 1);

    const { data: pages, count, error } = await queryBuilder;

    if (error) {
      throw new Error(`Failed to fetch pages: ${error.message}`);
    }

    // Manually fetch authors for the pages
    const authorIds = Array.from(new Set(pages?.map((p: any) => p.author_id).filter(Boolean)));
    const { data: authors } = authorIds.length > 0 ? await (supabase as any)
      .from('profiles')
      .select('id, name, email, avatar_url')
      .in('id', authorIds) : { data: [] };

    // Attach authors to pages
    const pagesWithAuthors = pages?.map((page: any) => ({
      ...page,
      author: authors?.find((author: any) => author.id === page.author_id) || null
    })) || [];

    return {
      pages: pagesWithAuthors,
      total_count: count || 0,
      limit,
      offset,
      has_more: (count || 0) > offset + limit
    };
  }

  async createPage(pageData: CreateDocumentationPageRequest): Promise<DocumentationPage> {
    const supabase = await this.getSupabase();
    const { tag_ids, ...pageFields } = pageData;
    
    // Generate slug if not provided
    if (!pageFields.slug) {
      pageFields.slug = this.generateSlug(pageFields.title);
    }

    const { data: page, error } = await (supabase as any)
      .from('documentation_pages')
      .insert(pageFields)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create page: ${error.message}`);
    }

    // Add tags if provided
    if (tag_ids && tag_ids.length > 0) {
      await this.addTagsToPage(page.id, tag_ids);
    }

    return page;
  }

  async updatePage(id: string, updates: UpdateDocumentationPageRequest): Promise<DocumentationPage> {
    const supabase = await this.getSupabase();
    const { tag_ids, ...pageFields } = updates;

    const { data: page, error } = await (supabase as any)
      .from('documentation_pages')
      .update(pageFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update page: ${error.message}`);
    }

    // Update tags if provided
    if (tag_ids !== undefined) {
      await this.updatePageTags(id, tag_ids);
    }

    return page;
  }

  async getTags(): Promise<DocumentationTag[]> {
    const supabase = await this.getSupabase();
    const { data: tags, error } = await (supabase as any)
      .from('documentation_tags')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch tags: ${error.message}`);
    }

    return tags || [];
  }

  async createTag(name: string, description?: string, color?: string): Promise<DocumentationTag> {
    const supabase = await this.getSupabase();
    const slug = this.generateSlug(name);
    
    const { data: tag, error } = await (supabase as any)
      .from('documentation_tags')
      .insert({ name, slug, description, color })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create tag: ${error.message}`);
    }

    return tag;
  }

  private async addTagsToPage(pageId: string, tagIds: string[]): Promise<void> {
    const supabase = await this.getSupabase();
    const tagRelations = tagIds.map(tagId => ({ page_id: pageId, tag_id: tagId }));
    
    const { error } = await (supabase as any)
      .from('documentation_page_tags')
      .insert(tagRelations);

    if (error) {
      throw new Error(`Failed to add tags to page: ${error.message}`);
    }
  }

  private async updatePageTags(pageId: string, tagIds: string[]): Promise<void> {
    const supabase = await this.getSupabase();
    
    // Remove existing tags
    await (supabase as any)
      .from('documentation_page_tags')
      .delete()
      .eq('page_id', pageId);

    // Add new tags
    if (tagIds.length > 0) {
      await this.addTagsToPage(pageId, tagIds);
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async deletePage(id: string): Promise<void> {
    const supabase = await this.getSupabase();
    const { error } = await (supabase as any)
      .from('documentation_pages')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete page: ${error.message}`);
    }
  }

  // ========================================
  // COMMENT OPERATIONS
  // ========================================

  async getPageComments(pageId: string): Promise<DocumentationCommentWithAuthor[]> {
    const supabase = await this.getSupabase();
    const { data: comments, error } = await (supabase as any)
      .from('documentation_comments')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }

    // Manually fetch authors for the comments
    const authorIds = Array.from(new Set(comments?.map((c: any) => c.author_id).filter(Boolean)));
    const { data: authors } = authorIds.length > 0 ? await (supabase as any)
      .from('profiles')
      .select('id, name, email, avatar_url')
      .in('id', authorIds) : { data: [] };

    // Attach authors to comments
    const commentsWithAuthors = comments?.map((comment: any) => ({
      ...comment,
      author: authors?.find((author: any) => author.id === comment.author_id) || null
    })) || [];

    return commentsWithAuthors;
  }

  async getComment(commentId: string): Promise<DocumentationCommentWithAuthor | null> {
    const supabase = await this.getSupabase();
    const { data: comment, error } = await (supabase as any)
      .from('documentation_comments')
      .select('*')
      .eq('id', commentId)
      .single();

    if (error) {
      return null;
    }

    // Manually fetch author for the comment
    if (comment?.author_id) {
      const { data: author } = await (supabase as any)
        .from('profiles')
        .select('id, name, email, avatar_url')
        .eq('id', comment.author_id)
        .single();
      
      return {
        ...comment,
        author: author || null
      };
    }

    return {
      ...comment,
      author: null
    };
  }

  async createComment(commentData: CreateDocumentationCommentRequest): Promise<DocumentationComment> {
    const supabase = await this.getSupabase();
    const { data: comment, error } = await (supabase as any)
      .from('documentation_comments')
      .insert(commentData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create comment: ${error.message}`);
    }

    return comment;
  }

  async updateComment(commentId: string, updates: UpdateDocumentationCommentRequest): Promise<DocumentationComment> {
    const supabase = await this.getSupabase();
    const { data: comment, error } = await (supabase as any)
      .from('documentation_comments')
      .update(updates)
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update comment: ${error.message}`);
    }

    return comment;
  }

  async deleteComment(commentId: string): Promise<void> {
    const supabase = await this.getSupabase();
    const { error } = await (supabase as any)
      .from('documentation_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
  }

  async resolveComment(commentId: string): Promise<void> {
    const supabase = await this.getSupabase();
    const { error } = await (supabase as any)
      .from('documentation_comments')
      .update({ 
        is_resolved: true,
        resolved_at: new Date().toISOString()
      })
      .eq('id', commentId);

    if (error) {
      throw new Error(`Failed to resolve comment: ${error.message}`);
    }
  }

  // ========================================
  // TAG OPERATIONS (EXTENDED)
  // ========================================

  async getTag(tagId: string): Promise<DocumentationTag | null> {
    const supabase = await this.getSupabase();
    const { data: tag, error } = await (supabase as any)
      .from('documentation_tags')
      .select('*')
      .eq('id', tagId)
      .single();

    if (error) {
      return null;
    }

    return tag;
  }

  async updateTag(tagId: string, updates: { name?: string; description?: string; color?: string }): Promise<DocumentationTag> {
    const supabase = await this.getSupabase();
    
    // If name is being updated, also update the slug
    const updateData: { name?: string; description?: string; color?: string; slug?: string } = { ...updates };
    if (updates.name) {
      updateData.slug = this.generateSlug(updates.name);
    }

    const { data: tag, error } = await (supabase as any)
      .from('documentation_tags')
      .update(updateData)
      .eq('id', tagId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update tag: ${error.message}`);
    }

    return tag;
  }

  async deleteTag(tagId: string): Promise<void> {
    const supabase = await this.getSupabase();
    const { error } = await (supabase as any)
      .from('documentation_tags')
      .delete()
      .eq('id', tagId);

    if (error) {
      throw new Error(`Failed to delete tag: ${error.message}`);
    }
  }
}

// Export singleton instance
export const documentationServiceServer = new DocumentationServiceServer(); 