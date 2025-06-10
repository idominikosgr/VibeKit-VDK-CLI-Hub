#!/bin/bash

# Vibe Coding Rules Hub - Beautification Setup Script
echo "🎨 Setting up Vibe Coding Rules Hub beautification features..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Installing required dependencies..."

# Install Vercel Analytics and Speed Insights
pnpm add @vercel/analytics @vercel/speed-insights

# Install Web Vitals (if not already installed)
pnpm add web-vitals

echo "✅ Dependencies installed successfully!"

echo "🖼️ Setting up image directories..."

# Create public/images directory if it doesn't exist
mkdir -p public/images

echo "📝 Creating environment variables file..."

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    cat > .env.local << EOL
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://hub.vibecoderules.rocks
NEXT_PUBLIC_SITE_NAME="Vibe Coding Rules Hub"

# Analytics & SEO
GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_VERCEL_ENV=development

# GitHub Integration (for rule synchronization)
GITHUB_REPO_OWNER=idominikosgr
GITHUB_REPO_NAME=AI.rules

# Development
NODE_ENV=development
EOL
    echo "✅ Created .env.local file"
else
    echo "ℹ️ .env.local already exists, skipping creation"
fi

echo ""
echo "🎯 Setup complete! Next steps:"
echo ""
echo "1. 📸 Generate the required image assets:"
echo "   - Check public/images/README.md for the complete list"
echo "   - Required: favicon.ico, og-image.png, twitter-card.png, and PWA icons"
echo ""
echo "2. 🔧 Configure environment variables:"
echo "   - Update .env.local with your Google Site Verification code"
echo "   - Add any other required API keys"
echo ""
echo "3. 🚀 Run the development server:"
echo "   pnpm dev"
echo ""
echo "4. 🌐 Deploy to Vercel to enable Analytics and Speed Insights"
echo ""
echo "✨ Features added:"
echo "   ✅ Manrope font for improved readability"
echo "   ✅ Enhanced typography with better line heights"
echo "   ✅ Comprehensive OpenGraph and Twitter Card metadata"
echo "   ✅ Web Vitals monitoring and analytics"
echo "   ✅ PWA manifest for app-like experience"
echo "   ✅ Vercel Analytics and Speed Insights integration"
echo "   ✅ Enhanced security headers"
echo "" 