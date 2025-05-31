import type { NextConfig } from 'next'

/**
 * Next.js configuration with enhanced development settings
 * Following CodePilotRulesHub's modern implementation approach without backward compatibility
 */
const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience and safety
  reactStrictMode: true,

  // Environment variable configuration
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  },

  // Image optimization configuration
  images: {
    // Removed deprecated 'domains' configuration
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      }
    ]
  },

  // Optimize server bundle (moved from experimental in Next.js 15)
  serverExternalPackages: ['@supabase/ssr'],

  // Development indicators
  devIndicators: {
    position: 'bottom-right'
  },

  // Enhanced webpack configuration for modern development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Optimize for development speed with modern techniques
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        chunkIds: 'named',
        minimize: false
      };

      // Optimized file watching
      config.watchOptions = {
        ...config.watchOptions,
        aggregateTimeout: 500,
        poll: false,
        ignored: ['**/.git/**', '**/node_modules/**', '**/.next/**', '**/build/**']
      };
    }
    return config;
  },

  // Enable turbopack for faster builds (Next.js 15.3+ syntax)
  turbopack: {},

  // TypeScript configuration
  typescript: {
    // Build even if there are TypeScript errors
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Temporarily ignore ESLint during builds for deployment
    ignoreDuringBuilds: true,
  },

  // Bundle analyzer - enables automatic bundling for Pages Router
  bundlePagesRouterDependencies: true,
}

export default nextConfig