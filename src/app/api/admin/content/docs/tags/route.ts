import { NextRequest, NextResponse } from 'next/server';
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client';
import { requireAdmin } from '@/lib/middleware/require-admin';

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const supabase = await createDatabaseSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search');
    const includeUsage = searchParams.get('includeUsage') === 'true';

    let query = supabase
      .from('documentation_tags')
      .select(`
        *
        ${includeUsage ? ', usage_count:documentation_page_tags(count)' : ''}
      `);

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: tags, error } = await query
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching documentation tags:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch documentation tags' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tags
    });

  } catch (error) {
    console.error('Error in admin docs tags GET:', error);
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

    const supabase = await createDatabaseSupabaseClient();
    const body = await request.json();

    const {
      name,
      slug,
      description,
      color = '#6366F1'
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Create the tag
    const { data: tag, error: tagError } = await supabase
      .from('documentation_tags')
      .insert({
        name,
        slug: finalSlug,
        description,
        color
      })
      .select()
      .single();

    if (tagError) {
      console.error('Error creating documentation tag:', tagError);
      return NextResponse.json(
        { success: false, error: 'Failed to create documentation tag' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tag
    });

  } catch (error) {
    console.error('Error in admin docs tags POST:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 