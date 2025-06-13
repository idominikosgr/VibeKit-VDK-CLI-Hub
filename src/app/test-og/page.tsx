import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hub.vibecodingrules.rocks'

export const metadata: Metadata = {
  title: 'OG Image Test | VibeCodingRules Hub',
  description: 'Testing Open Graph image generation for social media sharing',
  openGraph: {
    title: 'OG Image Test',
    description: 'Testing Open Graph image generation for social media sharing',
    images: [
      {
        url: `${siteUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
      },
      {
        url: `${siteUrl}/og?title=${encodeURIComponent('OG Image Test')}&description=${encodeURIComponent('Testing Open Graph image generation')}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OG Image Test',
    description: 'Testing Open Graph image generation for social media sharing',
    images: [
      `${siteUrl}/images/twitter-card.png`,
      `${siteUrl}/og?title=${encodeURIComponent('OG Image Test')}&description=${encodeURIComponent('Testing Open Graph image generation')}`,
    ],
  },
}

export default function TestOGPage() {
  const staticImageUrl = `${siteUrl}/images/og-image.png`
  const twitterImageUrl = `${siteUrl}/images/twitter-card.png`
  const ogImageUrl = `${siteUrl}/og?title=${encodeURIComponent('OG Image Test')}&description=${encodeURIComponent('Testing Open Graph image generation')}`
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">OG Image Testing</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">🎯 Primary: Custom Static OG Image</h2>
          <div className="bg-muted p-4 rounded-lg">
            <p className="mb-2"><strong>URL:</strong> <code className="text-sm">{staticImageUrl}</code></p>
            <p className="mb-2 text-sm text-muted-foreground">This is the <strong>primary</strong> image that social media platforms should pick up first.</p>
            <img 
              src={staticImageUrl} 
              alt="Primary Static OG Image" 
              className="border rounded-lg max-w-md"
              style={{ aspectRatio: '1200/630' }}
            />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">🐦 Twitter Card Image</h2>
          <div className="bg-muted p-4 rounded-lg">
            <p className="mb-2"><strong>URL:</strong> <code className="text-sm">{twitterImageUrl}</code></p>
            <p className="mb-2 text-sm text-muted-foreground">Dedicated Twitter card image (currently same as OG image).</p>
            <img 
              src={twitterImageUrl} 
              alt="Twitter Card Image" 
              className="border rounded-lg max-w-md"
              style={{ aspectRatio: '1200/630' }}
            />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">⚡ Fallback: Dynamic Generated Image</h2>
          <div className="bg-muted p-4 rounded-lg">
            <p className="mb-2"><strong>URL:</strong> <code className="text-sm">{ogImageUrl}</code></p>
            <p className="mb-2 text-sm text-muted-foreground">Dynamic generation fallback - used when static images aren't available.</p>
            <img 
              src={ogImageUrl} 
              alt="Dynamic OG Image" 
              className="border rounded-lg max-w-md"
              style={{ aspectRatio: '1200/630' }}
            />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">🔧 Testing Tools</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">1. Use these tools to test how your OG images appear:</p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li><a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Sharing Debugger</a> - Test with: <code className="text-xs">https://hub.vibecodingrules.rocks</code></li>
                <li><a href="https://cards-dev.twitter.com/validator" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Twitter Card Validator</a></li>
                <li><a href="https://www.linkedin.com/post-inspector/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn Post Inspector</a></li>
                <li><a href="https://opengraph.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenGraph.dev</a></li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium mb-2">2. Clear social media caches:</p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li><strong>Facebook:</strong> Use Sharing Debugger and click "Scrape Again"</li>
                <li><strong>Twitter:</strong> Cards are usually cached for 7 days</li>
                <li><strong>LinkedIn:</strong> Use Post Inspector to refresh cache</li>
                <li><strong>Discord:</strong> Add <code className="text-xs">?v=1</code> to your URL to force refresh</li>
              </ul>
            </div>

            <div>
              <p className="font-medium mb-2">3. Priority order (platforms pick the first one):</p>
              <ol className="list-decimal list-inside space-y-1 text-sm ml-4">
                <li>🎯 Custom static image: <code className="text-xs">/images/og-image.png</code></li>
                <li>⚡ Dynamic generated: <code className="text-xs">/og?title=...</code></li>
              </ol>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Meta Tags Preview</h2>
          <div className="bg-muted p-4 rounded-lg text-sm">
            <pre className="whitespace-pre-wrap">{`<meta property="og:title" content="OG Image Test" />
<meta property="og:description" content="Testing Open Graph image generation for social media sharing" />
<meta property="og:image" content="${ogImageUrl}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${ogImageUrl}" />`}</pre>
          </div>
        </section>
      </div>
    </div>
  )
} 