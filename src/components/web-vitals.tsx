'use client';

import { useEffect } from 'react';

interface Metric {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor' | 'info';
}

/**
 * Web Vitals monitoring component for performance tracking
 * Integrates with Vercel Analytics and custom analytics
 */
export function WebVitals() {
  useEffect(() => {
    // Function to send metrics to analytics
    const sendToAnalytics = (metric: Metric) => {
      // Send to Vercel Analytics if available
      if (typeof window !== 'undefined' && window.va) {
        window.va('event', {
          name: 'Web Vitals',
          data: {
            metric_name: metric.name,
            value: metric.value,
            id: metric.id,
            delta: metric.delta,
            rating: metric.rating,
          }
        });
      }

      // Send to custom analytics endpoint
      if (process.env.NODE_ENV === 'production') {
        fetch('/api/analytics/web-vitals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metric),
        }).catch(() => {
          // Silently fail - we don't want to break the app for analytics
        });
      }

      // Log metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric);
      }
    };

    // Use web-vitals v5 API
    const loadWebVitals = async () => {
      try {
        const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');
        
        // Register all Core Web Vitals
        onCLS(sendToAnalytics);
        onINP(sendToAnalytics); // INP (Interaction to Next Paint) replaces FID in v5
        onFCP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
      } catch (error) {
        console.warn('Web Vitals library not available, falling back to Performance API');
        
        // Fallback to Performance Observer API if web-vitals fails
        if ('PerformanceObserver' in window) {
          // Basic FCP observation
          try {
            const paintObserver = new PerformanceObserver((list) => {
              list.getEntries().forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                  sendToAnalytics({
                    name: 'FCP',
                    value: entry.startTime,
                    id: `fcp-${Date.now()}`,
                    delta: entry.startTime,
                    rating: entry.startTime < 1800 ? 'good' : entry.startTime < 3000 ? 'needs-improvement' : 'poor',
                  });
                }
              });
            });
            paintObserver.observe({ entryTypes: ['paint'] });
          } catch (e) {
            console.warn('Paint observation not supported');
          }
        }
      }
    };

    loadWebVitals();

    // Additional performance monitoring
    if ('PerformanceObserver' in window) {
      // Monitor long tasks
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              sendToAnalytics({
                name: 'long-task',
                value: entry.duration,
                id: `long-task-${Date.now()}`,
                delta: entry.duration,
                rating: entry.duration > 100 ? 'poor' : 'needs-improvement',
              });
            }
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task API not supported
      }

      // Monitor navigation timing
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            const navigationEntry = entry as PerformanceNavigationTiming;
            const loadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
            sendToAnalytics({
              name: 'navigation-timing',
              value: loadTime,
              id: `navigation-${Date.now()}`,
              delta: loadTime,
              rating: 'info',
            });
          });
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        // Navigation timing API not supported
      }
    }

    // Cleanup function
    return () => {
      // No cleanup needed for web-vitals library
    };
  }, []);

  return null; // This component doesn't render anything
}

// Type declarations for Vercel Analytics
declare global {
  interface Window {
    va?: (event: string, properties?: Record<string, any>) => void;
  }
} 