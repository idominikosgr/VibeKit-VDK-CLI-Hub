import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "VIbeKit VDK - World's first VDK for optimized agentic development";
export const size = {
  width: 1200,
  height: 600,
};
export const contentType = "image/png";

export default async function TwitterImage() {
  // Default image for the homepage/main app
  const title =
    "VIbeKit VDK - World's first VDK for optimized agentic development";
  const subtitle = "A collection of coding rules for Vibe Coding";

  try {
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
            position: "relative",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="20" cy="20" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3,
            }}
          />

          {/* Content Container */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "60px",
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            {/* Icon */}
            <div
              style={{
                fontSize: "80px",
                marginRight: "40px",
                display: "flex",
                alignItems: "center",
                color: "#667eea",
              }}
            >
              ⚡
            </div>

            {/* Text Content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
              }}
            >
              {/* Brand */}
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#667eea",
                  marginBottom: "10px",
                  letterSpacing: "-0.025em",
                }}
              >
                VIbeKit VDK
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#1a202c",
                  lineHeight: "1.2",
                  marginBottom: "15px",
                  maxWidth: "600px",
                }}
              >
                {title}
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: "20px",
                  color: "#4a5568",
                  lineHeight: "1.4",
                  maxWidth: "500px",
                }}
              >
                {subtitle}
              </p>
            </div>
          </div>

          {/* Twitter Badge */}
          <div
            style={{
              position: "absolute",
              top: "30px",
              right: "30px",
              background: "rgba(255, 255, 255, 0.9)",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              color: "#1da1f2",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
            }}
          >
            🐦 Twitter
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error("Error generating Twitter image:", error);

    // Fallback simple image
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "48px",
            fontWeight: "bold",
          }}
        >
          VIbeKit VDK
        </div>
      ),
      { ...size }
    );
  }
}
