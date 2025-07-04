'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartBarIcon,
  TrendUpIcon,
  UsersIcon,
  FileTextIcon,
  EyeIcon,
  HeartIcon,
  DownloadIcon,
  PulseIcon,
  CalendarIcon,
  ClockIcon,
  TargetIcon,
  GlobeIcon,
  CursorClickIcon,
  DeviceMobileIcon,
  MonitorIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SpinnerIcon,
} from '@phosphor-icons/react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

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
    downloadsOverTime: Array<{
      date: string;
      downloads: number;
      users: number;
    }>;
  };
  userPulse: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    newUsersThisWeek: number;
    activityOverTime: Array<{
      date: string;
      daily: number;
      weekly: number;
      monthly: number;
    }>;
  };
  setupWizard: {
    totalGenerations: number;
    popularStacks: Array<{
      name: string;
      count: number;
      percentage: number;
    }>;
    outputFormats: Array<{
      format: string;
      count: number;
      percentage: number;
    }>;
  };
  syncMetrics: {
    totalSyncs: number;
    averageDuration: number;
    lastSyncSuccess: boolean;
    errorRate: number;
    syncHistory: Array<{
      date: string;
      syncs: number;
      errors: number;
      avgDuration: number;
    }>;
  };
}

// Chart configurations
const chartConfig = {
  downloads: {
    label: "Downloads",
    color: "hsl(var(--chart-1))",
  },
  users: {
    label: "Users", 
    color: "hsl(var(--chart-2))",
  },
  daily: {
    label: "Daily Active",
    color: "hsl(var(--chart-1))",
  },
  weekly: {
    label: "Weekly Active", 
    color: "hsl(var(--chart-2))",
  },
  monthly: {
    label: "Monthly Active",
    color: "hsl(var(--chart-3))",
  },
  syncs: {
    label: "Syncs",
    color: "hsl(var(--chart-4))",
  },
  errors: {
    label: "Errors",
    color: "hsl(var(--destructive))",
  },
};

