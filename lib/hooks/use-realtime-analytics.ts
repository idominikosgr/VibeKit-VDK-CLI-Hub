import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface RealtimeAnalytics {
  totalRules: number;
  totalUsers: number;
  totalDownloads: number;
  recentActivity: Array<{
    type: 'download' | 'vote' | 'user_signup';
    ruleId?: string;
    userId?: string;
    timestamp: string;
  }>;
}

export function useRealtimeAnalytics() {
  const [analytics, setAnalytics] = useState<RealtimeAnalytics>({
    totalRules: 0,
    totalUsers: 0,
    totalDownloads: 0,
    recentActivity: []
  });
  const [isConnected, setIsConnected] = useState(false);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    let channels: RealtimeChannel[] = [];

    const setupRealtimeSubscriptions = async () => {
      try {
        // Subscribe to rules table for new rules and download updates
        const rulesChannel = supabase
          .channel('rules-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'rules'
            },
            (payload: RealtimePostgresChangesPayload<any>) => {
              console.log('Rules change:', payload);
              
              if (payload.eventType === 'INSERT') {
                setAnalytics(prev => ({
                  ...prev,
                  totalRules: prev.totalRules + 1,
                  recentActivity: [
                    {
                      type: 'download',
                      ruleId: payload.new.id as string,
                      timestamp: new Date().toISOString()
                    },
                    ...prev.recentActivity.slice(0, 9) // Keep last 10
                  ]
                }));
              }
              
              if (payload.eventType === 'UPDATE' && payload.old.downloads !== payload.new.downloads) {
                const downloadDiff = (payload.new.downloads as number) - (payload.old.downloads as number);
                setAnalytics(prev => ({
                  ...prev,
                  totalDownloads: prev.totalDownloads + downloadDiff,
                  recentActivity: [
                    {
                      type: 'download',
                      ruleId: payload.new.id as string,
                      timestamp: new Date().toISOString()
                    },
                    ...prev.recentActivity.slice(0, 9)
                  ]
                }));
              }
            }
          )
          .subscribe();

        // Subscribe to user_votes table for real-time voting
        const votesChannel = supabase
          .channel('votes-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'user_votes'
            },
            (payload: RealtimePostgresChangesPayload<any>) => {
              console.log('Vote change:', payload);
              
              const ruleId = (payload.new as any)?.rule_id || (payload.old as any)?.rule_id;
              const userId = (payload.new as any)?.user_id || (payload.old as any)?.user_id;
              
              if (ruleId) {
                setAnalytics(prev => ({
                  ...prev,
                  recentActivity: [
                    {
                      type: 'vote',
                      ruleId,
                      userId,
                      timestamp: new Date().toISOString()
                    },
                    ...prev.recentActivity.slice(0, 9)
                  ]
                }));
              }
            }
          )
          .subscribe();

        // Subscribe to profiles table for new user signups
        const profilesChannel = supabase
          .channel('profiles-changes')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'profiles'
            },
            (payload: RealtimePostgresChangesPayload<any>) => {
              console.log('New user:', payload);
              setAnalytics(prev => ({
                ...prev,
                totalUsers: prev.totalUsers + 1,
                recentActivity: [
                  {
                    type: 'user_signup',
                    userId: payload.new.id as string,
                    timestamp: new Date().toISOString()
                  },
                  ...prev.recentActivity.slice(0, 9)
                ]
              }));
            }
          )
          .subscribe();

        channels = [rulesChannel, votesChannel, profilesChannel];
        
        // Check connection status
        const checkConnection = () => {
          const connected = channels.every(channel => channel.state === 'joined');
          setIsConnected(connected);
        };

        // Monitor connection status
        const interval = setInterval(checkConnection, 1000);
        
        // Cleanup function
        return () => {
          clearInterval(interval);
          channels.forEach(channel => {
            supabase.removeChannel(channel);
          });
        };

      } catch (error) {
        console.error('Error setting up real-time subscriptions:', error);
      }
    };

    const cleanup = setupRealtimeSubscriptions();

    return () => {
      cleanup.then(cleanupFn => {
        if (cleanupFn) cleanupFn();
      });
    };
  }, [supabase]);

  return {
    analytics,
    isConnected,
    setAnalytics // Allow manual updates for initial load
  };
} 