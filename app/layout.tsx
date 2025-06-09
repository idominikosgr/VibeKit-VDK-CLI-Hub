import { Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth/auth-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from '@/components/ui/sonner';
import { BrowserCompatibilityCheck } from '@/components/browser-compatibility';
import { ErrorBoundary, GlobalErrorHandler } from '@/components/error-boundary';
import { WebVitals } from '@/components/web-vitals';
import { VercelAnalytics, VercelSpeedInsights } from '@/components/analytics-provider';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hub.vibecoderules.rocks';
const siteName = 'CodePilotRules Hub';
const siteDescription = 'A comprehensive hub for AI-assisted development rules, guidelines, and coding best practices. Discover, share, and implement coding standards that enhance your development workflow.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'codepilot', 'rules', 'ai', 'development', 'coding', 'guidelines', 
    'best practices', 'coding standards', 'development workflow', 
    'ai-assisted development', 'code quality', 'programming guidelines'
  ],
  authors: [
    {
      name: 'Dominikos Pritis',
      url: 'https://github.com/idominikosgr',
    },
  ],
  creator: 'Dominikos Pritis',
  publisher: 'CodePilotRules Hub',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: `${siteName} - AI-assisted development rules and guidelines`,
        type: 'image/png',
      },
      {
        url: '/images/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: `${siteName} - Square format`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vibecoderules',
    creator: '@idominikosgr',
    title: siteName,
    description: siteDescription,
    images: ['/images/twitter-card.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/icon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/images/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/images/safari-pinned-tab.svg',
        color: '#E5532A',
      },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  other: {
    'msapplication-TileColor': '#E5532A',
    'theme-color': '#E5532A',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ErrorBoundary>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
                  <main className="flex-1 py-6">
                    <BrowserCompatibilityCheck />
                    {children}
                  </main>
                </div>
                <SiteFooter />
              </div>
              <Toaster />
              <GlobalErrorHandler />
              <WebVitals />
              <VercelAnalytics />
              <VercelSpeedInsights />
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
