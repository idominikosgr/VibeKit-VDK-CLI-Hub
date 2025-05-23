import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/auth-provider';

export interface AdminStatus {
  isAdmin: boolean;
  isLoading: boolean;
  error?: string;
}

export function useAdmin(): AdminStatus {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const checkAdminStatus = useCallback(async (currentUser: any) => {
    // Reset state
    setError(undefined);
    setIsLoading(true);

    try {
      // Create an AbortController for request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Make a simple request to an admin endpoint to check if user has admin access
      const response = await fetch('/api/admin/sync', {
        method: 'GET',
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If user can access admin endpoint, they're an admin
      setIsAdmin(response.ok && response.status !== 403);
      
      if (!response.ok && response.status !== 403) {
        // Only set error for non-403 status codes (403 just means not admin)
        setError('Failed to check admin status');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.error('Admin status check timed out');
        setError('Admin status check timed out');
      } else {
        console.error('Error checking admin status:', err);
        setError('Error checking admin status');
      }
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    // If user is not authenticated, they're definitely not admin
    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    // Check admin status for authenticated user
    checkAdminStatus(user);
  }, [user, authLoading, checkAdminStatus]);

  return {
    isAdmin,
    isLoading,
    error,
  };
} 