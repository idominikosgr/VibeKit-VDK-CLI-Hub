import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface VoteUpdate {
  ruleId: string;
  newVoteCount: number;
  timestamp: string;
}

export function useRealtimeVotes(ruleId?: string) {
  const [voteCount, setVoteCount] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<VoteUpdate | null>(null);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    if (!ruleId) return;

    let channel: RealtimeChannel;

    const setupVoteSubscription = () => {
      // Subscribe to vote changes for this specific rule
      channel = supabase
        .channel(`votes-${ruleId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_votes',
            filter: `rule_id=eq.${ruleId}`
          },
          async (payload: RealtimePostgresChangesPayload<any>) => {
            console.log('Real-time vote change for rule:', ruleId, payload);
            
            // Fetch updated vote count from rules table
            const { data: rule, error } = await supabase
              .from('rules')
              .select('votes')
              .eq('id', ruleId)
              .single();

            if (!error && rule) {
              const newCount = rule.votes || 0;
              setVoteCount(newCount);
              setLastUpdate({
                ruleId,
                newVoteCount: newCount,
                timestamp: new Date().toISOString()
              });
            }
          }
        )
        .subscribe((status) => {
          console.log('Vote subscription status:', status);
          setIsConnected(status === 'SUBSCRIBED');
        });
    };

    setupVoteSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [ruleId, supabase]);

  return {
    voteCount,
    isConnected,
    lastUpdate,
    setVoteCount // Allow manual updates for optimistic UI
  };
}

// Hook for global vote activity feed
export function useRealtimeVoteActivity() {
  const [recentVotes, setRecentVotes] = useState<Array<{
    ruleId: string;
    userId: string;
    action: 'added' | 'removed';
    timestamp: string;
  }>>([]);
  const [isConnected, setIsConnected] = useState(false);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupGlobalVoteSubscription = () => {
      channel = supabase
        .channel('global-votes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_votes'
          },
          (payload: RealtimePostgresChangesPayload<any>) => {
            console.log('Global vote activity:', payload);
            
            const ruleId = (payload.new as any)?.rule_id || (payload.old as any)?.rule_id;
            const userId = (payload.new as any)?.user_id || (payload.old as any)?.user_id;
            
            if (ruleId && userId) {
              const action = payload.eventType === 'INSERT' ? 'added' : 'removed';
              
              setRecentVotes(prev => [
                {
                  ruleId,
                  userId,
                  action,
                  timestamp: new Date().toISOString()
                },
                ...prev.slice(0, 19) // Keep last 20 votes
              ]);
            }
          }
        )
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED');
        });
    };

    setupGlobalVoteSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [supabase]);

  return {
    recentVotes,
    isConnected
  };
} 