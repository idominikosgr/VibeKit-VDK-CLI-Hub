import { useState, useEffect } from 'react';
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

  useEffect(() => {
    async function checkAdminStatus() {
      // Reset state
      setError(undefined);
      setIsLoading(true);

      // If user is not authenticated, they're definitely not admin
      if (!user || authLoading) {
        setIsAdmin(false);
        setIsLoading(authLoading);
        return;
      }

      try {
        // Make a simple request to an admin endpoint to check if user has admin access
        const response = await fetch('/api/admin/sync', {
          method: 'GET',
          credentials: 'include',
        });

        // If user can access admin endpoint, they're an admin
        setIsAdmin(response.ok && response.status !== 403);
        
        if (!response.ok && response.status !== 403) {
          // Only set error for non-403 status codes (403 just means not admin)
          setError('Failed to check admin status');
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false);
        setError('Error checking admin status');
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [user, authLoading]);

  return {
    isAdmin,
    isLoading,
    error,
  };
} 