import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server-client'
import { UpdatePageRequest } from '@/types/documentation'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id } = await params

    const { data: page, error } = await supabase
      .from('document_pages')
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

    return NextResponse.json({ page })
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
    const supabase = await createServerSupabaseClient()
    const { id } = await params
    const body: UpdatePageRequest = await request.json()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update the page
    const updateData: any = {
      ...body,
      last_edited_by: user.id,
    }

    // Cast content to Json if provided
    if (body.content) {
      updateData.content = body.content as any
    }

    const { data: page, error } = await supabase
      .from('document_pages')
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

    return NextResponse.json({ page })
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
    const supabase = await createServerSupabaseClient()
    const { id } = await params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete the page (children will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from('document_pages')
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