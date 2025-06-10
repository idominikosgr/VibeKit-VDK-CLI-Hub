// API route for fetching sync logs
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

/**
 * Check if the user is an admin
 */
async function isAdmin(email: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('admins')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  return !!data;
}

/**
 * GET handler for fetching sync logs
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get URL parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const offset = (page - 1) * limit;
    
    // Fetch sync logs with pagination
    const { data: logs, error, count } = await supabase
      .from('sync_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw error;
    }
    
    // Return logs with pagination info
    return NextResponse.json({
      logs,
      pagination: {
        page,
        pageSize: limit,
        totalCount: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0
      }
    });
  } catch (error) {
    console.error('[API] Error fetching sync logs:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch sync logs',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
