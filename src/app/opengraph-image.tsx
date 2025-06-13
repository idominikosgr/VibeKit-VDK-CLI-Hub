import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Vibe Coding Rules - A collection of coding rules for Vibe Coding';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OpengraphImage() {
  // Default image for the homepage/main app
  const title = 'Vibe Coding Rules - A collection of coding rules for Vibe Coding';
  const subtitle =
    'A collection of coding rules for Vibe Coding';

  try {
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3,
            }}
          />

          {/* Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '80px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '30px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px',
                }}
              >
                <span style={{ fontSize: '30px', color: 'white' }}>
                  ⚡
                </span>
              </div>
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#1a202c',
                  letterSpacing: '-0.025em',
                }}
              >
                Vibe Coding Rules
              </span>
            </div>

            {/* Main Title */}
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
                color: '#1a202c',
                lineHeight: '1.2',
                marginBottom: '20px',
                textAlign: 'center',
                maxWidth: '800px',
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '24px',
                color: '#4a5568',
                lineHeight: '1.4',
                textAlign: 'center',
                maxWidth: '700px',
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Bottom Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '12px 20px',
              borderRadius: '25px',
              fontSize: '16px',
              color: '#4a5568',
              fontWeight: '500',
            }}
          >
            hub.vibecodingrules.rocks
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error('Error generating OpenGraph image:', error);

    // Fallback simple image
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
          Vibe Coding Rules
        </div>
      ),
      { ...size }
    );
  }
}
