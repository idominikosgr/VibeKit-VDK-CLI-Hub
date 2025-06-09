'use client';

import { useEffect } from 'react';

/**
 * Analytics Provider Component
 * Handles loading of Vercel Analytics and Speed Insights
 * Falls back gracefully if packages are not installed
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load Vercel Analytics if available
    const loadAnalytics = async () => {
      try {
        const { Analytics } = await import('@vercel/analytics/react');
        // Analytics will be automatically injected
      } catch (error) {
        console.warn('Vercel Analytics not available');
      }
    };

    // Load Speed Insights if available
    const loadSpeedInsights = async () => {
      try {
        const { SpeedInsights } = await import('@vercel/speed-insights/next');
        // Speed Insights will be automatically injected
      } catch (error) {
        console.warn('Vercel Speed Insights not available');
      }
    };

    // Only load in production or when explicitly enabled
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV) {
      loadAnalytics();
      loadSpeedInsights();
    }
  }, []);

  return <>{children}</>;
}

/**
 * Vercel Analytics Component Wrapper
 * Loads analytics when available, fails silently otherwise
 */
export function VercelAnalytics() {
  useEffect(() => {
    const loadAndInjectAnalytics = async () => {
      try {
        // Dynamically import and inject Vercel Analytics
        const { inject } = await import('@vercel/analytics');
        inject();
      } catch (error) {
        // Analytics package not available, fail silently
        console.warn('Vercel Analytics package not found. Install with: npm install @vercel/analytics');
      }
    };

    // Only load in production or when explicitly enabled
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV) {
      loadAndInjectAnalytics();
    }
  }, []);

  return null;
}

/**
 * Vercel Speed Insights Component Wrapper
 * Loads speed insights when available, fails silently otherwise
 */
export function VercelSpeedInsights() {
  useEffect(() => {
    const loadAndInjectSpeedInsights = async () => {
      try {
        // Dynamically import and inject Speed Insights
        const { injectSpeedInsights } = await import('@vercel/speed-insights');
        injectSpeedInsights();
      } catch (error) {
        // Speed Insights package not available, fail silently
        console.warn('Vercel Speed Insights package not found. Install with: npm install @vercel/speed-insights');
      }
    };

    // Only load in production or when explicitly enabled
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV) {
      loadAndInjectSpeedInsights();
    }
  }, []);

  return null;
} 