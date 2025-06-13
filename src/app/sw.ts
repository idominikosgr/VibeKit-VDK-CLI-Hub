import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import {
  CacheFirst,
  NetworkFirst,
  NetworkOnly,
  Serwist,
  StaleWhileRevalidate,
} from 'serwist';

// This is replaced by @serwist/next during build time
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

// Define types for request and URL in matchers
interface RequestInfo {
  request: Request;
  url: URL;
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: process.env.NODE_ENV === 'development',

  runtimeCaching: [
    // API routes - Network first with enhanced error handling
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/'),
      handler: new NetworkFirst({
        cacheName: 'api-cache-v2',
        networkTimeoutSeconds: 10,
        plugins: [
          {
            cacheKeyWillBeUsed: async ({ request }) => {
              // Add version for cache busting
              const url = new URL(request.url);
              url.searchParams.set('sw-cache', 'v2');
              return url.toString();
            },
            fetchDidFail: async ({ request, error }) => {
              console.warn('API fetch failed:', request.url, error);
              // Could implement offline queue here
            },
            requestWillFetch: async ({ request }) => {
              // Add custom headers for PWA requests
              const headers = new Headers(request.headers);
              headers.set('X-Requested-With', 'ServiceWorker');
              return new Request(request, { headers });
            },
          },
        ],
      }),
    },

    // Authentication endpoints - Network only (never cache)
    {
      matcher: ({ url }) =>
        url.pathname.startsWith('/api/auth/') ||
        url.pathname.includes('/callback'),
      handler: new NetworkOnly(),
    },

    // Static assets - Cache first with versioning
    {
      matcher: ({ url }) => url.pathname.startsWith('/_next/static/'),
      handler: new CacheFirst({
        cacheName: 'static-assets-v2',
        plugins: [
          {
            cacheKeyWillBeUsed: async ({ request }) => {
              // Static assets should be immutable, no need for cache busting
              return request.url;
            },
            fetchDidFail: async ({ request, error }) => {
              console.warn('Static asset fetch failed:', request.url, error);
            },
          },
        ],
      }),
    },

    // Screenshot images for PWA - Cache first
    {
      matcher: ({ url }) =>
        url.pathname.includes('screenshot-wide.png') ||
        url.pathname.includes('screenshot-narrow.png'),
      handler: new CacheFirst({
        cacheName: 'pwa-screenshots-v1',
        plugins: [],
      }),
    },

    // Images - Stale while revalidate with size limits
    {
      matcher: ({ request }) => request.destination === 'image',
      handler: new StaleWhileRevalidate({
        cacheName: 'images-v2',
        plugins: [
          {
            cacheKeyWillBeUsed: async ({ request }) => {
              return request.url;
            },
            requestWillFetch: async ({ request }) => {
              // Optimize image requests
              const url = new URL(request.url);
              // Add WebP preference for supported images
              const headers = new Headers(request.headers);
              headers.set('Accept', 'image/webp,image/avif,image/*,*/*;q=0.8');
              return new Request(request, { headers });
            },
          },
        ],
      }),
    },

    // Pages - Network first with enhanced fallback
    {
      matcher: ({ request }) => request.destination === 'document',
      handler: new NetworkFirst({
        cacheName: 'pages-v2',
        networkTimeoutSeconds: 5,
        plugins: [
          {
            cacheKeyWillBeUsed: async ({ request }) => {
              // Remove search params for consistent caching
              const url = new URL(request.url);
              // Keep only essential params
              const essentialParams = ['lang', 'theme'];
              const filteredParams = new URLSearchParams();

              essentialParams.forEach(param => {
                if (url.searchParams.has(param)) {
                  filteredParams.set(param, url.searchParams.get(param)!);
                }
              });

              url.search = filteredParams.toString();
              return url.toString();
            },
            fetchDidFail: async ({ request }) => {
              console.log('Page fetch failed, serving offline fallback');
            },
          },
        ],
      }),
    },

    // Fonts - Cache first (they rarely change)
    {
      matcher: ({ request }) =>
        request.destination === 'font' ||
        request.url.includes('fonts.googleapis.com') ||
        request.url.includes('fonts.gstatic.com'),
      handler: new CacheFirst({
        cacheName: 'fonts-v2',
        plugins: [
          {
            cacheKeyWillBeUsed: async ({ request }) => {
              return request.url;
            },
          },
        ],
      }),
    },

    // Supabase requests - Network first with shorter timeout
    {
      matcher: ({ url }) =>
        url.hostname.includes('supabase.co') ||
        url.hostname.includes('supabase.io'),
      handler: new NetworkFirst({
        cacheName: 'supabase-cache-v2',
        networkTimeoutSeconds: 8,
        plugins: [
          {
            requestWillFetch: async ({ request }) => {
              // Add PWA identifier
              const headers = new Headers(request.headers);
              headers.set('X-Client-Type', 'PWA');
              return new Request(request, { headers });
            },
          },
        ],
      }),
    },
  ],

  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();

// Enhanced message handling for PWA features
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '2.0.0' });
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    // Clear old cache versions
    caches.keys().then(cacheNames => {
      const oldCaches = cacheNames.filter(
        name =>
          !name.includes('-v2') &&
          (name.includes('api-cache') ||
            name.includes('static-assets') ||
            name.includes('images') ||
            name.includes('pages'))
      );

      return Promise.all(oldCaches.map(cacheName => caches.delete(cacheName)));
    });
  }
});

// Background sync for offline actions (if supported)
if ('sync' in self.registration) {
  self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
      event.waitUntil(
        // Handle background sync operations
        Promise.resolve(console.log('Background sync triggered'))
      );
    }
  });
}

// Push notification handling
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey || 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icons/action-view.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'MyRoomie', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(self.clients.openWindow('/dashboard'));
  }
});
