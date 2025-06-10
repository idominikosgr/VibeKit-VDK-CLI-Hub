'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/icons';
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  Archive,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Activity,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface DatabaseStats {
  tables: Array<{
    name: string;
    rowCount: number;
    size: string;
    lastUpdated: string;
  }>;
  totalSize: string;
  connectionHealth: 'healthy' | 'warning' | 'error';
  lastBackup: string | null;
  migrations: Array<{
    version: string;
    name: string;
    appliedAt: string;
    status: 'success' | 'failed';
  }>;
  performance: {
    avgQueryTime: number;
    slowQueries: number;
    connectionCount: number;
  };
}

export default function DatabaseManagementPage() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDatabaseStats();
  }, []);

  const loadDatabaseStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/database/stats');
      
      if (!response.ok) {
        throw new Error('Failed to load database statistics');
      }
      
      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error loading database stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load database statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const createBackup = async () => {
    setIsBackingUp(true);
    try {
      const response = await fetch('/api/admin/database/backup', {
        method: 'POST'
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success('Database backup created successfully');
        loadDatabaseStats(); // Refresh stats
      } else {
        throw new Error(result.error || 'Backup failed');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create backup');
    } finally {
      setIsBackingUp(false);
    }
  };

  const optimizeDatabase = async () => {
    setIsOptimizing(true);
    try {
      const response = await fetch('/api/admin/database/optimize', {
        method: 'POST'
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success('Database optimization completed');
        loadDatabaseStats(); // Refresh stats
      } else {
        throw new Error(result.error || 'Optimization failed');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to optimize database');
    } finally {
      setIsOptimizing(false);
    }
  };

  const cleanupOldData = async () => {
    if (!confirm('Are you sure you want to cleanup old data? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/database/cleanup', {
        method: 'POST'
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(`Cleanup completed. ${result.deletedRows} rows removed.`);
        loadDatabaseStats(); // Refresh stats
      } else {
        throw new Error(result.error || 'Cleanup failed');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to cleanup database');
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-secondary" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Database className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading database statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <Database className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={loadDatabaseStats}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container py-10">
        <Alert>
          <Database className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>Database statistics could not be loaded</AlertDescription>
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
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-destructive to-destructive/80 flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Database Management</h1>
                <p className="text-muted-foreground">
                  Monitor database health, manage backups, and perform maintenance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={loadDatabaseStats}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Database Health Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  {getHealthIcon(stats.connectionHealth)}
                  <div>
                    <p className="text-sm font-bold capitalize">{stats.connectionHealth}</p>
                    <p className="text-xs text-muted-foreground">Health Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-bold">{stats.totalSize}</p>
                    <p className="text-xs text-muted-foreground">Total Size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-sm font-bold">{stats.performance.connectionCount}</p>
                    <p className="text-xs text-muted-foreground">Connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-sm font-bold">{stats.performance.avgQueryTime}ms</p>
                    <p className="text-xs text-muted-foreground">Avg Query Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Database Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Database Operations</CardTitle>
            <CardDescription>
              Perform maintenance operations and manage database health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Archive className="w-4 w-4 text-primary" />
                      <h4 className="font-medium">Backup Database</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Create a full backup of the database
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last backup: {stats.lastBackup 
                        ? new Date(stats.lastBackup).toLocaleDateString()
                        : 'Never'
                      }
                    </p>
                    <Button 
                      onClick={createBackup} 
                      disabled={isBackingUp}
                      className="w-full"
                      size="sm"
                    >
                      {isBackingUp ? (
                        <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Create Backup
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 w-4 text-secondary" />
                      <h4 className="font-medium">Optimize Tables</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Optimize database tables for better performance
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Slow queries: {stats.performance.slowQueries}
                    </p>
                    <Button 
                      onClick={optimizeDatabase} 
                      disabled={isOptimizing}
                      className="w-full"
                      size="sm"
                      variant="outline"
                    >
                      {isOptimizing ? (
                        <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      Optimize
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 w-4 text-destructive" />
                      <h4 className="font-medium">Cleanup Old Data</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Remove old logs and expired data
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Clean up sync logs, expired packages
                    </p>
                    <Button 
                      onClick={cleanupOldData} 
                      className="w-full"
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cleanup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Table Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Table Statistics</CardTitle>
            <CardDescription>
              Overview of database tables and their usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead>Row Count</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.tables.map((table) => (
                  <TableRow key={table.name}>
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell>{table.rowCount.toLocaleString()}</TableCell>
                    <TableCell>{table.size}</TableCell>
                    <TableCell>{new Date(table.lastUpdated).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Migration History */}
        <Card>
          <CardHeader>
            <CardTitle>Migration History</CardTitle>
            <CardDescription>
              Database schema migration history and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.migrations.map((migration) => (
                <div key={migration.version} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-3">
                    <Badge variant={migration.status === 'success' ? 'default' : 'destructive'}>
                      {migration.status}
                    </Badge>
                    <div>
                      <p className="font-medium">v{migration.version}</p>
                      <p className="text-sm text-muted-foreground">{migration.name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(migration.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 