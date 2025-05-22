import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth/auth-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from '@/components/ui/sonner';
import { BrowserCompatibilityCheck } from '@/components/browser-compatibility';
import { ErrorBoundary, GlobalErrorHandler } from '@/components/error-boundary';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'CodePilotRules Hub',
    template: '%s | CodePilotRules Hub',
  },
  description: 'A hub for AI-assisted development rules and guidelines',
  keywords: ['codepilot', 'rules', 'ai', 'development', 'coding', 'guidelines'],
  authors: [
    {
      name: 'Dominikos Pritis',
      url: 'https://github.com/idominikosgr',
    },
  ],
  creator: 'Dominikos Pritis',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
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
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
