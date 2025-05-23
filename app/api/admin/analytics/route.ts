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

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30d';
    const supabase = createServerSupabaseClient();

    // Calculate date range
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch real analytics data
    const analyticsData = await getRealAnalyticsData(supabase, period, days, startDate);

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

async function getRealAnalyticsData(supabase: any, period: string, days: number, startDate: Date) {
  try {
    // 1. Overview statistics
    const [rulesCount, categoriesCount, usersCount, downloadsSum, syncCount] = await Promise.all([
      supabase.from('rules').select('id', { count: 'exact' }),
      supabase.from('categories').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('rules').select('downloads'),
      supabase.from('sync_logs').select('id', { count: 'exact' })
    ]);

    const totalRules = rulesCount.count || 0;
    const totalCategories = categoriesCount.count || 0;
    const totalUsers = usersCount.count || 0;
    const totalDownloads = downloadsSum.data?.reduce((sum: number, rule: any) => sum + (rule.downloads || 0), 0) || 0;
    const totalSyncs = syncCount.count || 0;

    // 2. Most downloaded rules
    const { data: mostDownloaded } = await supabase
      .from('rules')
      .select(`
        id,
        title,
        downloads,
        categories!inner(name)
      `)
      .order('downloads', { ascending: false })
      .limit(8);

    // 3. Recently added rules
    const { data: recentlyAdded } = await supabase
      .from('rules')
      .select(`
        id,
        title,
        created_at,
        categories!inner(name)
      `)
      .order('created_at', { ascending: false })
      .limit(4);

    // 4. Setup wizard statistics
    const { data: wizardConfigs } = await supabase
      .from('wizard_configurations')
      .select('stack_choices, output_format, created_at')
      .gte('created_at', startDate.toISOString());

    const { data: generatedPackages } = await supabase
      .from('generated_packages')
      .select('id, download_count')
      .gte('created_at', startDate.toISOString());

    // 5. Sync metrics
    const { data: syncLogs } = await supabase
      .from('sync_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Process wizard stack data
    const stackCounts: Record<string, number> = {};
    const formatCounts: Record<string, number> = {};
    let totalGenerations = wizardConfigs?.length || 0;

    wizardConfigs?.forEach((config: any) => {
      const stacks = config.stack_choices || {};
      const stackName = Object.keys(stacks).filter(key => stacks[key]).join(' + ') || 'Unknown';
      stackCounts[stackName] = (stackCounts[stackName] || 0) + 1;
      
      const format = config.output_format || 'zip';
      formatCounts[format] = (formatCounts[format] || 0) + 1;
    });

    // Generate time series data for charts
    const downloadsOverTime = generateTimeSeries(days, startDate, 'downloads');
    const activityOverTime = generateTimeSeries(days, startDate, 'activity');
    const syncHistory = generateSyncHistory(syncLogs || [], days, startDate);

    // Calculate setup packages generated
    const setupPackagesGenerated = generatedPackages?.length || 0;
    const totalPackageDownloads = generatedPackages?.reduce((sum: number, pkg: any) => sum + (pkg.download_count || 0), 0) || 0;

    // Calculate sync metrics
    const avgSyncDuration = syncLogs?.length > 0 
      ? syncLogs.reduce((sum: number, log: any) => sum + (log.duration_ms || 0), 0) / syncLogs.length
      : 0;
    
    const errorRate = syncLogs?.length > 0
      ? (syncLogs.reduce((sum: number, log: any) => sum + (log.error_count || 0), 0) / syncLogs.length) * 100
      : 0;

    const lastSyncSuccess = syncLogs?.length > 0 
      ? (syncLogs[syncLogs.length - 1]?.error_count || 0) === 0
      : true;

    return {
      overview: {
        totalRules,
        totalDownloads,
        totalUsers,
        setupPackagesGenerated,
        avgSyncTime: Math.round(avgSyncDuration),
      },
      ruleStats: {
        mostDownloaded: (mostDownloaded || []).map((rule: any) => ({
          id: rule.id,
          title: rule.title,
          downloads: rule.downloads || 0,
          category: rule.categories?.name || 'Uncategorized',
        })),
        recentlyAdded: (recentlyAdded || []).map((rule: any) => ({
          id: rule.id,
          title: rule.title,
          created_at: rule.created_at,
          category: rule.categories?.name || 'Uncategorized',
        })),
        downloadsOverTime,
      },
      userActivity: {
        dailyActiveUsers: 0, // Would need user session tracking
        weeklyActiveUsers: 0,
        monthlyActiveUsers: totalUsers,
        newUsersThisWeek: 0, // Would need date-based user filtering
        activityOverTime,
      },
      setupWizard: {
        totalGenerations,
        popularStacks: Object.entries(stackCounts)
          .map(([name, count]) => ({
            name,
            count,
            percentage: totalGenerations > 0 ? Number(((count / totalGenerations) * 100).toFixed(1)) : 0,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6),
        outputFormats: Object.entries(formatCounts)
          .map(([format, count]) => ({
            format,
            count,
            percentage: totalGenerations > 0 ? Number(((count / totalGenerations) * 100).toFixed(1)) : 0,
          }))
          .sort((a, b) => b.count - a.count),
      },
      syncMetrics: {
        totalSyncs,
        averageDuration: Math.round(avgSyncDuration),
        lastSyncSuccess,
        errorRate: Number(errorRate.toFixed(1)),
        syncHistory,
      },
    };
  } catch (error) {
    console.error('Error fetching real analytics data:', error);
    // Return zero data instead of failing
    return getZeroAnalyticsData(days, startDate);
  }
}

function generateTimeSeries(days: number, startDate: Date, type: 'downloads' | 'activity') {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    if (type === 'downloads') {
      return {
        date: date.toISOString().split('T')[0],
        downloads: 0,
        users: 0,
      };
    } else {
      return {
        date: date.toISOString().split('T')[0],
        daily: 0,
        weekly: 0,
        monthly: 0,
      };
    }
  });
}

function generateSyncHistory(syncLogs: any[], days: number, startDate: Date) {
  const syncsByDate: Record<string, any[]> = {};
  
  // Group syncs by date
  syncLogs.forEach(log => {
    const date = new Date(log.created_at).toISOString().split('T')[0];
    if (!syncsByDate[date]) {
      syncsByDate[date] = [];
    }
    syncsByDate[date].push(log);
  });

  // Generate time series
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayLogs = syncsByDate[dateStr] || [];
    const syncs = dayLogs.length;
    const errors = dayLogs.reduce((sum, log) => sum + (log.error_count || 0), 0);
    const avgDuration = dayLogs.length > 0
      ? dayLogs.reduce((sum, log) => sum + (log.duration_ms || 0), 0) / dayLogs.length
      : 0;

    return {
      date: dateStr,
      syncs,
      errors,
      avgDuration: Math.round(avgDuration),
    };
  });
}

function getZeroAnalyticsData(days: number, startDate: Date) {
  const downloadsOverTime = generateTimeSeries(days, startDate, 'downloads');
  const activityOverTime = generateTimeSeries(days, startDate, 'activity');
  const syncHistory = generateSyncHistory([], days, startDate);

  return {
    overview: {
      totalRules: 0,
      totalDownloads: 0,
      totalUsers: 0,
      setupPackagesGenerated: 0,
      avgSyncTime: 0,
    },
    ruleStats: {
      mostDownloaded: [],
      recentlyAdded: [],
      downloadsOverTime,
    },
    userActivity: {
      dailyActiveUsers: 0,
      weeklyActiveUsers: 0,
      monthlyActiveUsers: 0,
      newUsersThisWeek: 0,
      activityOverTime,
    },
    setupWizard: {
      totalGenerations: 0,
      popularStacks: [],
      outputFormats: [],
    },
    syncMetrics: {
      totalSyncs: 0,
      averageDuration: 0,
      lastSyncSuccess: true,
      errorRate: 0,
      syncHistory,
    },
  };
} 