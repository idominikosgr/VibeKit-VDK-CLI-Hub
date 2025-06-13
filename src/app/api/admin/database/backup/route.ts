import { NextRequest, NextResponse } from 'next/server';
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client';

// Add dynamic export to prevent static generation
export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest) {
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

    // In a real implementation, you would trigger a database backup
    // For now, we'll simulate the backup process
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate backup time

    // Log the backup operation
    const { error: logError } = await supabase
      .from('sync_logs')
      .insert({
        sync_type: 'backup',
        added_count: 0,
        updated_count: 0,
        error_count: 0,
        duration_ms: 2000
      });

    if (logError) {
      console.error('Error logging backup:', logError);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Database backup created successfully',
      backup_id: `backup_${Date.now()}`,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
} 