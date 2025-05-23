import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();

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

    let deletedRows = 0;

    // Cleanup old sync logs (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: deletedSyncLogs } = await supabase
      .from('sync_logs')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString());

    deletedRows += deletedSyncLogs || 0;

    // Cleanup expired generated packages
    const { count: deletedPackages } = await supabase
      .from('generated_packages')
      .delete()
      .lt('expires_at', new Date().toISOString());

    deletedRows += deletedPackages || 0;

    // Log the cleanup operation
    const { error: logError } = await supabase
      .from('sync_logs')
      .insert({
        sync_type: 'cleanup',
        added_count: 0,
        updated_count: 0,
        error_count: 0,
        duration_ms: 1000
      });

    if (logError) {
      console.error('Error logging cleanup:', logError);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Database cleanup completed successfully',
      deletedRows,
      cleanupActions: [
        `Deleted ${deletedSyncLogs || 0} old sync logs`,
        `Deleted ${deletedPackages || 0} expired packages`
      ],
      completed_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error cleaning up database:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup database' },
      { status: 500 }
    );
  }
} 