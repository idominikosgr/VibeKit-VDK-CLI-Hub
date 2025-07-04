import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { BrowserCompatibilityCheck } from "@/components/browser-compatibility";
import { ErrorBoundary, GlobalErrorHandler } from "@/components/error-boundary";
import { WebVitals } from "@/components/web-vitals";
import {
  VercelAnalytics,
  VercelSpeedInsights,
} from "@/components/analytics-provider";
import { WebsiteStructuredData } from "@/components/structured-data";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vdk.tools";
const siteName = "VibeKit VDK Hub";
const siteDescription =
  "A comprehensive hub for AI-assisted development rules, guidelines, and coding best practices. Discover, share, and implement coding standards that enhance your development workflow.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "Vibe Coding",
    "rules",
    "ai",
    "development",
    "coding",
    "guidelines",
    "best practices",
    "coding standards",
    "development workflow",
    "ai-assisted development",
    "code quality",
    "programming guidelines",
  ],
  authors: [
    {
      name: "Dominikos Pritis",
      url: "https://github.com/idominikosgr",
    },
  ],
  creator: "Dominikos Pritis",
  publisher: "VibeKit VDK Hub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Custom branded OG image`,
        type: "image/png",
      },
      {
        url: `${siteUrl}/og?title=${encodeURIComponent(
          siteName
        )}&description=${encodeURIComponent(siteDescription)}`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Dynamic generated image`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vdktools",
    creator: "@idominikosgr",
    title: siteName,
    description: siteDescription,
    images: [
      `${siteUrl}/images/twitter-card.png`,
      `${siteUrl}/og?title=${encodeURIComponent(
        siteName
      )}&description=${encodeURIComponent(siteDescription)}`,
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/favicon.ico", sizes: "any" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/images/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/images/safari-pinned-tab.svg",
        color: "#E5532A",
      },
    ],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "msapplication-TileColor": "#E5532A",
    "theme-color": "#E5532A",
    // Additional meta tags for better social sharing
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/png",
    "og:image:secure_url": `${siteUrl}/images/og-image.png`,
    "twitter:image:alt": siteDescription,
    "twitter:domain": "vdk.tools",
    "twitter:url": siteUrl,
    // Help social media crawlers
    robots: "index,follow",
    referrer: "no-referrer-when-downgrade",
    // Force crawlers to refresh cache
    "og:updated_time": new Date().toISOString(),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
              <WebsiteStructuredData
                name={siteName}
                description={siteDescription}
                url={siteUrl}
                sameAs={[
                  "https://github.com/idominikosgr/VibeKit-VDK-Hub",
                  "https://twitter.com/vdktools",
                ]}
              />
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
