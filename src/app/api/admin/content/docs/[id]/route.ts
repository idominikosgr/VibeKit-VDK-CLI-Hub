import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { requireAdmin } from '@/lib/middleware/require-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: page, error } = await supabase
      .from('documentation_pages')
      .select(`
        *,
        author:profiles(name, email),
        last_editor:profiles(name, email),
        tags:documentation_page_tags(documentation_tags(*)),
        children:documentation_pages!parent_id(id, title, slug, status),
        parent:documentation_pages!parent_id(id, title, slug)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching documentation page:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch documentation page' },
        { status: 500 }
      );
    }

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Documentation page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: page
    });

  } catch (error) {
    console.error('Error in admin docs GET by ID:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const { id } = await params;
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
      status,
      visibility,
      content_type,
      template_data,
      metadata,
      tags = []
    } = body;

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Update the page
    const updateData: any = {
      last_edited_by: user?.id,
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (icon !== undefined) updateData.icon = icon;
    if (cover_image !== undefined) updateData.cover_image = cover_image;
    if (parent_id !== undefined) updateData.parent_id = parent_id;
    if (order_index !== undefined) updateData.order_index = order_index;
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'published' && !updateData.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }
    if (visibility !== undefined) updateData.visibility = visibility;
    if (content_type !== undefined) updateData.content_type = content_type;
    if (template_data !== undefined) updateData.template_data = template_data;
    if (metadata !== undefined) updateData.metadata = metadata;

    const { data: page, error: pageError } = await supabase
      .from('documentation_pages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (pageError) {
      console.error('Error updating documentation page:', pageError);
      return NextResponse.json(
        { success: false, error: 'Failed to update documentation page' },
        { status: 500 }
      );
    }

    // Update tags if provided
    if (tags !== undefined) {
      // Remove existing tag associations
      await supabase
        .from('documentation_page_tags')
        .delete()
        .eq('page_id', id);

      // Add new tag associations
      if (tags.length > 0) {
        const tagAssociations = tags.map((tagId: string) => ({
          page_id: id,
          tag_id: tagId
        }));

        const { error: tagError } = await supabase
          .from('documentation_page_tags')
          .insert(tagAssociations);

        if (tagError) {
          console.error('Error updating tags:', tagError);
          // Don't fail the entire operation for tag errors
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: page
    });

  } catch (error) {
    console.error('Error in admin docs PUT:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Check if page has children
    const { data: children, error: childrenError } = await supabase
      .from('documentation_pages')
      .select('id')
      .eq('parent_id', id);

    if (childrenError) {
      console.error('Error checking for child pages:', childrenError);
      return NextResponse.json(
        { success: false, error: 'Failed to check for child pages' },
        { status: 500 }
      );
    }

    if (children && children.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete page with child pages. Please delete or move child pages first.' },
        { status: 400 }
      );
    }

    // Delete the page (cascading deletes will handle related records)
    const { error } = await supabase
      .from('documentation_pages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting documentation page:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete documentation page' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Documentation page deleted successfully'
    });

  } catch (error) {
    console.error('Error in admin docs DELETE:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 