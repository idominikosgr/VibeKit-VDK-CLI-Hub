'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Users, 
  FileText, 
  Activity,
  Calendar,
  Clock,
  Package,
  Zap,
  Eye,
  GitBranch
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalRules: number;
    totalDownloads: number;
    totalUsers: number;
    setupPackagesGenerated: number;
    avgSyncTime: number;
  };
  ruleStats: {
    mostDownloaded: Array<{
      id: string;
      title: string;
      downloads: number;
      category: string;
    }>;
    recentlyAdded: Array<{
      id: string;
      title: string;
      created_at: string;
      category: string;
    }>;
  };
  userActivity: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    newUsersThisWeek: number;
  };
  setupWizard: {
    totalGenerations: number;
    popularStacks: Array<{
      name: string;
      count: number;
    }>;
    outputFormats: Array<{
      format: string;
      count: number;
    }>;
  };
  syncMetrics: {
    totalSyncs: number;
    averageDuration: number;
    lastSyncSuccess: boolean;
    errorRate: number;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/analytics?period=${selectedPeriod}`);
      
      if (!response.ok) {
        throw new Error('Failed to load analytics data');
      }
      
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = seconds / 60;
    return `${minutes.toFixed(1)}m`;
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <BarChart3 className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={loadAnalytics}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-10">
        <Alert>
          <BarChart3 className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>No analytics data available</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Analytics & Reports</h1>
                <p className="text-muted-foreground">
                  Usage statistics, download reports, and system health monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={selectedPeriod === '7d' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedPeriod('7d')}
              >
                7 Days
              </Button>
              <Button 
                variant={selectedPeriod === '30d' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedPeriod('30d')}
              >
                30 Days
              </Button>
              <Button 
                variant={selectedPeriod === '90d' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedPeriod('90d')}
              >
                90 Days
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(data.overview.totalRules)}</p>
                    <p className="text-xs text-muted-foreground">Total Rules</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(data.overview.totalDownloads)}</p>
                    <p className="text-xs text-muted-foreground">Downloads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(data.overview.totalUsers)}</p>
                    <p className="text-xs text-muted-foreground">Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(data.overview.setupPackagesGenerated)}</p>
                    <p className="text-xs text-muted-foreground">Packages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-lg font-bold">{formatDuration(data.overview.avgSyncTime)}</p>
                    <p className="text-xs text-muted-foreground">Avg Sync</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="rules" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rules">Rule Analytics</TabsTrigger>
            <TabsTrigger value="users">User Activity</TabsTrigger>
            <TabsTrigger value="wizard">Setup Wizard</TabsTrigger>
            <TabsTrigger value="sync">Sync Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Downloaded Rules */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Downloaded Rules</CardTitle>
                  <CardDescription>Popular rules by download count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.ruleStats.mostDownloaded.map((rule, index) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="w-8 text-center">
                            {index + 1}
                          </Badge>
                          <div>
                            <p className="font-medium">{rule.title}</p>
                            <p className="text-xs text-muted-foreground">{rule.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4 text-muted-foreground" />
                          <span className="font-bold">{formatNumber(rule.downloads)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recently Added Rules */}
              <Card>
                <CardHeader>
                  <CardTitle>Recently Added Rules</CardTitle>
                  <CardDescription>Latest additions to the rule library</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.ruleStats.recentlyAdded.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <div>
                          <p className="font-medium">{rule.title}</p>
                          <p className="text-xs text-muted-foreground">{rule.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(rule.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(rule.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{formatNumber(data.userActivity.dailyActiveUsers)}</p>
                      <p className="text-xs text-muted-foreground">Daily Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{formatNumber(data.userActivity.weeklyActiveUsers)}</p>
                      <p className="text-xs text-muted-foreground">Weekly Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{formatNumber(data.userActivity.monthlyActiveUsers)}</p>
                      <p className="text-xs text-muted-foreground">Monthly Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">{formatNumber(data.userActivity.newUsersThisWeek)}</p>
                      <p className="text-xs text-muted-foreground">New This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="wizard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Tech Stacks */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Tech Stacks</CardTitle>
                  <CardDescription>Most selected technologies in setup wizard</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.setupWizard.popularStacks.map((stack, index) => (
                      <div key={stack.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-8 text-center">
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{stack.name}</span>
                        </div>
                        <span className="text-muted-foreground">{formatNumber(stack.count)} uses</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Output Format Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Output Format Distribution</CardTitle>
                  <CardDescription>Preferred package formats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.setupWizard.outputFormats.map((format) => (
                      <div key={format.format} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium capitalize">{format.format}</span>
                        </div>
                        <span className="text-muted-foreground">{formatNumber(format.count)} packages</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Setup Wizard Summary</CardTitle>
                <CardDescription>Overall wizard usage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-lg font-bold">{formatNumber(data.setupWizard.totalGenerations)}</p>
                      <p className="text-sm text-muted-foreground">Total Generations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{formatNumber(data.syncMetrics.totalSyncs)}</p>
                      <p className="text-xs text-muted-foreground">Total Syncs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-lg font-bold">{formatDuration(data.syncMetrics.averageDuration)}</p>
                      <p className="text-xs text-muted-foreground">Avg Duration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className={`w-4 h-4 ${data.syncMetrics.lastSyncSuccess ? 'text-green-500' : 'text-red-500'}`} />
                    <div>
                      <p className="text-lg font-bold">
                        {data.syncMetrics.lastSyncSuccess ? 'Success' : 'Failed'}
                      </p>
                      <p className="text-xs text-muted-foreground">Last Sync</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`w-4 h-4 ${data.syncMetrics.errorRate < 5 ? 'text-green-500' : 'text-red-500'}`} />
                    <div>
                      <p className="text-lg font-bold">{data.syncMetrics.errorRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Error Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 