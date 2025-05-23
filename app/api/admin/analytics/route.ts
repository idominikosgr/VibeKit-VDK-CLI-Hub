import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { requireAdmin } from '@/lib/middleware/admin-auth';

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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    const supabase = await createServerSupabaseClient();
    
    // Calculate date ranges based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Overview statistics
    const [
      rulesCount,
      usersCount,
      packagesCount,
      syncLogsResult
    ] = await Promise.all([
      supabase.from('rules').select('downloads', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('generated_packages').select('id', { count: 'exact' }),
      supabase.from('sync_logs').select('duration_ms').order('created_at', { ascending: false }).limit(10)
    ]);

    const totalDownloads = rulesCount.data?.reduce((sum, rule) => sum + (rule.downloads || 0), 0) || 0;
    const avgSyncTime = syncLogsResult.data?.length 
      ? syncLogsResult.data.reduce((sum, log) => sum + (log.duration_ms || 0), 0) / syncLogsResult.data.length 
      : 0;

    // Most downloaded rules
    const { data: mostDownloaded } = await supabase
      .from('rules')
      .select(`
        id,
        title,
        downloads,
        categories!inner(name)
      `)
      .order('downloads', { ascending: false })
      .limit(5);

    // Recently added rules
    const { data: recentlyAdded } = await supabase
      .from('rules')
      .select(`
        id,
        title,
        created_at,
        categories!inner(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    // User activity stats
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      newUsersWeek,
      activeUsersDay,
      activeUsersWeek,
      activeUsersMonth
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }).gte('created_at', weekAgo.toISOString()),
      supabase.from('profiles').select('id', { count: 'exact' }).gte('updated_at', dayAgo.toISOString()),
      supabase.from('profiles').select('id', { count: 'exact' }).gte('updated_at', weekAgo.toISOString()),
      supabase.from('profiles').select('id', { count: 'exact' }).gte('updated_at', monthAgo.toISOString())
    ]);

    // Setup wizard analytics
    const { data: wizardConfigs } = await supabase
      .from('wizard_configurations')
      .select('stack_choices, output_format')
      .gte('created_at', startDate.toISOString());

    // Analyze popular tech stacks
    const stackCounts: Record<string, number> = {};
    const formatCounts: Record<string, number> = {};

    wizardConfigs?.forEach(config => {
      // Count selected tech stacks
      if (config.stack_choices) {
        Object.entries(config.stack_choices).forEach(([key, value]) => {
          if (value) {
            stackCounts[key] = (stackCounts[key] || 0) + 1;
          }
        });
      }
      
      // Count output formats
      if (config.output_format) {
        formatCounts[config.output_format] = (formatCounts[config.output_format] || 0) + 1;
      }
    });

    const popularStacks = Object.entries(stackCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const outputFormats = Object.entries(formatCounts)
      .map(([format, count]) => ({ format, count }));

    // Sync performance metrics
    const { data: syncLogs } = await supabase
      .from('sync_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    const totalSyncs = syncLogs?.length || 0;
    const averageDuration = syncLogs?.length 
      ? syncLogs.reduce((sum, log) => sum + (log.duration_ms || 0), 0) / syncLogs.length 
      : 0;
    const lastSyncSuccess = syncLogs?.[0]?.error_count === 0;
    const errorRate = syncLogs?.length 
      ? (syncLogs.filter(log => (log.error_count || 0) > 0).length / syncLogs.length) * 100 
      : 0;

    const analyticsData = {
      overview: {
        totalRules: rulesCount.count || 0,
        totalDownloads,
        totalUsers: usersCount.count || 0,
        setupPackagesGenerated: packagesCount.count || 0,
        avgSyncTime
      },
      ruleStats: {
        mostDownloaded: (mostDownloaded || []).map(rule => ({
          id: rule.id,
          title: rule.title,
          downloads: rule.downloads || 0,
          category: rule.categories?.name || 'Unknown'
        })),
        recentlyAdded: (recentlyAdded || []).map(rule => ({
          id: rule.id,
          title: rule.title,
          created_at: rule.created_at,
          category: rule.categories?.name || 'Unknown'
        }))
      },
      userActivity: {
        dailyActiveUsers: activeUsersDay.count || 0,
        weeklyActiveUsers: activeUsersWeek.count || 0,
        monthlyActiveUsers: activeUsersMonth.count || 0,
        newUsersThisWeek: newUsersWeek.count || 0
      },
      setupWizard: {
        totalGenerations: wizardConfigs?.length || 0,
        popularStacks,
        outputFormats
      },
      syncMetrics: {
        totalSyncs,
        averageDuration,
        lastSyncSuccess,
        errorRate
      }
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 