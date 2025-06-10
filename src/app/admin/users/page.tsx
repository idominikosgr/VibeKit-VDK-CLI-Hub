'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/icons';
import { 
  Users, 
  Shield, 
  UserPlus, 
  UserMinus, 
  Search,
  BarChart3,
  Calendar,
  Mail,
  Crown,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name?: string;
  github_username?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
}

interface AdminUser {
  email: string;
  added_at: string;
}

interface UserStats {
  totalUsers: number;
  newUsersThisWeek: number;
  activeUsersToday: number;
  totalAdmins: number;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    newUsersThisWeek: 0,
    activeUsersToday: 0,
    totalAdmins: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        loadUsers(),
        loadAdmins(),
        loadStats()
      ]);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    const response = await fetch('/api/admin/users');
    if (!response.ok) {
      throw new Error('Failed to load users');
    }
    const data = await response.json();
    setUsers(data.users || []);
  };

  const loadAdmins = async () => {
    const response = await fetch('/api/admin/admins');
    if (!response.ok) {
      throw new Error('Failed to load admins');
    }
    const data = await response.json();
    setAdmins(data.admins || []);
  };

  const loadStats = async () => {
    const response = await fetch('/api/admin/users/stats');
    if (!response.ok) {
      throw new Error('Failed to load user stats');
    }
    const data = await response.json();
    setStats(data.stats);
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsAddingAdmin(true);
    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newAdminEmail.trim() })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add admin');
      }

      toast.success('Admin added successfully');
      setNewAdminEmail('');
      await loadAdmins();
      await loadStats();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add admin');
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (!confirm(`Are you sure you want to remove admin access for ${email}?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/admins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to remove admin');
      }

      toast.success('Admin removed successfully');
      await loadAdmins();
      await loadStats();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove admin');
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isUserAdmin = (email: string) => {
    return admins.some(admin => admin.email === email);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading user management...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-secondary to-secondary/80 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground">
                Manage user accounts, permissions, and admin access
              </p>
            </div>
          </div>

          {/* User Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-2xl font-bold">{stats.newUsersThisWeek}</p>
                    <p className="text-xs text-muted-foreground">New This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{stats.activeUsersToday}</p>
                    <p className="text-xs text-muted-foreground">Active Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalAdmins}</p>
                    <p className="text-xs text-muted-foreground">Admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Admin Management */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Management</CardTitle>
            <CardDescription>
              Manage administrator access and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Admin */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter email to grant admin access"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAdmin()}
              />
              <Button 
                onClick={handleAddAdmin} 
                disabled={isAddingAdmin}
                className="whitespace-nowrap"
              >
                {isAddingAdmin ? (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Add Admin
              </Button>
            </div>

            {/* Current Admins */}
            <div className="space-y-2">
              <h4 className="font-medium">Current Administrators</h4>
              <div className="space-y-2">
                {admins.map((admin) => (
                  <div key={admin.email} className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-primary" />
                      <span className="font-medium">{admin.email}</span>
                      <Badge variant="secondary" className="text-xs">
                        Added {formatDate(admin.added_at)}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAdmin(admin.email)}
                    >
                      <UserMinus className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  View and manage user accounts
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={user.name || user.email}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user.name || 'N/A'}</p>
                          {user.github_username && (
                            <p className="text-xs text-muted-foreground">@{user.github_username}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {isUserAdmin(user.email) ? (
                        <Badge variant="default">
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline">User</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      {user.last_sign_in_at ? formatDateTime(user.last_sign_in_at) : 'Never'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {!isUserAdmin(user.email) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setNewAdminEmail(user.email);
                              handleAddAdmin();
                            }}
                          >
                            Make Admin
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 