'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { 
  GearIcon, 
  KeyIcon, 
  DatabaseIcon, 
  EnvelopeIcon, 
  GlobeIcon, 
  ShieldIcon, 
  ClockIcon,
  FloppyDiskIcon,
  ArrowsClockwiseIcon,
  WarningIcon,
  CheckCircleIcon,
  ArrowSquareOutIcon
} from "@phosphor-icons/react";
import { toast } from 'sonner';

interface SystemGear {
  github: {
    token: string;
    repoOwner: string;
    repoName: string;
    syncInterval: number;
    autoSync: boolean;
  };
  database: {
    connectionStatus: 'connected' | 'disconnected' | 'error';
    totalTables: number;
    totalRows: number;
    lastBackup: string | null;
    autoBackup: boolean;
  };
  email: {
    provider: string;
    smtpHost: string;
    smtpPort: number;
    username: string;
    enableNotifications: boolean;
  };
  system: {
    environment: string;
    version: string;
    uptime: number;
    maintenanceMode: boolean;
    debugMode: boolean;
    rateLimitEnabled: boolean;
    maxRequestsPerMinute: number;
  };
  security: {
    sessionTimeout: number;
    requireEmailVerification: boolean;
    allowPasswordReset: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
}

export default function SystemGearPage() {
  const [settings, setGear] = useState<SystemGear | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);

  useEffect(() => {
    loadGear();
  }, []);

  const loadGear = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/settings');
      
      if (!response.ok) {
        throw new Error('Failed to load settings');
      }
      
