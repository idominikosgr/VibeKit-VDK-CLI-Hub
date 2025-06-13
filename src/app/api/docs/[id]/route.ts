import { NextRequest, NextResponse } from 'next/server'
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client'
import { UpdatePageRequest } from '@/types/documentation'

// Helper function to safely parse content
function parsePageContent(content: any) {
  if (typeof content === 'string') {
    try {
      return JSON.parse(content)
    } catch (error) {
      console.warn('Failed to parse page content as JSON, using default:', error)
      // Return a default empty Lexical editor state
      return {
        root: {
          children: [{
            children: [{
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: '',
              type: 'text',
              version: 1,
            }],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          }],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      }
    }
  }
  return content
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createDatabaseSupabaseClient()
    const { id } = await params

    const { data: page, error } = await supabase
      .from('documentation_pages')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 })
      }
      console.error('Error fetching page:', error)
      return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 })
    }

    // Map database fields to expected interface fields
    const mappedPage = {
      id: page.id,
      title: page.title,
      content: parsePageContent(page.content),
      icon: page.icon,
      cover: page.cover_image,
      parent_id: page.parent_id,
      position: page.order_index,
      is_published: page.status === 'published',
      is_favorite: false,
      created_at: page.created_at,
      updated_at: page.updated_at,
      created_by: page.author_id,
      last_edited_by: page.last_edited_by
    }

    return NextResponse.json({ page: mappedPage })
  } catch (error) {
    console.error('Error in GET /api/docs/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createDatabaseSupabaseClient()
    const { id } = await params
    const body: UpdatePageRequest = await request.json()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Map request fields to database fields
    const updateData: any = {
      last_edited_by: user.id,
    }

    if (body.title !== undefined) updateData.title = body.title
    if (body.content !== undefined) {
      updateData.content = typeof body.content === 'string' ? body.content : JSON.stringify(body.content)
    }
    if (body.icon !== undefined) updateData.icon = body.icon
    if (body.cover !== undefined) updateData.cover_image = body.cover
    if (body.is_published !== undefined) {
      updateData.status = body.is_published ? 'published' : 'draft'
    }
    if (body.is_favorite !== undefined) {
      // Handle bookmarks separately if needed
    }

    const { data: page, error } = await supabase
      .from('documentation_pages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 })
      }
      console.error('Error updating page:', error)
      return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
    }

    // Map response to expected interface
    const mappedPage = {
      id: page.id,
      title: page.title,
      content: parsePageContent(page.content),
      icon: page.icon,
      cover: page.cover_image,
      parent_id: page.parent_id,
      position: page.order_index,
      is_published: page.status === 'published',
      is_favorite: false,
      created_at: page.created_at,
      updated_at: page.updated_at,
      created_by: page.author_id,
      last_edited_by: page.last_edited_by
    }

    return NextResponse.json({ page: mappedPage })
  } catch (error) {
    console.error('Error in PUT /api/docs/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createDatabaseSupabaseClient()
    const { id } = await params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete the page (children will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from('documentation_pages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting page:', error)
      return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/docs/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 