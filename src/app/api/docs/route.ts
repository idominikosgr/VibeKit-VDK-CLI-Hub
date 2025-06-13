import { NextRequest, NextResponse } from 'next/server'
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client'
import { DocumentPage, CreatePageRequest } from '@/types/documentation'

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

export async function GET(request: NextRequest) {
  try {
    const supabase = await createDatabaseSupabaseClient()
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parent_id')
    const includeChildren = searchParams.get('include_children') === 'true'

    let query = supabase
      .from('documentation_pages')
      .select('*')
      .order('order_index', { ascending: true })

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

    // Map database fields to expected interface fields
    const mappedPages = pages?.map(page => ({
      id: page.id,
      title: page.title,
      content: parsePageContent(page.content),
      icon: page.icon,
      cover: page.cover_image,
      parent_id: page.parent_id,
      position: page.order_index,
      is_published: page.status === 'published',
      is_favorite: false, // We'll add bookmarks integration later
      created_at: page.created_at,
      updated_at: page.updated_at,
      created_by: page.author_id,
      last_edited_by: page.last_edited_by
    })) || []

    // If including children, fetch the full tree structure
    if (includeChildren && mappedPages) {
      const buildTree = async (parentPages: any[]): Promise<any[]> => {
        const result = []
        for (const page of parentPages) {
          const { data: children } = await supabase
            .from('documentation_pages')
            .select('*')
            .eq('parent_id', page.id)
            .order('order_index', { ascending: true })
          
          const mappedChildren = children?.map(child => ({
            id: child.id,
            title: child.title,
            content: parsePageContent(child.content),
            icon: child.icon,
            cover: child.cover_image,
            parent_id: child.parent_id,
            position: child.order_index,
            is_published: child.status === 'published',
            is_favorite: false,
            created_at: child.created_at,
            updated_at: child.updated_at,
            created_by: child.author_id,
            last_edited_by: child.last_edited_by
          })) || []
          
          result.push({
            ...page,
            children: mappedChildren.length > 0 ? await buildTree(mappedChildren) : []
          })
        }
        return result
      }

      const pagesWithChildren = await buildTree(mappedPages)
      return NextResponse.json({ pages: pagesWithChildren })
    }

    return NextResponse.json({ pages: mappedPages })
  } catch (error) {
    console.error('Error in GET /api/docs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createDatabaseSupabaseClient()
    
    // Parse and validate request body
    let body: CreatePageRequest
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Get and validate user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
    
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // Validate parent_id if provided
    if (body.parent_id) {
      const { data: parentPage, error: parentError } = await supabase
        .from('documentation_pages')
        .select('id')
        .eq('id', body.parent_id)
        .single()
      
      if (parentError || !parentPage) {
        return NextResponse.json({ error: 'Invalid parent page' }, { status: 400 })
      }
    }

    // Get the next position for the page
    let positionQuery = supabase
      .from('documentation_pages')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)

    if (body.parent_id) {
      positionQuery = positionQuery.eq('parent_id', body.parent_id)
    } else {
      positionQuery = positionQuery.is('parent_id', null)
    }

    const { data: lastPage } = await positionQuery
    const nextPosition = lastPage && lastPage.length > 0 ? (lastPage[0]?.order_index ?? 0) + 1 : 0

    // Generate slug from title with better sanitization
    let baseSlug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50)

    // Fallback if slug is empty after sanitization
    if (!baseSlug) {
      baseSlug = 'untitled'
    }

    // Ensure slug uniqueness by checking existing slugs
    let slug = baseSlug
    let counter = 1
    while (true) {
      const { data: existingPage, error: slugError } = await supabase
        .from('documentation_pages')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      
      if (slugError) {
        console.error('Error checking slug uniqueness:', slugError)
        return NextResponse.json({ error: 'Failed to validate slug' }, { status: 500 })
      }
      
      if (!existingPage) {
        break // Slug is unique
      }
      
      slug = `${baseSlug}-${counter}`
      counter++
      
      // Prevent infinite loop
      if (counter > 1000) {
        return NextResponse.json({ error: 'Unable to generate unique slug' }, { status: 500 })
      }
    }

    // Generate path based on parent hierarchy and slug
    let path = `/docs/${slug}`
    if (body.parent_id) {
      // Get parent path to build hierarchical path
      const { data: parent, error: parentPathError } = await supabase
        .from('documentation_pages')
        .select('path')
        .eq('id', body.parent_id)
        .single()
      
      if (parentPathError) {
        console.error('Error fetching parent path:', parentPathError)
        return NextResponse.json({ error: 'Failed to build page path' }, { status: 500 })
      }
      
      if (parent && parent.path) {
        path = `${parent.path}/${slug}`
      }
    }

    // Handle content - ensure it's a string
    let defaultContent = ''
    if (body.content) {
      if (typeof body.content === 'string') {
        defaultContent = body.content
      } else {
        try {
          defaultContent = JSON.stringify(body.content)
        } catch (contentError) {
          console.error('Error serializing content:', contentError)
          defaultContent = ''
        }
      }
    }

    const newPage = {
      title: body.title.trim(),
      slug: slug,
      content: defaultContent,
      path: path,
      icon: body.icon || '📄',
      parent_id: body.parent_id || null,
      order_index: nextPosition,
      status: 'draft' as const,
      visibility: 'public' as const,
      content_type: 'rich_text' as const,
      author_id: userId,
      last_edited_by: userId,
    }

    console.log('Creating page with data:', {
      ...newPage,
      content: newPage.content.substring(0, 100) + (newPage.content.length > 100 ? '...' : '')
    })
    
    const { data: page, error } = await supabase
      .from('documentation_pages')
      .insert(newPage)
      .select()
      .single()

    if (error) {
      console.error('Error creating page:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      
      // Provide more specific error messages
      if (error.code === '23505') {
        return NextResponse.json({ 
          error: 'A page with this slug already exists',
          details: 'Please try a different title' 
        }, { status: 409 })
      } else if (error.code === '23503') {
        return NextResponse.json({ 
          error: 'Invalid reference',
          details: 'The parent page or user reference is invalid' 
        }, { status: 400 })
      } else {
        return NextResponse.json({ 
          error: 'Failed to create page',
          details: error.message 
        }, { status: 500 })
      }
    }

    // Map response to expected interface
    const mappedPage = {
      id: page.id,
      title: page.title,
      content: page.content,
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
    console.error('Error in POST /api/docs:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 