// Color palette for pie charts using semantic chart colors
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))", 
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
  "hsl(var(--chart-11))",
  "hsl(var(--chart-12))",
];

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
          <SpinnerIcon className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <ChartBarIcon className="h-4 w-4" />
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
          <ChartBarIcon className="h-4 w-4" />
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
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-accent to-accent/80 flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
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
                  <FileTextIcon className="w-4 h-4 text-primary" />
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
                  <DownloadIcon className="w-4 h-4 text-secondary" />
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
                  <UsersIcon className="w-4 h-4 text-accent" />
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
                  <DownloadIcon className="w-4 h-4 text-muted-foreground" />
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
                  <ClockIcon className="w-4 h-4 text-destructive" />
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
            <TabsTrigger value="users">User Pulse</TabsTrigger>
            <TabsTrigger value="wizard">Rule Generator</TabsTrigger>
            <TabsTrigger value="sync">Sync Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Downloaded Rules Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Downloaded Rules</CardTitle>
                  <CardDescription>Popular rules by download count</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[300px]"
                  >
                    <BarChart
                      data={data.ruleStats.mostDownloaded.slice(0, 8)}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 80,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="title" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="downloads" 
                        fill="var(--color-downloads)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Downloads Over Time Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Downloads Over Time</CardTitle>
                  <CardDescription>Download trends and user acquisition</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[300px]"
                  >
                    <AreaChart
                      data={data.ruleStats.downloadsOverTime}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend 
                        content={(props) => (
                          <ChartLegendContent 
                            payload={props.payload} 
                            verticalAlign={props.verticalAlign}
                          />
                        )} 
                      />
                      <Area
                        type="monotone"
                        dataKey="downloads"
                        stackId="1"
                        stroke="var(--color-downloads)"
                        fill="var(--color-downloads)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stackId="2"
                        stroke="var(--color-users)"
                        fill="var(--color-users)"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recently Added Rules Table */}
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
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <PulseIcon className="w-4 h-4 text-secondary" />
                    <div>
                      <p className="text-2xl font-bold">{formatNumber(data.userPulse.dailyActiveUsers)}</p>
                      <p className="text-xs text-muted-foreground">Daily Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{formatNumber(data.userPulse.weeklyActiveUsers)}</p>
                      <p className="text-xs text-muted-foreground">Weekly Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendUpIcon className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-2xl font-bold">{formatNumber(data.userPulse.monthlyActiveUsers)}</p>
                      <p className="text-xs text-muted-foreground">Monthly Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-2xl font-bold">{formatNumber(data.userPulse.newUsersThisWeek)}</p>
                      <p className="text-xs text-muted-foreground">New This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Pulse Over Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Pulse Over Time</CardTitle>
                <CardDescription>Daily, weekly, and monthly active user trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[400px]"
                >
                  <LineChart
                    data={data.userPulse.activityOverTime}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend 
                      content={(props) => (
                        <ChartLegendContent 
                          payload={props.payload} 
                          verticalAlign={props.verticalAlign}
                        />
                      )} 
                    />
                    <Line
                      type="monotone"
                      dataKey="daily"
                      stroke="var(--color-daily)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weekly"
                      stroke="var(--color-weekly)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="monthly"
                      stroke="var(--color-monthly)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wizard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Tech Stacks Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Tech Stacks</CardTitle>
                  <CardDescription>Most selected technologies in Rule Generator</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[300px]"
                  >
                    <PieChart>
                      <Pie
                        data={data.setupWizard.popularStacks}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {data.setupWizard.popularStacks.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-4 space-y-2">
                    {data.setupWizard.popularStacks.slice(0, 6).map((stack, index) => (
                      <div key={stack.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          />
                          <span>{stack.name}</span>
                        </div>
                        <span className="font-medium">{formatNumber(stack.count)} ({stack.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Output Format Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Output Format Distribution</CardTitle>
                  <CardDescription>Preferred package formats</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="min-h-[300px]"
                  >
                    <PieChart>
                      <Pie
                        data={data.setupWizard.outputFormats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ format, percentage }) => `${format} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {data.setupWizard.outputFormats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-4 space-y-2">
                    {data.setupWizard.outputFormats.map((format, index) => (
                      <div key={format.format} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          />
                          <span className="capitalize">{format.format}</span>
                        </div>
                        <span className="font-medium">{formatNumber(format.count)} ({format.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Rule Generator Summary</CardTitle>
                <CardDescription>Overall wizard usage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <TargetIcon className="w-5 h-5 text-primary" />
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
                    <TargetIcon className="w-4 h-4 text-primary" />
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
                    <ClockIcon className="w-4 h-4 text-secondary" />
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
                    <PulseIcon className={`w-4 h-4 ${data.syncMetrics.lastSyncSuccess ? 'text-secondary' : 'text-destructive'}`} />
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
                    <TrendUpIcon className={`w-4 h-4 ${data.syncMetrics.errorRate < 5 ? 'text-secondary' : 'text-destructive'}`} />
                    <div>
                      <p className="text-lg font-bold">{data.syncMetrics.errorRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Error Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sync Performance Over Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sync Performance Over Time</CardTitle>
                <CardDescription>Sync frequency, errors, and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[400px]"
                >
                  <AreaChart
                    data={data.syncMetrics.syncHistory}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend 
                      content={(props) => (
                        <ChartLegendContent 
                          payload={props.payload} 
                          verticalAlign={props.verticalAlign}
                        />
                      )} 
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="syncs"
                      stackId="1"
                      stroke="var(--color-syncs)"
                      fill="var(--color-syncs)"
                      fillOpacity={0.6}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="errors"
                      stackId="1"
                      stroke="var(--color-errors)"
                      fill="var(--color-errors)"
                      fillOpacity={0.6}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgDuration"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 