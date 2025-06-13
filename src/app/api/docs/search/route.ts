import { NextRequest, NextResponse } from 'next/server'
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createDatabaseSupabaseClient()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ pages: [] })
    }

    // MagnifyingGlass in title and content
    const { data: pages, error } = await supabase
      .from('document_pages')
      .select('*')
      .or(`title.ilike.%${query}%,content::text.ilike.%${query}%`)
      .order('updated_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error searching pages:', error)
      return NextResponse.json({ error: 'Failed to search pages' }, { status: 500 })
    }

    return NextResponse.json({ pages: pages || [] })
  } catch (error) {
    console.error('Error in GET /api/docs/search:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 