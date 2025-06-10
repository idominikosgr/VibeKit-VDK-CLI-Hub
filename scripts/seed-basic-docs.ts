#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Use remote Supabase instance from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const basicDocumentationContent = [
  {
    title: 'Getting Started Guide',
    slug: 'getting-started',
    section: 'introduction',
    order_index: 1,
    excerpt: 'Learn how to get started with Vibe Coding Rules Hub and create your first rule.',
    status: 'published' as const,
    visibility: 'public' as const,
    tags: ['getting-started', 'tutorial', 'introduction'],
    icon: '🚀',
    content: `# Getting Started with Vibe Coding Rules Hub

Welcome to Vibe Coding Rules Hub! This guide will help you understand the platform and create your first rule.

## What is Vibe Coding Rules Hub?

Vibe Coding Rules Hub is an AI-powered platform for managing development rules, guidelines, and best practices. It helps teams:

- Centralize development knowledge
- Enable AI agents with contextual rules
- Sync rules from GitHub repositories
- Collaborate on rule creation and refinement
- Track rule usage and effectiveness

## Your First Rule

### 1. Access the Platform

Navigate to the documentation section and if you're an admin, you'll see admin controls in the bottom-right corner.

### 2. Create a New Page

Click on the admin tools and select "Create New Page" to add new documentation content.

### 3. Fill in the Details

- **Title**: Give your page a clear, descriptive title
- **Excerpt**: Write a brief summary of what the page covers
- **Content**: Add your documentation content using Markdown
- **Status**: Choose between Draft or Published
- **Visibility**: Set who can view the content

### 4. Organize with Tags

Use tags to help organize and categorize your content for easier discovery.

## Admin Features

If you're an admin, you have access to additional features:

- **Create New Pages**: Add documentation content
- **Create Tags**: Organize content with custom tags
- **Manage Pages**: View and manage all documentation pages
- **Edit Content**: Update existing documentation
- **Delete Content**: Remove outdated or incorrect information

## Best Practices

1. **Clear Titles**: Use descriptive titles that clearly indicate the content
2. **Good Structure**: Organize content with headers and sections
3. **Examples**: Include practical examples where possible
4. **Regular Updates**: Keep content current and accurate
5. **Consistent Tagging**: Use a consistent tagging strategy

## Next Steps

- Explore existing documentation
- Create your first page if you're an admin
- Organize content with collections
- Collaborate with team members

Happy documenting! 🎉`
  },
  {
    title: 'System Architecture Overview',
    slug: 'architecture-overview',
    section: 'architecture',
    order_index: 1,
    excerpt: 'High-level overview of Vibe Coding Rules Hub architecture and core components.',
    status: 'published' as const,
    visibility: 'public' as const,
    tags: ['architecture', 'overview', 'system-design'],
    icon: '🏗️',
    content: `# System Architecture Overview

Vibe Coding Rules Hub is built with a modern, scalable architecture designed to support AI-powered development workflows and team collaboration.

## Architecture Principles

### Core Design Philosophy

1. **AI-First Design**: Every component is designed with AI agent interaction in mind
2. **Scalable by Default**: Built to handle growth from small teams to large enterprises
3. **Developer Experience**: Optimized for developer productivity and ease of use
4. **Real-time Collaboration**: Support for multiple users working simultaneously
5. **Extensible**: Plugin architecture for custom integrations and workflows

### Technical Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with TypeScript
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Authentication**: Supabase Auth with OAuth providers
- **Storage**: Supabase Storage for files and assets
- **Deployment**: Vercel with edge functions
- **CI/CD**: GitHub Actions with automated testing and deployment

## Core Components

### 1. Frontend Layer

**Next.js Application**
- App Router: Modern routing with layouts and loading states
- Server Components: Performance-optimized rendering
- Client Components: Interactive UI with React hooks
- Middleware: Authentication and route protection

**Key Features**:
- Real-time updates via Supabase subscriptions
- Optimistic UI updates for better UX
- Progressive Web App (PWA) capabilities
- Responsive design for all device sizes

### 2. API Layer

**RESTful API Design**
- /api/auth/ - Authentication endpoints
- /api/rules/ - Rule management
- /api/categories/ - Category operations
- /api/collections/ - User collections
- /api/docs/ - Documentation system
- /api/admin/ - Administrative functions
- /api/webhooks/ - External integrations

**Key Patterns**:
- Consistent error handling and response formats
- Request/response validation with Zod schemas
- Rate limiting and security middleware
- Comprehensive logging and monitoring

### 3. Data Layer

**Database Schema**

Core Tables:
- rules - Rule definitions and metadata
- categories - Hierarchical categorization
- rule_versions - Version history and changes
- collections - User-created rule groupings
- users - User profiles and preferences

Collaboration:
- comments - Rule discussions and feedback
- votes - Community rating system
- bookmarks - User bookmarks and favorites
- subscriptions - Notification preferences

Documentation:
- documentation_pages - Rich documentation content
- documentation_tags - Tagging system
- documentation_comments - Documentation discussions

System:
- audit_logs - Change tracking and compliance
- sync_logs - GitHub synchronization history
- analytics_events - Usage analytics and metrics

## Security Architecture

### Authentication Security

- JWT Tokens: Secure, stateless authentication
- Refresh Tokens: Long-term session management
- PKCE Flow: Secure OAuth implementation
- Rate Limiting: Brute force protection

### Data Security

- Row Level Security: Database-level access control
- Field Encryption: Sensitive data protection
- Audit Logging: Comprehensive change tracking
- GDPR Compliance: Data privacy and deletion rights

## Performance Architecture

### Caching Strategy

Multi-Level Caching:
- CDN Cache (Vercel) → Server Cache (Redis) → Application Cache → Database Cache

### Database Optimization

- Connection Pooling: Efficient database connections
- Query Optimization: Indexed queries and joins
- Read Replicas: Distributed read operations
- Materialized Views: Pre-computed aggregations

### Client-Side Performance

- Code Splitting: Lazy loading of components
- Image Optimization: Next.js image optimization
- Bundle Analysis: Monitoring bundle sizes
- Core Web Vitals: Performance monitoring

This architecture provides a solid foundation for current needs while maintaining flexibility for future growth and feature additions.`
  },
  {
    title: 'AI Agent Integration',
    slug: 'ai-agent-integration',
    section: 'ai-concepts',
    order_index: 1,
    excerpt: 'Understand how AI agents integrate with Vibe Coding Rules Hub for intelligent development workflows.',
    status: 'published' as const,
    visibility: 'public' as const,
    tags: ['ai-agents', 'integration', 'agentic-ai', 'concepts'],
    icon: '🤖',
    content: `# AI Agent Integration

Vibe Coding Rules Hub is designed from the ground up to enable powerful AI agent interactions that enhance development workflows through intelligent rule application and reasoning.

## What are AI Agents?

AI Agents are autonomous systems that can:

- **Plan**: Break down complex tasks into manageable steps
- **Reason**: Apply logical thinking to solve problems
- **Act**: Execute actions in their environment
- **Learn**: Adapt based on feedback and experience
- **Collaborate**: Work with humans and other agents effectively

## Rule-Driven Agent Behavior

### Context-Aware Rule Application

AI agents in Vibe Coding Rules Hub use the rule system to:

1. **Understand Context**: Analyze the current development situation
2. **Retrieve Relevant Rules**: Find applicable rules based on technology, category, and context
3. **Apply Rules Intelligently**: Use rules to guide decision-making and action execution
4. **Validate Compliance**: Ensure generated code and recommendations follow established patterns

### Dynamic Rule Loading

Agents can dynamically load rules based on:
- Technology stack (React, Python, Docker, etc.)
- Project context and requirements
- Team preferences and custom rules
- Historical usage patterns and effectiveness

## Agent Types

### 1. Code Generation Agents

**Intelligent Code Creation**
- Context-aware code generation
- Best practice enforcement
- Style guide compliance
- Test generation integration

**Features**:
- Rule-compliant code generation
- Technology-specific patterns
- Team convention adherence
- Quality assurance integration

### 2. Code Review Agents

**Automated Review Process**
- Security vulnerability detection
- Performance optimization suggestions
- Code quality assessment
- Documentation generation

**Capabilities**:
- Rule-based review criteria
- Consistent feedback application
- Learning from team preferences
- Integration with development workflows

### 3. Architecture Planning Agents

**System Design Assistance**
- Component dependency analysis
- Architecture pattern recommendations
- Scalability and performance considerations
- Integration strategy development

### 4. Documentation Agents

**Intelligent Documentation**
- Automated documentation generation
- Content organization and structuring
- Cross-reference management
- Knowledge gap identification

## Integration Patterns

### 1. API-Based Integration

Agents can interact with Vibe Coding Rules Hub through RESTful APIs:

- **Rule Retrieval**: GET /api/rules with filtering and search
- **Rule Application**: POST /api/rules/apply with context
- **Feedback Loop**: POST /api/analytics/usage for learning
- **Real-time Updates**: WebSocket connections for live rule updates

### 2. SDK Integration

Future SDK support will enable:
- Native language bindings
- Type-safe rule interactions
- Local caching and optimization
- Offline rule access

### 3. Webhook Integration

Real-time notifications for:
- Rule updates and changes
- New rule publications
- Team collaboration events
- System status changes

## Agent Communication

### Human-Agent Collaboration

**Interactive Workflow Design**
- Clear communication protocols
- Feedback integration mechanisms
- Explanation and transparency features
- Override and control capabilities

### Agent-to-Agent Communication

**Protocol Standards**
- Message formatting and routing
- Capability discovery and negotiation
- Resource sharing and coordination
- Conflict resolution procedures

## Benefits of AI Agent Integration

### 1. Development Productivity

**Automated Routine Tasks**
- Boilerplate code generation
- Documentation creation
- Test case development
- Code refactoring assistance

**Intelligent Assistance**
- Context-aware suggestions
- Proactive problem identification
- Learning from team practices
- Continuous improvement recommendations

### 2. Quality Assurance

**Consistent Standards**
- Automated compliance checking
- Best practice enforcement
- Style guide adherence
- Security vulnerability prevention

**Continuous Monitoring**
- Real-time code analysis
- Performance optimization suggestions
- Architecture health assessment
- Technical debt identification

### 3. Knowledge Management

**Organizational Learning**
- Rule effectiveness analysis
- Team practice evolution
- Knowledge gap identification
- Best practice propagation

## Getting Started with AI Agents

### 1. Enable AI Features

Configure your environment to support AI agent interactions:
- Set up API keys and authentication
- Configure rule access permissions
- Enable real-time synchronization
- Set up monitoring and logging

### 2. Choose Integration Method

Select the appropriate integration approach:
- Direct API calls for custom agents
- Webhook subscriptions for event-driven workflows
- Future SDK integration for native applications

### 3. Implement Feedback Loops

Ensure agents can learn and improve:
- Track rule application effectiveness
- Monitor user satisfaction with agent outputs
- Collect usage analytics and patterns
- Implement continuous learning mechanisms

AI agents represent the future of intelligent development assistance, where AI systems become true partners in the software development process, capable of understanding context, applying rules intelligently, and continuously learning from experience.`
  }
];

