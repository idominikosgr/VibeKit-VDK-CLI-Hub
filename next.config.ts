import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Core configuration
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src', 'app', 'pages', 'components', 'lib', 'utils'],
  },

  // Development indicators
  devIndicators: {
    position: 'bottom-right',
  },

  // Stable features 
  bundlePagesRouterDependencies: true,
  serverExternalPackages: [
    'aws-sdk',
    'mock-aws-s3',
    'sharp',
    'canvas',
    'puppeteer',
    'playwright',
    '@prisma/client',
  ],

  // Package transpilation
  transpilePackages: ['@acme/ui'],

  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              prettier: false,
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                ],
              },
              titleProp: true,
              ref: true,
            },
          },
        ],
        as: '*.js',
      },
    },

    // React resolution
    resolveAlias: {
      '@': './src',
      // React 19 - Let Turbopack handle React resolution natively
      // react: require.resolve('react'),
      // 'react-dom': require.resolve('react-dom'),
    },

    // Performance settings
    // memoryLimit: 8589934592, // 8GB for large projects

    // Module resolution
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.mjs'],
  },

  // Experimental features
  experimental: {
    // React Compiler 
    reactCompiler: {
      compilationMode: 'annotation',
    },

    // Enhanced caching 
    staleTimes: {
      dynamic: isDev ? 0 : 30,
      static: isDev ? 30 : 180,
    },

    // CSS optimization
    //cssChunking: 'strict',

    // Server Actions security
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: isDev
        ? ['localhost:3000', 'localhost:3001']
        : ['*.vercel.app', '*.vibecodingrules.rocks'],
    },

    // Performance optimizations
    largePageDataBytes: 128 * 1000,
    taint: true,
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,

    // 🚀 NEXT.JS 15+ EXPERIMENTAL FLAGS (COMMENTED OUT)
    // These are cutting-edge experimental features available in Next.js 15+
    // Uncomment individual flags as needed, but be aware they may change or break

    // === RENDERING & PERFORMANCE ===

    // Partial Prerendering (PPR) - Combine static/dynamic content (requires canary)
    // Note: Some features require next@canary, not stable releases
    // Temporarily disabled due to createContext build conflicts
    //ppr: 'incremental', // Enable PPR incrementally per route
    ppr: true, // Enable PPR for entire app (after incremental adoption)

    // Dynamic IO - Exclude IO from prerenders unless explicitly cached
    // Also enables experimental Partial Prerendering and react@experimental for app directory
    //dynamicIO: true,

    // Cache directive support - Enable "use cache" directive
    useCache: true,

    // Inline CSS - Render <style> tags inline in HTML for imported CSS (app-router, production only)
    //inlineCss: true,

    // Server Components HMR Cache - Allows previously fetched data to be re-used when editing server components
    // serverComponentsHmrCache: true, // Default: true in config

    // === AUTH & SECURITY ===

    // Authorization APIs - Enable forbidden() and unauthorized() functions (Next.js 15.1+)
    authInterrupts: true,

    // === UI & TRANSITIONS ===

    // React View Transitions API - Animate between views/components (Next.js 15.2+)
    // Highly experimental, may change in future releases
    viewTransition: true,

    // === BUILD & BUNDLING ===

    // Node.js Middleware - Use Node.js runtime in Middleware (Next.js 15.2+)
    // nodeMiddleware: true,

    // Webpack optimizations
    // webpackBuildWorker: true, // Use worker for webpack builds
    // webpackMemoryOptimizations: true, // Enable webpack memory optimizations

    // Static generation controls
    // staticGenerationRetryCount: 3, // Retry count for failed static generation
    // staticGenerationMaxConcurrency: 8, // Max concurrent static generations (default: 8)
    // staticGenerationMinPagesPerWorker: 25, // Min pages per worker (default: 25)

    // === DEVELOPMENT ===

    // Development features
    //allowDevelopmentBuild: true, // Allow building in development mode
    //slowModuleDetection: { buildTimeThresholdMs: 1000 }, // Detect slow modules
    //devtoolSegmentExplorer: true, // Enable devtool segment explorer

    // === REACT & OPTIMIZATION ===

    // React optimizations
    //optimizeServerReact: true, // Default: true - Optimize server React
    //useEarlyImport: true, // Use early import optimization

    // === ROUTING & NAVIGATION ===

    // Router optimizations
    routerBFCache: true, // Enable router back/forward cache
    //globalNotFound: true, // Enable global not found handling

    // === ERROR HANDLING ===

    // Remove uncaught error and rejection listeners
    // removeUncaughtErrorAndRejectionListeners: true,

    // === FUTURE/CANARY-ONLY FEATURES ===
    // These may only work with next@canary releases

    // Lightning CSS support (experimental alternative to default CSS processing)
    //lightningCss: true,

    // Rspack support (community experimental, Webpack alternative)
    // rspack: true,

    // After API - Execute code after response finishes streaming (stable in 15.1+)
    // after: true,

    // Turbopack persistent caching (not yet released, being dogfooded internally)
    // persistentCaching: true,

    // === COMPATIBILITY & LEGACY ===

    // Legacy decorator support (for older libraries like mobx)
    // Detected automatically from tsconfig.json/jsconfig.json
    // experimentalDecorators: true, // Set in tsconfig.json instead

    // JSX import source (detected automatically from tsconfig.json)
    // jsxImportSource: 'theme-ui', // Set in tsconfig.json instead
  },

  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
  },

  // Async rewrites
  async rewrites() {
    return [
      {
        source: '/manifest.webmanifest',
        destination: '/manifest.json',
      },
      {
        source: '/site.webmanifest',
        destination: '/manifest.json',
      },
    ];
  },

  // Headers configuration
  async headers() {
    const securityHeaders = [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin',
      },
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      },
    ];

    const corsHeaders = isDev
      ? [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-Requested-With, Content-Type, Authorization, Accept, Origin, Cache-Control, X-File-Name',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
        ]
      : [];

    // Updated CSP 
    const csp = isDev
      ? [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' https://accounts.google.com https://apis.google.com https://va.vercel-scripts.com http://localhost:*",
          "style-src 'self' 'unsafe-inline' https://accounts.google.com https://fonts.googleapis.com",
          "img-src 'self' data: https: blob: http: https://lh3.googleusercontent.com https://i.pravatar.cc",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self' *.supabase.co *.supabase.io https://accounts.google.com https://oauth2.googleapis.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://i.pravatar.cc ws: wss: http://localhost:* https://localhost:*",
          "frame-src 'self' https://accounts.google.com",
          "worker-src 'self' blob: data:",
          "manifest-src 'self'",
          "media-src 'self' blob: data:",
        ].join('; ')
      : [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://accounts.google.com https://apis.google.com https://va.vercel-scripts.com",
          "style-src 'self' 'unsafe-inline' https://accounts.google.com https://fonts.googleapis.com",
          "img-src 'self' data: https: blob: https://lh3.googleusercontent.com https://i.pravatar.cc",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self' *.supabase.co *.supabase.io https://accounts.google.com https://oauth2.googleapis.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://i.pravatar.cc",
          "frame-src 'self' https://accounts.google.com",
          "frame-ancestors 'none'",
          "worker-src 'self'",
          "manifest-src 'self'",
        ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          ...securityHeaders,
          ...corsHeaders,
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          ...corsHeaders,
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: isDev
              ? 'no-cache, no-store, must-revalidate'
              : 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source:
          '/(_next/static|favicon.ico|manifest.json|robots.txt|sitemap.xml)',
        headers: [
          ...corsHeaders,
          {
            key: 'Cache-Control',
            value: isProd
              ? 'public, max-age=31536000, immutable'
              : 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          ...corsHeaders,
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [];
  },

  // File tracing exclusions (production only)
  ...(isProd && {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
        '.git/**/*',
        '.vscode/**/*',
        '**/*.md',
        '**/*.test.*',
        '**/*.spec.*',
      ],
    },
  }),

};

