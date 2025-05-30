import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { requireAdmin } from '@/lib/middleware/require-admin';

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const visibility = searchParams.get('visibility');
    const search = searchParams.get('search');
    
    const offset = (page - 1) * limit;

    let query = supabase
      .from('documentation_pages')
      .select(`
        *,
        author:profiles(name, email),
        last_editor:profiles(name, email),
        tags:documentation_page_tags(documentation_tags(*))
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (visibility) {
      query = query.eq('visibility', visibility);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { data: pages, error, count } = await query
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching documentation pages:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch documentation pages' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        pages,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error in admin docs GET:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const supabase = await createServerSupabaseClient();
    const body = await request.json();

    const {
      title,
      slug,
      content,
      excerpt,
      icon,
      cover_image,
      parent_id,
      order_index,
      status = 'draft',
      visibility = 'public',
      content_type = 'markdown',
      template_data = {},
      metadata = {},
      tags = []
    } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Generate path based on parent hierarchy and slug
    let path = `/docs/${slug}`;
    if (parent_id) {
      // Get parent path to build hierarchical path
      const { data: parent } = await supabase
        .from('documentation_pages')
        .select('path')
        .eq('id', parent_id)
        .single();
      
      if (parent) {
        path = `${parent.path}/${slug}`;
      }
    }
    
    // Create the page
    const { data: page, error: pageError } = await supabase
      .from('documentation_pages')
      .insert({
        title,
        slug,
        content,
        excerpt,
        icon,
        cover_image,
        parent_id,
        path,
        order_index,
        status,
        visibility,
        content_type,
        template_data,
        metadata,
        author_id: user?.id,
        last_edited_by: user?.id,
        published_at: status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (pageError) {
      console.error('Error creating documentation page:', pageError);
      return NextResponse.json(
        { success: false, error: 'Failed to create documentation page' },
        { status: 500 }
      );
    }

    // Associate tags if provided
    if (tags.length > 0) {
      const tagAssociations = tags.map((tagId: string) => ({
        page_id: page.id,
        tag_id: tagId
      }));

      const { error: tagError } = await supabase
        .from('documentation_page_tags')
        .insert(tagAssociations);

      if (tagError) {
        console.error('Error associating tags:', tagError);
        // Don't fail the entire operation for tag errors
      }
    }

    return NextResponse.json({
      success: true,
      data: page
    });

  } catch (error) {
    console.error('Error in admin docs POST:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 