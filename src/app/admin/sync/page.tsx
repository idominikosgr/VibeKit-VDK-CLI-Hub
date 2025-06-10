// Admin Sync Dashboard
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface SyncLog {
  id: string;
  created_at: string;
  sync_type: string;
  added_count: number;
  updated_count: number;
  error_count: number;
  duration_ms: number;
}

export default function RuleSyncPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [syncResults, setSyncResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [cleanupOrphaned, setCleanupOrphaned] = useState(true);
  const [syncStats, setSyncStats] = useState<any>(null);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [logsPage, setLogsPage] = useState(1);
  const [logsPagination, setLogsPagination] = useState<{
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }>({
    page: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0
  });

  // Load current stats on mount
  const loadSyncStats = async () => {
    try {
      const response = await fetch('/api/admin/sync');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load sync stats');
      }
      
      const data = await response.json();
      setSyncStats(data);
    } catch (err) {
      console.error('Error loading sync stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sync stats');
    }
  };

  // Load sync logs
  const loadSyncLogs = async (page = 1) => {
    try {
      const response = await fetch(`/api/admin/sync-logs?page=${page}&limit=5`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load sync logs');
      }
      
      const data = await response.json();
      setSyncLogs(data.logs || []);
      setLogsPagination(data.pagination);
      setLogsPage(page);
    } catch (err) {
      console.error('Error loading sync logs:', err);
      // Just log the error and continue - don't block the whole page
    }
  };

  // Trigger a sync operation
  const triggerSync = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSyncResults(null);
      
      const response = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cleanup: cleanupOrphaned
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sync operation failed');
      }
      
      const data = await response.json();
      setSyncResults(data);
      
      // Refresh stats and logs
      await Promise.all([
        loadSyncStats(),
        loadSyncLogs(1)
      ]);
      
    } catch (err) {
      console.error('Error during sync:', err);
      setError(err instanceof Error ? err.message : 'Sync operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };
  
  // Format duration for display
  const formatDuration = (ms: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Load initial data when page loads
  useEffect(() => {
    loadSyncStats();
    loadSyncLogs();
  }, []);

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Rule Synchronization</h1>
          <p className="text-muted-foreground mt-2">
            Synchronize rules from the filesystem to the Supabase database.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <Icons.alertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Stats</CardTitle>
              <CardDescription>
                Current state of rules and categories in the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              {syncStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Rules</p>
                      <p className="text-2xl font-bold">{syncStats.stats.ruleCount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Categories</p>
                      <p className="text-2xl font-bold">{syncStats.stats.categoryCount}</p>
                    </div>
                  </div>
                  
                  {syncStats.lastSync && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-muted-foreground">Last Sync</p>
                      <p className="text-sm">
                        {formatDate(syncStats.lastSync.created_at)}
                      </p>
                      <p className="text-sm">
                        {syncStats.lastSync.added_count} rules created, {syncStats.lastSync.updated_count} updated
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-center py-4">
                  <Icons.spinner className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={loadSyncStats} disabled={isLoading}>
                Refresh Stats
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Synchronize Rules</CardTitle>
              <CardDescription>
                Scan rule files and update the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="cleanup" 
                    checked={cleanupOrphaned} 
                    onCheckedChange={(checked) => setCleanupOrphaned(checked as boolean)}
                  />
                  <label 
                    htmlFor="cleanup" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Clean up orphaned rules (delete rules that no longer exist in filesystem)
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={triggerSync} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Icons.refresh className="mr-2 h-4 w-4" />
                    Start Sync
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {syncResults && (
          <Card>
            <CardHeader>
              <CardTitle>Sync Results</CardTitle>
              <CardDescription>
                Results of the last synchronization operation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Categories Created</p>
                    <p className="text-xl font-bold">{syncResults.sync.categoriesCreated}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Categories Updated</p>
                    <p className="text-xl font-bold">{syncResults.sync.categoriesUpdated}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rules Created</p>
                    <p className="text-xl font-bold">{syncResults.sync.rulesCreated}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rules Updated</p>
                    <p className="text-xl font-bold">{syncResults.sync.rulesUpdated}</p>
                  </div>
                </div>

                {syncResults.cleanup && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium">Cleanup Results</p>
                    <p className="text-sm">
                      {syncResults.cleanup.rulesDeleted} orphaned rules deleted
                    </p>
                  </div>
                )}

                {syncResults.sync.errors.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-destructive">Errors</p>
                    <ul className="text-sm list-disc pl-5 space-y-1 mt-2">
                      {syncResults.sync.errors.map((error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Sync History</CardTitle>
            <CardDescription>
              Recent rule synchronization operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {syncLogs.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Errors</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {syncLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{formatDate(log.created_at)}</TableCell>
                        <TableCell>{log.sync_type}</TableCell>
                        <TableCell>{log.added_count}</TableCell>
                        <TableCell>{log.updated_count}</TableCell>
                        <TableCell>
                          {log.error_count > 0 ? (
                            <span className="text-destructive">{log.error_count}</span>
                          ) : (
                            <span>0</span>
                          )}
                        </TableCell>
                        <TableCell>{formatDuration(log.duration_ms)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {logsPagination.totalPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => logsPage > 1 && loadSyncLogs(logsPage - 1)}
                          className={logsPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {/* Generate page links */}
                      {Array.from({ length: Math.min(5, logsPagination.totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => loadSyncLogs(pageNum)}
                              isActive={pageNum === logsPage}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => logsPage < logsPagination.totalPages && loadSyncLogs(logsPage + 1)}
                          className={logsPage >= logsPagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No sync logs found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
