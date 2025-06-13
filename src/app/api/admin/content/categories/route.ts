import { NextResponse } from 'next/server';
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client';

export async function GET() {
  try {
    const supabase = await createDatabaseSupabaseClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin using the admins table
    const { data: adminCheck } = await supabase
      .from('admins')
      .select('email')
      .eq('email', user.email)
      .single();

    if (!adminCheck) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all categories with rule counts
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        description,
        created_at,
        rules(count)
      `)
      .order('name', { ascending: true });

    if (categoriesError) {
      throw categoriesError;
    }

    // Transform categories to match expected interface
    const formattedCategories = (categories || []).map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      rule_count: Array.isArray(category.rules) ? category.rules.length : 0,
      created_at: category.created_at
    }));

    return NextResponse.json({ 
      success: true,
      categories: formattedCategories 
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 