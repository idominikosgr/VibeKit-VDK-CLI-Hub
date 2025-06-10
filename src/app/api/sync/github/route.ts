import { NextRequest, NextResponse } from 'next/server';
import { createGitHubSync } from '@/lib/services/github/github-sync';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

/**
 * API route for syncing rules from GitHub to Supabase
 * POST /api/sync/github
 * Optional query parameters:
 * - force: boolean - Force sync all rules, even if they haven't changed
 * - category: string - Sync only rules in a specific category
 * - path: string - Sync only rules in a specific path
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key for security
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.API_SECRET_KEY;
    
    // Skip auth check in development for easier testing
    if (process.env.NODE_ENV === 'production') {
      if (!authHeader || !apiKey || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== apiKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    
    // Parse query parameters
    const url = new URL(request.url);
    const force = url.searchParams.get('force') === 'true';
    const category = url.searchParams.get('category') || undefined;
    const path = url.searchParams.get('path') || undefined;
    
    // Initialize Supabase client (needed for the sync process)
    await createServerSupabaseClient();
    
    // Create GitHub sync instance with options
    const githubSync = createGitHubSync({
      force,
      category,
      path,
      logResults: true,
    });
    
    // Perform sync operation
    const result = await githubSync.syncAllRules();
    
    // Return result
    return NextResponse.json({
      success: true,
      added: result.added,
      updated: result.updated,
      errors: result.errors.length,
      duration: result.duration,
    });
  } catch (error) {
    console.error('Error in GitHub sync API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

/**
 * GET handler to check sync status
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get last sync record
    const { data: lastSync, error } = await supabase
      .from('sync_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to retrieve sync status',
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      lastSync: lastSync || null,
    });
  } catch (error) {
    console.error('Error checking sync status:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
