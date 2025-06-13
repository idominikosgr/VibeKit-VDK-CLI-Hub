// Admin API for manually triggering GitHub sync
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client';
import { synchronizeRules, cleanupOrphanedRules } from '@/lib/services/rule-sync-service';
import { requireAdmin } from '@/lib/middleware/admin-auth';

const execAsync = promisify(exec);

/**
 * Check if the user is an admin
 */
async function isAdmin(email: string): Promise<boolean> {
  const supabase = await createDatabaseSupabaseClient();
  const { data } = await supabase
    .from('admins')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  return !!data;
}

/**
 * GET handler for fetching sync statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const supabase = await createDatabaseSupabaseClient();
    
    // Get count of rules and categories
    const [rulesResult, categoriesResult, usersResult, syncsResult] = await Promise.all([
      supabase.from('rules').select('count'),
      supabase.from('categories').select('count'),
      supabase.from('profiles').select('count'),
      supabase.from('sync_logs').select('*').order('created_at', { ascending: false }).limit(1)
    ]);
    
    if (rulesResult.error) {
      throw rulesResult.error;
    }
    
    if (categoriesResult.error) {
      throw categoriesResult.error;
    }

    if (usersResult.error) {
      throw usersResult.error;
    }
    
    // Return the stats
    return NextResponse.json({
      stats: {
        ruleCount: rulesResult.count || 0,
        categoryCount: categoriesResult.count || 0,
        userCount: usersResult.count || 0,
      },
      lastSync: syncsResult.data?.[0] || null
    });
  } catch (error) {
    console.error('[API] Error fetching sync stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch sync statistics',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler for triggering a sync operation
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { cleanup = true } = body;
    
    console.log('[API] Starting rule synchronization, cleanup:', cleanup);
    
    // Record start time
    const startTime = Date.now();
    
    // Perform the sync operation
    const syncResults = await synchronizeRules();
    
    // Clean up orphaned rules if requested
    let cleanupResults = null;
    if (cleanup) {
      cleanupResults = await cleanupOrphanedRules();
    }
    
    // Calculate duration
    const duration = Date.now() - startTime;
    
    // Log the sync operation to the database
    const supabase = await createDatabaseSupabaseClient();
    
    await supabase.from('sync_logs').insert({
      sync_type: 'manual',
      added_count: syncResults.rulesCreated,
      updated_count: syncResults.rulesUpdated,
      error_count: syncResults.errors.length + (cleanupResults ? cleanupResults.errors.length : 0),
      errors: syncResults.errors.length > 0 || (cleanupResults && cleanupResults.errors.length > 0) 
        ? [...syncResults.errors, ...(cleanupResults ? cleanupResults.errors : [])] 
        : null,
      duration_ms: duration
    });
    
    return NextResponse.json({
      sync: syncResults,
      cleanup: cleanupResults
    });
  } catch (error) {
    console.error('[API] Error during rule synchronization:', error);
    return NextResponse.json(
      { 
        error: 'Failed to synchronize rules',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