async function createTags() {
  console.log('🏷️  Creating documentation tags...');
  
  const tags = [
    { name: 'getting-started', description: 'Beginner-friendly introductory content', color: '#F59E0B' },
    { name: 'tutorial', description: 'Step-by-step tutorial content', color: '#06B6D4' },
    { name: 'introduction', description: 'Introductory and foundational content', color: '#059669' },
    { name: 'architecture', description: 'System architecture and design', color: '#6366F1' },
    { name: 'overview', description: 'High-level overviews and summaries', color: '#14B8A6' },
    { name: 'system-design', description: 'System design principles and patterns', color: '#F97316' },
    { name: 'ai-agents', description: 'AI agent development and management', color: '#DC2626' },
    { name: 'integration', description: 'Integration patterns and methods', color: '#7C3AED' },
    { name: 'agentic-ai', description: 'Agentic artificial intelligence concepts', color: '#9333EA' },
    { name: 'concepts', description: 'Core concepts and theoretical foundations', color: '#0284C7' }
  ];

  for (const tag of tags) {
    const { data: existingTag } = await supabase
      .from('documentation_tags')
      .select('id')
      .eq('name', tag.name)
      .single();

    if (!existingTag) {
      const { error } = await supabase
        .from('documentation_tags')
        .insert({
          name: tag.name,
          slug: tag.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: tag.description,
          color: tag.color
        });

      if (error) {
        console.error(`❌ Error creating tag ${tag.name}:`, JSON.stringify(error, null, 2));
      } else {
        console.log(`✅ Created tag: ${tag.name}`);
      }
    } else {
      console.log(`⏭️  Tag already exists: ${tag.name}`);
    }
  }
}

