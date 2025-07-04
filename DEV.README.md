# README.md

# VibeKit VDK Hub

A comprehensive platform for browsing, searching, and managing AI-assisted development rules and guidelines. Built with modern web technologies to provide developers with curated rules for various programming languages, frameworks, and development tasks.

## 🚀 Features

- **📚 Rule Catalog**: Browse comprehensive collection of AI development rules by category
- **🔍 Advanced Search**: Search rules by title, content, tags, and compatibility
- **⚙️ Rule Generator**: Interactive configuration for project-specific rule packages
- **👤 User Management**: Authentication, profiles, and personal rule collections
- **📦 Package Generation**: Download customized rule packages for your development stack
- **🔄 GitHub Integration**: Automatic synchronization with rule repositories
- **🌓 Theme Support**: Light/dark mode with system preference detection
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠 Technology Stack

### Frontend

- **Toolkit**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) with [Radix UI](https://www.radix-ui.com/) primitives
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: React Context API + [React Hook Form](https://react-hook-form.com/)
- **Type Safety**: [TypeScript 5.8](https://www.typescriptlang.org/)

### Backend & Database

- **Backend**: [Supabase](https://supabase.io/) (PostgreSQL, Authentication, Storage)
- **ORM**: Supabase Client with generated TypeScript types
- **Authentication**: Supabase Auth with GitHub OAuth support
- **File Processing**: Gray Matter for frontmatter parsing

### Development & Build Tools

- **Package Manager**: [pnpm](https://pnpm.io/)
- **Build Tool**: Next.js with custom webpack configuration
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
- **Code Quality**: ESLint + TypeScript strict mode
- **Version Control**: Git with conventional commits

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication pages group
│   ├── admin/                   # Admin dashboard pages
│   ├── api/                     # API routes
│   │   ├── admin/              # Admin API endpoints
│   │   ├── auth/               # Authentication endpoints
│   │   └── rules/              # Rule management APIs
│   ├── collections/            # User collections pages
│   ├── profile/                # User profile pages
│   ├── rules/                  # Rule browsing and display
│   │   ├── [category]/        # Category pages
│   │   └── r/                 # Rule redirect handling
│   ├── setup/                 # Configuration wizard
│   ├── globals.css            # Global styles and CSS variables
│   ├── layout.tsx             # Root layout component
│   └── page.tsx               # Homepage
├── components/                 # React components
│   ├── auth/                  # Authentication components
│   ├── collections/           # Collection management
│   ├── rules/                 # Rule-specific components
│   ├── search/                # Search functionality
│   ├── setup/                 # Rule Generator components
│   └── ui/                    # Reusable UI components (shadcn/ui)
├── lib/                       # Utilities and services
│   ├── actions/               # Server actions
│   ├── services/              # Business logic services
│   │   ├── github/           # GitHub integration
│   │   └── auth-service.ts   # Authentication service
│   ├── supabase/             # Supabase configuration
│   ├── error-handling.ts     # Error handling utilities
│   ├── types.ts              # TypeScript type definitions
│   └── utils.ts              # General utilities
├── scripts/                   # Build and maintenance scripts
├── public/                    # Static assets
├── .env.template             # Environment variables template
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🚦 Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (recommended) or npm/yarn
- **Supabase Account**: For database and authentication services
- **GitHub Account**: For OAuth authentication (optional)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/idominikosgr/Vibe-Coding-Rules.git
cd VibeKit VDK Hub-hub
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

```bash
cp .env.template .env.local
```

Edit `.env.local` with your configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# GitHub Integration (Optional)
GITHUB_TOKEN=your_github_token
GITHUB_REPO_OWNER=repository_owner
GITHUB_REPO_NAME=repository_name

# Webhook Security
GITHUB_WEBHOOK_SECRET=your_webhook_secret

# API Security
API_SECRET_KEY=your_api_secret_key
```

### 4. Database Setup

The application uses Supabase with the following key tables:

- `categories` - Rule categories and hierarchies
- `rules` - Individual rule definitions
- `profiles` - User profile information
- `collections` - User-created rule collections
- `sync_logs` - Synchronization operation history

### 5. Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Available Scripts

### Development

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Database & Sync Operations

```bash
pnpm sync-rules       # Sync rules from filesystem to database
pnpm import-rules     # Import rules with progress tracking
pnpm quick-sync       # Quick synchronization utility
```

### Maintenance

```bash
pnpm test            # Run test suite
pnpm test:watch      # Run tests in watch mode
```

## 🔧 Configuration

### Environment Variables

| Variable                         | Description                  | Required |
| -------------------------------- | ---------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase project URL         | ✅       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase anonymous key       | ✅       |
| `NEXT_SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key    | ✅       |
| `GITHUB_TOKEN`                   | GitHub personal access token | ❌       |
| `GITHUB_WEBHOOK_SECRET`          | GitHub webhook secret        | ❌       |
| `API_SECRET_KEY`                 | API endpoint protection key  | ❌       |

### Supabase Setup

1. Create a new Supabase project
2. Run the database migrations (SQL files in `supabase/` directory)
3. Configure authentication providers (GitHub OAuth recommended)
4. Set up Row Level Security (RLS) policies
5. Enable realtime subscriptions for live updates

### GitHub Integration (Optional)

For automatic rule synchronization:

1. Create a GitHub personal access token with repo permissions
2. Set up webhook endpoint: `https://your-domain.com/api/webhooks/github`
3. Configure webhook to trigger on push events to main branch

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Testing Strategy

- **Unit Tests**: Component logic and utility functions
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Critical user workflows (planned)

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
pnpm build
pnpm start
```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 API Overview

### Core Endpoints

#### Rules Management

- `GET /api/rules` - List rules with filtering and pagination
- `GET /api/rules/[category]` - Get rules by category
- `GET /api/rules/[category]/[ruleId]` - Get specific rule
- `POST /api/rules/r` - Rule lookup and redirect

#### Authentication

- `GET /api/auth/callback` - OAuth callback handler
- `POST /api/auth/logout` - User logout

#### Admin Operations

- `POST /api/admin/sync` - Trigger rule synchronization
- `GET /api/admin/sync-logs` - View synchronization history
- `POST /api/webhooks/github` - GitHub webhook handler

### Response Formats

#### Success Response

```json
{
  "data": {...},
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 100,
    "totalPages": 5
  }
}
```

#### Error Response

```json
{
  "error": "Error message",
  "details": "Additional error details",
  "status": 400
}
```

## 🛡 Security Considerations

### Authentication & Authorization

- Supabase Auth with Row Level Security (RLS)
- GitHub OAuth integration
- Admin role-based access control
- API endpoint protection with secret keys

### Data Protection

- Input validation with Zod schemas
- SQL injection protection via Supabase ORM
- XSS protection through React's built-in sanitization
- Secure cookie handling for sessions

### API Security

- Rate limiting on public endpoints (planned)
- CORS configuration for API routes
- Webhook signature verification
- Environment variable protection

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the coding standards
4. Add tests for new functionality
5. Run the test suite: `pnpm test`
6. Commit using conventional commits: `git commit -m 'feat: add amazing feature'`
7. Push to your branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Coding Standards

- Follow TypeScript strict mode requirements
- Use Prettier for code formatting
- Follow ESLint rules
- Write tests for new features
- Document complex logic with comments
- Use semantic commit messages

### Code Review Process

- All changes require PR approval
- Automated tests must pass
- No TypeScript errors or ESLint warnings
- Performance impact assessment for large changes

## 🐛 Troubleshooting

### Common Issues

#### Supabase Connection Issues

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Verify Supabase project status
# Check Supabase dashboard for any outages
```

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Authentication Problems

- Verify Supabase auth configuration
- Check GitHub OAuth app settings
- Ensure callback URLs are correctly configured
- Review browser console for auth errors

#### Rule Sync Issues

- Check GitHub token permissions
- Verify webhook endpoint configuration
- Review sync logs in admin dashboard
- Ensure rule files follow correct MDC format

### Performance Issues

- Monitor database query performance in Supabase dashboard
- Use React DevTools Profiler for client-side performance
- Check bundle size with Next.js analyzer
- Monitor Core Web Vitals in production

## 📊 Monitoring & Analytics

### Application Monitoring

- Supabase built-in analytics
- Next.js built-in analytics
- Error tracking with Supabase functions
- Performance monitoring via Web Vitals

### Key Metrics

- Page load times
- API response times
- Database query performance
- User engagement metrics
- Rule download statistics

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the excellent React framework
- **Supabase Team** - For the comprehensive backend platform
- **shadcn** - For the beautiful UI component library
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel** - For the deployment platform
- **React Team** - For the foundational UI library

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: Contact the maintainers for security issues

---

**Built with ❤️ by the VibeKit VDK Hub team**

---
