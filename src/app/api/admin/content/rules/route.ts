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

    // Get all rules with basic statistics and category information
    const { data: rules, error: rulesError } = await supabase
      .from('rules')
      .select(`
        id,
        title,
        description,
        downloads,
        votes,
        created_at,
        updated_at,
        categories!rules_category_id_fkey(name)
      `)
      .order('updated_at', { ascending: false });

    if (rulesError) {
      throw rulesError;
    }

    // Transform rules to match expected interface
    const formattedRules = (rules || []).map(rule => ({
      id: rule.id,
      title: rule.title,
      category: rule.categories?.name || 'Uncategorized',
      status: 'active' as const, // All rules in DB are considered active
      downloads: rule.downloads || 0,
      created_at: rule.created_at,
      updated_at: rule.updated_at
    }));

    return NextResponse.json({ 
      success: true,
      rules: formattedRules 
    });
  } catch (error) {
    console.error('Error fetching rules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rules' },
      { status: 500 }
    );
  }
} 