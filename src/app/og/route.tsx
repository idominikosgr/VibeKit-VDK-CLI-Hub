import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Fetch font data for edge runtime
async function getFontData() {
  const response = await fetch(
    new URL('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap')
  );
  
  return response.arrayBuffer();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get parameters from query string
    const title = searchParams.get('title') || 'VibeCodingRules Hub'
    const description = searchParams.get('description') || 'AI-assisted development rules and guidelines'
    const theme = searchParams.get('theme') || 'default'

    // Log for debugging
    console.log('OG Image Generation:', { title, description, theme })

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2%, transparent 0%),
                radial-gradient(circle at 75px 75px, rgba(255,255,255,0.05) 2%, transparent 0%)
              `,
              backgroundSize: '100px 100px',
            }}
          />
          
          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '80px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '1000px',
              margin: '0 60px',
            }}
          >
            {/* Logo/Icon area */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(45deg, #E5532A, #FF6B4A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
                boxShadow: '0 10px 25px rgba(229, 83, 42, 0.3)',
              }}
            >
              <div
                style={{
                  color: 'white',
                  fontSize: '36px',
                  fontWeight: 'bold',
                }}
              >
                V
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: title.length > 50 ? '48px' : '64px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '24px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                textWrap: 'balance',
              }}
            >
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p
                style={{
                  fontSize: '28px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.4,
                  fontWeight: '400',
                  maxWidth: '800px',
                  textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)',
                  textWrap: 'balance',
                }}
              >
                {description}
              </p>
            )}

            {/* Bottom branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '48px',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  🚀
                </div>
              </div>
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '20px',
                  fontWeight: '500',
                }}
              >
                hub.vibecodingrules.rocks
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Type': 'image/png',
        },
      }
    )
  } catch (e: any) {
    console.error('Error generating OG image:', e)
    
    // Return a simple fallback image
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
          }}
        >
          VibeCodingRules Hub
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }
}

// Also support HEAD requests for better compatibility
export async function HEAD(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
} 