// Service worker configuration
const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  reloadOnOnline: true,
  register: true,
  scope: '/',
  disable: isDev, // Disable service worker in development to avoid caching issues
  additionalPrecacheEntries: [
    { url: '/offline', revision: null },
    { url: '/icons/icon-192x192.png', revision: null },
    { url: '/icons/icon-512x512.png', revision: null },
    { url: '/manifest.json', revision: null },
    { url: '/favicon.ico', revision: null },
    { url: '/screenshot-wide.png', revision: null },
    { url: '/screenshot-narrow.png', revision: null },
  ],
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  dontCacheBustURLsMatching: /^\/_next\/static\/.*/i,
  exclude: [
    /middleware-manifest\.json$/,
    /polyfills-.*\.js$/,
    /webpack-.*\.js$/,
    /pages\/_error-.*\.js$/,
    /pages\/_app-.*\.js$/,
    /main-app-.*\.js$/,
    /main-.*\.js$/,
    /chunks\/polyfills/,
    /chunks\/webpack/,
    /chunks\/pages/,
    /chunks\/main/,
    /\.map$/,
    /_buildManifest\.js$/,
    /_ssgManifest\.js$/,
    /\/media\/.*\.(woff|woff2|eot|ttf)$/,
    /\/sw\.js$/,
    /\/workbox-.*\.js$/,
    /\/api\/auth\//,
    ...(isDev ? [/\.css$/, /\.js$/, /\.woff2?$/] : []),
  ],
});

export default withSerwist(nextConfig);
