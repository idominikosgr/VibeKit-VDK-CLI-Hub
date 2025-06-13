'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { useRealtimeAnalytics } from '@/lib/hooks/use-realtime-analytics';
import { useRealtimeVotePulse } from '@/lib/hooks/use-realtime-votes';
import { 
  PulseIcon, 
  DownloadIcon, 
  ThumbsUpIcon, 
  UserPlusIcon, 

  TrendUpIcon,
  UsersIcon,
  ChartBarIcon,
  WifiHighIcon,
  WifiXIcon,
  ClockIcon,
  CpuIcon,
  DatabaseIcon,
  CheckCircleIcon,
  WarningIcon,
  ArrowsClockwiseIcon,
  CircleNotchIcon,
  LightningIcon,
  GlobeIcon
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from 'framer-motion';

export function RealtimeAnalyticsWidget() {
  const { analytics, isConnected: analyticsConnected, setAnalytics } = useRealtimeAnalytics();
  const { recentVotes, isConnected: votesConnected } = useRealtimeVotePulse();
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetch('/api/admin/analytics?period=7d');
        if (response.ok) {
          const data = await response.json();
          setAnalytics({
            totalRules: data.overview.totalRules,
            totalUsers: data.overview.totalUsers,
            totalDownloads: data.overview.totalDownloads,
            recentPulse: []
          });
          setInitialDataLoaded(true);
        }
      } catch (error) {
        console.error('Error loading initial analytics:', error);
      }
    };

    loadInitialData();
  }, [setAnalytics]);

  const isConnected = analyticsConnected && votesConnected;

  const getPulseIcon = (type: string) => {
    switch (type) {
      case 'download':
        return <DownloadIcon className="w-3 h-3" />;
      case 'vote':
        return <ThumbsUpIcon className="w-3 h-3" />;
      case 'user_signup':
        return <UserPlusIcon className="w-3 h-3" />;
      default:
        return <PulseIcon className="w-3 h-3" />;
    }
  };

  const getPulseColor = (type: string) => {
    switch (type) {
      case 'download':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'vote':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'user_signup':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (!initialDataLoaded) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <Icons.spinner className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Live Stats */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Live Analytics</CardTitle>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <WifiHighIcon className="w-4 h-4 text-green-500" />
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Live
                  </Badge>
                </>
              ) : (
                <>
                  <WifiXIcon className="w-4 h-4 text-red-500" />
                  <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                    Offline
                  </Badge>
                </>
              )}
            </div>
          </div>
          <CardDescription>Real-time system metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <motion.div
                key={analytics.totalRules}
                initial={{ scale: 1.2, color: '#22c55e' }}
                animate={{ scale: 1, color: 'inherit' }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold"
              >
                {analytics.totalRules}
              </motion.div>
              <p className="text-xs text-muted-foreground">Rules</p>
            </div>
            <div className="text-center">
              <motion.div
                key={analytics.totalUsers}
                initial={{ scale: 1.2, color: '#3b82f6' }}
                animate={{ scale: 1, color: 'inherit' }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold"
              >
                {analytics.totalUsers}
              </motion.div>
              <p className="text-xs text-muted-foreground">Users</p>
            </div>
            <div className="text-center">
              <motion.div
                key={analytics.totalDownloads}
                initial={{ scale: 1.2, color: '#f59e0b' }}
                animate={{ scale: 1, color: 'inherit' }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold"
              >
                {analytics.totalDownloads}
              </motion.div>
              <p className="text-xs text-muted-foreground">Downloads</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Pulse Feed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendUpIcon className="w-4 h-4" />
            Live Pulse Feed
          </CardTitle>
          <CardDescription>Real-time user interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {analytics.recentPulse.length === 0 && recentVotes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity...
                </p>
              ) : (
                <>
                  {/* Show recent votes from real-time hook */}
                  {recentVotes.slice(0, 5).map((vote, index) => (
                    <motion.div
                      key={`vote-${vote.ruleId}-${vote.timestamp}-${index}`}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                    >
                      <div className={`p-1.5 rounded-full ${getPulseColor('vote')}`}>
                        {getPulseIcon('vote')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          Vote {vote.action} for rule
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          Rule: {vote.ruleId}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(vote.timestamp).toLocaleTimeString()}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Show other activity from general analytics hook */}
                  {analytics.recentPulse.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={`activity-${activity.ruleId}-${activity.timestamp}-${index}`}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                    >
                      <div className={`p-1.5 rounded-full ${getPulseColor(activity.type)}`}>
                        {getPulseIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize">
                          {activity.type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.ruleId && `Rule: ${activity.ruleId}`}
                          {activity.userId && `User: ${activity.userId}`}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 