      const data = await response.json();
      setGear(data.settings);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (section: keyof SystemGear, key: string, value: any) => {
    if (!settings) return;
    
    setGear(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [key]: value
      }
    }));
    setPendingChanges(true);
  };

  const saveGear = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      toast.success('Gear saved successfully');
      setPendingChanges(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (type: 'github' | 'database' | 'email') => {
    try {
      const response = await fetch(`/api/admin/settings/test-${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(`${type} connection test successful`);
      } else {
        toast.error(result.error || `${type} connection test failed`);
      }
    } catch (err) {
      toast.error(`Failed to test ${type} connection`);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading system settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <GearIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={loadGear}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="container py-10">
        <Alert>
          <GearIcon className="h-4 w-4" />
          <AlertTitle>No Gear</AlertTitle>
          <AlertDescription>System settings could not be loaded</AlertDescription>
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
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                <GearIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">System Gear</h1>
                <p className="text-muted-foreground">
                  Configure system settings, API keys, and application behavior
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {pendingChanges && (
                <Badge variant="secondary">Unsaved changes</Badge>
              )}
              <Button onClick={saveGear} disabled={isSaving || !pendingChanges}>
                {isSaving ? (
                  <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <FloppyDiskIcon className="h-4 w-4 mr-2" />
                )}
                FloppyDisk Changes
              </Button>
            </div>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <GlobeIcon className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-sm font-bold capitalize">{settings.system.environment}</p>
                    <p className="text-xs text-muted-foreground">Environment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DatabaseIcon className={`w-4 h-4 ${settings.database.connectionStatus === 'connected' ? 'text-secondary' : 'text-destructive'}`} />
                  <div>
                    <p className="text-sm font-bold capitalize">{settings.database.connectionStatus}</p>
                    <p className="text-xs text-muted-foreground">Database</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-bold">{formatUptime(settings.system.uptime)}</p>
                    <p className="text-xs text-muted-foreground">Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <ShieldIcon className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-sm font-bold">v{settings.system.version}</p>
                    <p className="text-xs text-muted-foreground">Version</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gear Tabs */}
        <Tabs defaultValue="github" className="space-y-6">
          <TabsList>
            <TabsTrigger value="github">GitHub Integration</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="github" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>GitHub Configuration</CardTitle>
                <CardDescription>Gear for GitHub repository synchronization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="github-token">GitHub Token</Label>
                    <Input
                      id="github-token"
                      type="password"
                      value={settings.github.token}
                      onChange={(e) => updateSetting('github', 'token', e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repo-owner">Repository Owner</Label>
                    <Input
                      id="repo-owner"
                      value={settings.github.repoOwner}
                      onChange={(e) => updateSetting('github', 'repoOwner', e.target.value)}
                      placeholder="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repo-name">Repository Name</Label>
                    <Input
                      id="repo-name"
                      value={settings.github.repoName}
                      onChange={(e) => updateSetting('github', 'repoName', e.target.value)}
                      placeholder="ai.rules"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sync-interval">Sync Interval (hours)</Label>
                    <Input
                      id="sync-interval"
                      type="number"
                      value={settings.github.syncInterval}
                      onChange={(e) => updateSetting('github', 'syncInterval', parseInt(e.target.value))}
                      min="1"
                      max="168"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-sync"
                      checked={settings.github.autoSync}
                      onCheckedChange={(checked) => updateSetting('github', 'autoSync', checked)}
                    />
                    <Label htmlFor="auto-sync">Enable automatic synchronization</Label>
                  </div>
                  <Button variant="outline" onClick={() => testConnection('github')}>
                    <ArrowSquareOutIcon className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Management</CardTitle>
                <CardDescription>Database configuration and backup settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <DatabaseIcon className="w-4 h-4" />
                      <span className="font-medium">Connection Status</span>
                    </div>
                    <Badge variant={settings.database.connectionStatus === 'connected' ? 'default' : 'destructive'}>
                      {settings.database.connectionStatus}
                    </Badge>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <DatabaseIcon className="w-4 h-4" />
                      <span className="font-medium">Tables</span>
                    </div>
                    <p className="text-2xl font-bold">{settings.database.totalTables}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <DatabaseIcon className="w-4 h-4" />
                      <span className="font-medium">Total Rows</span>
                    </div>
                    <p className="text-2xl font-bold">{settings.database.totalRows.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Automatic Backups</h4>
                      <p className="text-sm text-muted-foreground">Enable scheduled database backups</p>
                    </div>
                    <Switch
                      checked={settings.database.autoBackup}
                      onCheckedChange={(checked) => updateSetting('database', 'autoBackup', checked)}
                    />
                  </div>
                  
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Last Backup</span>
                        <p className="text-sm text-muted-foreground">
                          {settings.database.lastBackup 
                            ? new Date(settings.database.lastBackup).toLocaleString()
                            : 'Never'
                          }
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => testConnection('database')}>
                        <ArrowsClockwiseIcon className="h-4 w-4 mr-2" />
                        Test Connection
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>SMTP settings and email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      value={settings.email.smtpHost}
                      onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input
                      id="smtp-port"
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                      placeholder="587"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input
                      id="smtp-username"
                      value={settings.email.username}
                      onChange={(e) => updateSetting('email', 'username', e.target.value)}
                      placeholder="your-email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-provider">Provider</Label>
                    <Input
                      id="email-provider"
                      value={settings.email.provider}
                      onChange={(e) => updateSetting('email', 'provider', e.target.value)}
                      placeholder="Gmail, Outlook, etc."
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email-notifications"
                      checked={settings.email.enableNotifications}
                      onCheckedChange={(checked) => updateSetting('email', 'enableNotifications', checked)}
                    />
                    <Label htmlFor="email-notifications">Enable email notifications</Label>
                  </div>
                  <Button variant="outline" onClick={() => testConnection('email')}>
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>General system settings and performance options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Maintenance Mode</h4>
                        <p className="text-sm text-muted-foreground">Temporarily disable public access</p>
                      </div>
                      <Switch
                        checked={settings.system.maintenanceMode}
                        onCheckedChange={(checked) => updateSetting('system', 'maintenanceMode', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Debug Mode</h4>
                        <p className="text-sm text-muted-foreground">Enable detailed error logging</p>
                      </div>
                      <Switch
                        checked={settings.system.debugMode}
                        onCheckedChange={(checked) => updateSetting('system', 'debugMode', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Rate Limiting</h4>
                        <p className="text-sm text-muted-foreground">Protect against API abuse</p>
                      </div>
                      <Switch
                        checked={settings.system.rateLimitEnabled}
                        onCheckedChange={(checked) => updateSetting('system', 'rateLimitEnabled', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-requests">Max Requests per Minute</Label>
                      <Input
                        id="max-requests"
                        type="number"
                        value={settings.system.maxRequestsPerMinute}
                        onChange={(e) => updateSetting('system', 'maxRequestsPerMinute', parseInt(e.target.value))}
                        min="1"
                        max="1000"
                        disabled={!settings.system.rateLimitEnabled}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Gear</CardTitle>
                <CardDescription>Authentication and security configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                      min="5"
                      max="10080"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-login">Max Login Attempts</Label>
                    <Input
                      id="max-login"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      min="3"
                      max="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockout-duration"
                      type="number"
                      value={settings.security.lockoutDuration}
                      onChange={(e) => updateSetting('security', 'lockoutDuration', parseInt(e.target.value))}
                      min="5"
                      max="1440"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Verification Required</h4>
                      <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                    </div>
                    <Switch
                      checked={settings.security.requireEmailVerification}
                      onCheckedChange={(checked) => updateSetting('security', 'requireEmailVerification', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Password Reset Enabled</h4>
                      <p className="text-sm text-muted-foreground">Allow users to reset their passwords</p>
                    </div>
                    <Switch
                      checked={settings.security.allowPasswordReset}
                      onCheckedChange={(checked) => updateSetting('security', 'allowPasswordReset', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 