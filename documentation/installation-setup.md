# Installation & Setup

Welcome to Vibe Coding Rules Hub! This guide will help you get the application running locally in just a few minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **pnpm** - Install with `npm install -g pnpm`
- **Git** - [Download](https://git-scm.com/)
- **Supabase CLI** - [Installation Guide](https://supabase.com/docs/guides/cli)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/idominikosgr/Vibe-Coding-Rules.git
cd codepilotrules-hub/codepilotrules-hub
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Copy the environment template:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# GitHub Integration (Optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 4. Initialize Database

Start Supabase locally:

```bash
npx supabase start
```

Reset and seed the database:

```bash
npx supabase db reset
```

### 5. Run the Application

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables Explained

### Required Variables

- **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Public anonymous key for client-side operations
- **SUPABASE_SERVICE_ROLE_KEY**: Service role key for server-side operations

### Optional Variables

- **GITHUB_CLIENT_ID**: GitHub OAuth app client ID for authentication
- **GITHUB_CLIENT_SECRET**: GitHub OAuth app client secret
- **OPENAI_API_KEY**: OpenAI API key for AI features
- **WEBHOOK_SECRET**: Secret for securing GitHub webhooks

## Database Setup

### Local Development

For local development, the Supabase CLI will handle database setup:

1. **Start Services**: `npx supabase start`
2. **Apply Migrations**: `npx supabase db reset`
3. **Seed Data**: Run the provided seed scripts

### Production Deployment

For production, you'll need:

1. A Supabase project
2. Database migrations applied
3. Row Level Security (RLS) policies configured
4. Authentication providers set up

## Common Issues

### Node.js Version

Make sure you're using Node.js 18 or higher:

```bash
node --version
```

### Dependency Conflicts

If you encounter dependency issues:

```bash
rm -rf node_modules package-lock.json
pnpm install
```

### Database Connection

If the database connection fails:

1. Check your Supabase URL and keys
2. Ensure your IP is whitelisted (for hosted Supabase)
3. Verify the database is running

### Port Conflicts

If port 3000 is in use:

```bash
pnpm dev -- --port 3001
```

## Development Scripts

Available package.json scripts:

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript check

## Production Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

- Supabase credentials
- GitHub OAuth credentials (if using GitHub auth)
- OpenAI API key (if using AI features)
- Any custom webhook secrets

## Next Steps

After successful installation:

1. [Basic Configuration](/docs/getting-started/configuration)
2. [First Steps](/docs/getting-started/first-steps)
3. [System Overview](/docs/app-architecture/system-overview)

## Troubleshooting

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure database migrations have been applied
4. Check the GitHub repository for known issues
5. Contact support if problems persist