async function createDocumentationPages() {
  console.log('📚 Creating documentation pages...');

  // Get admin user ID (using first admin as author)
  const { data: adminData } = await supabase
    .from('admins')
    .select('email')
    .limit(1)
    .single();

  if (!adminData) {
    console.error('❌ No admin user found. Please add an admin user first.');
    return;
  }

  // Try to get user profile for the admin
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', adminData.email)
    .single();

  // Try to get a real user ID from auth.users if profile doesn't exist
  let authorId = userProfile?.id;
  
  if (!authorId) {
    console.log(`⚠️  No profile found for ${adminData.email}, creating documentation without author`);
  } else {
    console.log(`👤 Using author: ${adminData.email} (ID: ${authorId})`);
  }

  for (const doc of basicDocumentationContent) {
    console.log(`📄 Creating page: ${doc.title}`);

    // Check if page already exists
    const { data: existingPage } = await supabase
      .from('documentation_pages')
      .select('id')
      .eq('slug', doc.slug)
      .single();

    if (existingPage) {
      console.log(`⏭️  Page already exists: ${doc.title}`);
      continue;
    }

    // Create the page
    const { data: page, error: pageError } = await supabase
      .from('documentation_pages')
      .insert({
        title: doc.title,
        slug: doc.slug,
        content: doc.content,
        excerpt: doc.excerpt,
        icon: doc.icon,
        status: doc.status,
        visibility: doc.visibility,
        content_type: 'markdown',
        author_id: authorId,
        last_edited_by: authorId,
        order_index: doc.order_index,
        path: `/${doc.section}/${doc.slug}`,
        published_at: doc.status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (pageError) {
      // Check if it's the constraint error we're expecting
      if (pageError.code === '42P10') {
        console.log(`⚠️  Constraint issue detected for ${doc.title}. This might be due to missing unique constraint on documentation_search_cache.`);
        console.log(`   Please add this constraint manually in Supabase dashboard:`);
        console.log(`   ALTER TABLE documentation_search_cache ADD CONSTRAINT documentation_search_cache_page_id_unique UNIQUE (page_id);`);
      } else {
        console.error(`❌ Error creating page ${doc.title}:`, JSON.stringify(pageError, null, 2));
      }
      continue;
    }

    // Create tags and associate them with the page
    if (doc.tags && doc.tags.length > 0) {
      for (const tagName of doc.tags) {
        // Get tag ID
        const { data: tag } = await supabase
          .from('documentation_tags')
          .select('id')
          .eq('name', tagName)
          .single();

        if (tag) {
          // Associate tag with page
          const { error: tagError } = await supabase
            .from('documentation_page_tags')
            .insert({
              page_id: page.id,
              tag_id: tag.id
            });

          if (tagError && tagError.code !== '23505') { // Ignore duplicate entries
            console.error(`❌ Error associating tag ${tagName} with page ${doc.title}:`, tagError);
          }
        }
      }
    }

    console.log(`✅ Created page: ${doc.title}`);
  }
}

async function main() {
  try {
    console.log('🚀 Starting basic documentation population...');
    
    await createTags();
    await createDocumentationPages();
    
    console.log('🎉 Basic documentation population completed successfully!');
    
    // Print summary
    const { count: pageCount } = await supabase
      .from('documentation_pages')
      .select('id', { count: 'exact', head: true });
    
    const { count: tagCount } = await supabase
      .from('documentation_tags')
      .select('id', { count: 'exact', head: true });

    console.log(`\n📊 Summary:`);
    console.log(`   Pages created: ${pageCount}`);
    console.log(`   Tags available: ${tagCount}`);
    console.log(`\n🌐 Visit your documentation at: /docs`);
    
  } catch (error) {
    console.error('❌ Error during documentation population:', error);
    process.exit(1);
  }
}

// Run the script
main();

export { basicDocumentationContent }; 