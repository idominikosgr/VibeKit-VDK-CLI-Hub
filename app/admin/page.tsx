'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { 
  Settings, 
  Database, 
  RefreshCw, 
  Users, 
  FileText, 
  BarChart3, 
  Shield,
  GitBranch,
  Download,
  Eye
} from 'lucide-react';

interface AdminStats {
  ruleCount: number;
  categoryCount: number;
  userCount: number;
  lastSyncDate: string | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    ruleCount: 0,
    categoryCount: 0,
    userCount: 0,
    lastSyncDate: null
  });
  const [error, setError] = useState<string | null>(null);

  // Check admin authorization and load stats
  useEffect(() => {
    checkAuthAndLoadStats();
  }, []);

  const checkAuthAndLoadStats = async () => {
    try {
      // Check if user has admin access
      const authResponse = await fetch('/api/admin/sync');
      if (authResponse.status === 403) {
        setError('Unauthorized: Admin access required');
        setIsLoading(false);
        return;
      }
      
      if (!authResponse.ok) {
        throw new Error('Failed to verify admin access');
      }

      setIsAuthorized(true);
      
      // Load dashboard stats
      const data = await authResponse.json();
      setStats({
        ruleCount: data.stats?.ruleCount || 0,
        categoryCount: data.stats?.categoryCount || 0,
        userCount: data.stats?.userCount || 0,
        lastSyncDate: data.lastSync?.created_at || null
      });
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load admin dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const adminActions = [
    {
      title: 'Rule Synchronization',
      description: 'Sync rules from GitHub, view sync logs, and manage rule database',
      icon: RefreshCw,
      href: '/admin/sync',
      color: 'from-primary to-primary/80',
      stats: [`${stats.ruleCount} rules`, `${stats.categoryCount} categories`]
    },
    {
      title: 'User Management',
      description: 'Manage user accounts, permissions, and admin access',
      icon: Users,
      href: '/admin/users',
      color: 'from-secondary to-secondary/80',
      stats: [`${stats.userCount} users`, 'Roles & permissions']
    },
    {
      title: 'Analytics & Reports',
      description: 'View usage statistics, download reports, and monitor system health',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'from-accent to-accent/80',
      stats: ['Usage metrics', 'Performance data']
    },
    {
      title: 'Content Management',
      description: 'Manage rules, categories, and content moderation',
      icon: FileText,
      href: '/admin/content',
      color: 'from-muted-foreground to-muted-foreground/80',
      stats: ['Content review', 'Category management']
    },
    {
      title: 'System Settings',
      description: 'Configure system settings, API keys, and application behavior',
      icon: Settings,
      href: '/admin/settings',
      color: 'from-muted to-muted/80',
      stats: ['Configuration', 'Environment']
    },
    {
      title: 'Database Management',
      description: 'Database backups, migrations, and direct database access',
      icon: Database,
      href: '/admin/database',
      color: 'from-destructive to-destructive/80',
      stats: ['Backups', 'Migrations']
    }
  ];

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button variant="outline" onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your CodePilotRules Hub instance
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{stats.ruleCount}</p>
                    <p className="text-xs text-muted-foreground">Rules</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-2xl font-bold">{stats.categoryCount}</p>
                    <p className="text-xs text-muted-foreground">Categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{stats.userCount}</p>
                    <p className="text-xs text-muted-foreground">Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-bold">
                      {stats.lastSyncDate 
                        ? new Date(stats.lastSyncDate).toLocaleDateString()
                        : 'Never'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">Last Sync</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Admin Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action) => (
            <Card key={action.title} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                  {action.description}
                </CardDescription>
                <div className="flex flex-wrap gap-1">
                  {action.stats.map((stat, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-muted px-2 py-1 rounded-md"
                    >
                      {stat}
                    </span>
                  ))}
                </div>
                <div className="pt-2">
                  <Link href={action.href}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Access
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/sync">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Rules
                </Button>
              </Link>
              <Link href="/setup">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Test Setup Wizard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={checkAuthAndLoadStats}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Refresh Stats
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 