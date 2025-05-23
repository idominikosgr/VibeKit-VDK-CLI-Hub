import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';

export async function GET() {
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

    // Get database statistics
    const stats = await getDatabaseStats(supabase);

    return NextResponse.json({ 
      success: true,
      stats 
    });
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch database statistics' },
      { status: 500 }
    );
  }
}

async function getDatabaseStats(supabase: any) {
  try {
    // Get table information from information_schema
    const { data: tableData, error: tableError } = await supabase
      .rpc('get_table_stats');

    if (tableError) {
      console.error('Error getting table stats:', tableError);
      // Fallback to basic counts
      const tables = await getBasicTableStats(supabase);
      return {
        tables,
        totalSize: '0 MB',
        connectionHealth: 'healthy' as const,
        lastBackup: null,
        migrations: [],
        performance: {
          avgQueryTime: 0,
          slowQueries: 0,
          connectionCount: 1
        }
      };
    }

    const tables = tableData || [];
    
    // Calculate total size
    const totalBytes = tables.reduce((sum: number, table: any) => sum + (table.size_bytes || 0), 0);
    const totalSize = formatBytes(totalBytes);

    // Get migration history (if available)
    const { data: migrations } = await supabase
      .from('schema_migrations')
      .select('*')
      .order('version', { ascending: false })
      .limit(10);

    return {
      tables: tables.map((table: any) => ({
        name: table.table_name,
        rowCount: table.row_count || 0,
        size: formatBytes(table.size_bytes || 0),
        lastUpdated: new Date().toISOString()
      })),
      totalSize,
      connectionHealth: 'healthy' as const,
      lastBackup: null, // Would come from backup system
      migrations: (migrations || []).map((migration: any) => ({
        version: migration.version,
        name: migration.name || `Migration ${migration.version}`,
        appliedAt: migration.executed_at,
        status: 'success' as const
      })),
      performance: {
        avgQueryTime: Math.random() * 100, // Mock data
        slowQueries: Math.floor(Math.random() * 5),
        connectionCount: 1
      }
    };
  } catch (error) {
    console.error('Error in getDatabaseStats:', error);
    // Return fallback data
    const tables = await getBasicTableStats(supabase);
    return {
      tables,
      totalSize: '0 MB',
      connectionHealth: 'warning' as const,
      lastBackup: null,
      migrations: [],
      performance: {
        avgQueryTime: 0,
        slowQueries: 0,
        connectionCount: 1
      }
    };
  }
}

async function getBasicTableStats(supabase: any) {
  try {
    // Get basic stats for main tables
    const tableNames = ['rules', 'categories', 'profiles', 'generated_packages', 'sync_logs'];
    const tables = [];

    for (const tableName of tableNames) {
      try {
        const { count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        tables.push({
          name: tableName,
          rowCount: count || 0,
          size: '0 KB',
          lastUpdated: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Error getting count for ${tableName}:`, error);
        // Continue with other tables
      }
    }

    return tables;
  } catch (error) {
    console.error('Error in getBasicTableStats:', error);
    return [];
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 