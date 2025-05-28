import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server-client'
import { DocumentPage, CreatePageRequest } from '@/types/documentation'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parent_id')
    const includeChildren = searchParams.get('include_children') === 'true'

    let query = supabase
      .from('document_pages')
      .select('*')
      .order('position', { ascending: true })

    if (parentId) {
      query = query.eq('parent_id', parentId)
    } else {
      query = query.is('parent_id', null)
    }

    const { data: pages, error } = await query

    if (error) {
      console.error('Error fetching pages:', error)
      return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
    }

    // If including children, fetch the full tree structure
    if (includeChildren && pages) {
      const buildTree = async (parentPages: any[]): Promise<any[]> => {
        const result = []
        for (const page of parentPages) {
          const { data: children } = await supabase
            .from('document_pages')
            .select('*')
            .eq('parent_id', page.id)
            .order('position', { ascending: true })
          
          result.push({
            ...page,
            children: children ? await buildTree(children) : []
          })
        }
        return result
      }

      const pagesWithChildren = await buildTree(pages)
      return NextResponse.json({ pages: pagesWithChildren })
    }

    return NextResponse.json({ pages: pages || [] })
  } catch (error) {
    console.error('Error in GET /api/docs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const body: CreatePageRequest = await request.json()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the next position for the page
    let positionQuery = supabase
      .from('document_pages')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)

    if (body.parent_id) {
      positionQuery = positionQuery.eq('parent_id', body.parent_id)
    } else {
      positionQuery = positionQuery.is('parent_id', null)
    }

    const { data: lastPage } = await positionQuery
    const nextPosition = lastPage && lastPage.length > 0 ? lastPage[0].position + 1 : 0

    const defaultContent = {
      root: {
        children: [
          {
            children: [],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }

    const newPage = {
      title: body.title,
      content: body.content ? body.content as any : defaultContent as any,
      icon: body.icon,
      parent_id: body.parent_id,
      position: nextPosition,
      is_published: false,
      is_favorite: false,
      created_by: user.id,
      last_edited_by: user.id,
    }

    const { data: page, error } = await supabase
      .from('document_pages')
      .insert(newPage)
      .select()
      .single()

    if (error) {
      console.error('Error creating page:', error)
      return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
    }

    return NextResponse.json({ page })
  } catch (error) {
    console.error('Error in POST /api/docs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 