#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface DocumentationContent {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  order_index: number;
  tags: string[];
  icon?: string;
  status: 'published' | 'draft';
  visibility: 'public' | 'private' | 'team';
}

const basicDocumentationContent: DocumentationContent[] = [
  {
    title: 'Getting Started',
    slug: 'getting-started',
    order_index: 1,
    excerpt: 'Learn the basics of Vibe Coding Rules Hub and how to get started with AI-powered development rules.',
    status: 'published',
    visibility: 'public',
    tags: ['getting-started', 'introduction'],
    icon: '🚀',
    content: `# Getting Started with Vibe Coding Rules Hub

Welcome to Vibe Coding Rules Hub! This comprehensive platform helps you manage AI development rules, guidelines, and best practices for your development team.

## What is Vibe Coding Rules Hub?

Vibe Coding Rules Hub is an intelligent platform that:

- **📚 Centralizes Development Knowledge**: Store all your team's coding standards, best practices, and guidelines in one place
- **🤖 Powers AI Agents**: Provide context-aware rules that AI assistants can use to help with coding tasks
- **🔄 Syncs with GitHub**: Automatically sync rules from your GitHub repositories
- **👥 Enables Collaboration**: Allow team members to contribute and refine rules together
- **📊 Tracks Usage**: Monitor which rules are most effective and widely used

## Key Features

### 1. Rule Management
- Create, edit, and organize development rules by category
- Support for multiple programming languages and frameworks
- Version control for rule changes
- Rich text editing with markdown support

### 2. AI Integration
- Rules designed to work with AI coding assistants
- Context-aware rule suggestions
- Automated rule application in development workflows

### 3. Team Collaboration
- User management and permissions
- Comment and discussion system
- Rule voting and community feedback

### 4. GitHub Integration
- Automatic rule synchronization from repositories
- Webhook support for real-time updates
- Backup and restore functionality

## Quick Start

1. **Sign Up**: Create your account using GitHub or email
2. **Explore Categories**: Browse the existing rule categories
3. **Add Your First Rule**: Click "Add Rule" to create your first development guideline
4. **Set Up GitHub Sync**: Connect your repositories to sync existing rules
5. **Invite Your Team**: Add team members to collaborate on rules

## Architecture Overview

Vibe Coding Rules Hub is built with modern technologies:

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Supabase (PostgreSQL) for data storage and authentication
- **AI Integration**: OpenAI compatible APIs for intelligent features
- **Deployment**: Vercel for seamless hosting and CI/CD

## Getting Help

Need assistance? Here are your options:

- 📖 Check our comprehensive documentation
- 💬 Join our community discussions
- 🐛 Report issues on GitHub
- 📧 Contact our support team

Let's build better software together with AI-powered development rules! 🎉`
  },

  {
    title: 'System Architecture',
    slug: 'system-architecture',
    order_index: 2,
    excerpt: 'Understand the technical architecture and design principles behind Vibe Coding Rules Hub.',
    status: 'published',
    visibility: 'public',
    tags: ['architecture', 'system-design', 'overview'],
    icon: '🏗️',
    content: `# System Architecture

Vibe Coding Rules Hub is built on a modern, scalable architecture designed for performance, reliability, and developer experience.

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router for optimal performance
- **TypeScript**: Type-safe development for better maintainability
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Shadcn/ui**: High-quality component library for consistent design

### Backend
- **Supabase**: Complete backend-as-a-service platform
  - PostgreSQL database for reliable data storage
  - Authentication with multiple providers
  - Real-time subscriptions
  - File storage and CDN
  - Row Level Security (RLS) for data protection

### AI & ML
- **OpenAI API**: GPT models for intelligent rule generation and analysis
- **Embeddings**: Vector search for semantic rule discovery
- **Custom Agents**: Specialized AI agents for different development tasks

### DevOps & Infrastructure
- **Vercel**: Serverless deployment with edge functions
- **GitHub Actions**: CI/CD pipeline automation
- **GitHub Integration**: Repository synchronization and webhooks

## Core Components

### 1. Rule Management System

The heart of the application handles:
- Rule creation, editing, and versioning
- Category and tag organization
- Search and discovery functionality
- Import/export capabilities

### 2. Authentication & Authorization

Multi-layered security approach:
- OAuth integration (GitHub, Google, etc.)
- Role-based access control (RBAC)
- Row-level security in the database
- API key management for external integrations

### 3. Sync Engine

Intelligent synchronization between:
- GitHub repositories and the platform
- Multiple repository sources
- Conflict resolution and merging
- Webhook-driven real-time updates

### 4. AI Agent Framework

Extensible framework for:
- Rule analysis and suggestions
- Code review integration
- Automated rule generation
- Custom agent development

## Database Schema

### Core Tables

- **rules**: Main rule storage with content and metadata
- **categories**: Hierarchical organization system
- **tags**: Flexible tagging for cross-cutting concerns
- **users**: User profiles and preferences
- **organizations**: Multi-tenant support
- **sync_logs**: Tracking synchronization history

### Relationships

The database uses a normalized structure with:
- Many-to-many relationships between rules and tags
- Hierarchical categories with parent-child relationships
- User permissions at multiple levels
- Audit trails for all changes

## API Design

### RESTful Endpoints

Standard REST patterns for:
- CRUD operations on all resources
- Pagination and filtering
- Bulk operations for efficiency
- Webhook endpoints for external integrations

### GraphQL Interface

Advanced querying capabilities:
- Flexible data fetching
- Real-time subscriptions
- Type-safe schema
- Custom resolvers for complex operations

## Security Architecture

### Data Protection
- End-to-end encryption for sensitive data
- Regular security audits and updates
- Compliance with industry standards
- Secure API key management

### Access Control
- Fine-grained permissions system
- Role-based access control
- Resource-level security policies
- Audit logging for compliance

## Performance Optimization

### Caching Strategy
- CDN caching for static assets
- Database query optimization
- Redis caching for frequently accessed data
- Client-side caching with SWR

### Scalability Features
- Serverless architecture for automatic scaling
- Database connection pooling
- Async processing for heavy operations
- Load balancing across regions

## Monitoring & Observability

### Application Monitoring
- Real-time error tracking with Sentry
- Performance monitoring and APM
- Custom metrics and dashboards
- Health checks and uptime monitoring

### Analytics
- User behavior analytics
- Feature usage tracking
- Performance metrics
- A/B testing framework

## Future Architecture Goals

### Planned Enhancements
- Microservices architecture for complex features
- Enhanced AI capabilities with custom models
- Multi-region deployment for global scale
- Advanced analytics and ML insights

### Extension Points
- Plugin system for custom functionality
- Webhook ecosystem for integrations
- API marketplace for third-party tools
- Custom AI agent development platform

This architecture provides a solid foundation for current needs while maintaining flexibility for future growth and innovation.`
  },

  {
    title: 'AI Agent Concepts',
    slug: 'ai-agent-concepts',
    order_index: 3,
    excerpt: 'Learn about agentic AI principles and how they power intelligent development workflows.',
    status: 'published',
    visibility: 'public',
    tags: ['agentic-ai', 'ai-agents', 'concepts'],
    icon: '🤖',
    content: `# AI Agent Concepts

Understanding agentic AI is crucial for leveraging Vibe Coding Rules Hub's intelligent features. This guide covers the core concepts and principles behind AI agents.

## What are AI Agents?

AI Agents are autonomous systems that can:
- **Perceive** their environment through sensors or data inputs
- **Reason** about goals and available actions
- **Act** to achieve specific objectives
- **Learn** from experiences to improve performance

Unlike traditional software, AI agents can adapt their behavior based on context and experience.

## Core Agent Properties

### 1. Autonomy
Agents operate independently without constant human supervision:
- Make decisions based on programmed goals
- Adapt to changing conditions
- Handle unexpected situations gracefully

### 2. Reactivity
Agents respond appropriately to environmental changes:
- Monitor relevant data sources
- React to user inputs and system events
- Adjust behavior based on feedback

### 3. Pro-activeness
Agents take initiative to achieve goals:
- Plan ahead to accomplish objectives
- Anticipate problems and opportunities
- Execute long-term strategies

### 4. Social Ability
Agents interact effectively with other agents and humans:
- Communicate through well-defined protocols
- Collaborate on complex tasks
- Negotiate and coordinate actions

## Agent Types in Development

### 1. Code Analysis Agents
- **Static Analysis**: Examine code without execution
- **Pattern Recognition**: Identify common coding patterns
- **Quality Assessment**: Evaluate code quality metrics
- **Security Scanning**: Detect potential vulnerabilities

### 2. Development Workflow Agents
- **Task Automation**: Automate repetitive development tasks
- **Process Optimization**: Improve development workflows
- **Resource Management**: Optimize system resource usage
- **Deployment Coordination**: Manage complex deployment processes

### 3. Knowledge Management Agents
- **Rule Curation**: Organize and maintain development rules
- **Context Awareness**: Understand project-specific requirements
- **Information Retrieval**: Find relevant documentation and examples
- **Learning Facilitation**: Help teams learn new technologies

## Agent Architecture Patterns

### 1. Reactive Agents
Simple stimulus-response behavior:
- Condition-action rules
- Direct mapping from inputs to outputs
- Fast response times
- Limited reasoning capabilities

### 2. Deliberative Agents
Goal-oriented planning and reasoning:
- Symbolic world models
- Planning algorithms
- Knowledge representation
- Complex problem-solving capabilities

### 3. Hybrid Agents
Combination of reactive and deliberative approaches:
- Layered architectures
- Real-time reactive responses
- Background deliberative planning
- Balanced performance and capability

## Multi-Agent Systems

### Agent Communication
- **Message Passing**: Structured communication protocols
- **Shared Memory**: Common data structures for coordination
- **Event Systems**: Publish-subscribe patterns for loose coupling
- **Negotiation Protocols**: Formal methods for reaching agreements

### Coordination Patterns
- **Hierarchical**: Clear authority and command structures
- **Peer-to-Peer**: Equal agents collaborating directly
- **Market-Based**: Economic models for resource allocation
- **Consensus-Based**: Democratic decision-making processes

## Learning and Adaptation

### Machine Learning Integration
- **Supervised Learning**: Learning from labeled examples
- **Reinforcement Learning**: Learning through trial and error
- **Unsupervised Learning**: Discovering patterns in data
- **Transfer Learning**: Applying knowledge across domains

### Adaptation Strategies
- **Parameter Tuning**: Adjusting agent behavior parameters
- **Rule Evolution**: Modifying decision-making rules
- **Model Updates**: Improving internal world models
- **Strategy Learning**: Developing new problem-solving approaches

## Development Rule Agents

### Rule Application Agents
- Analyze code against established rules
- Suggest improvements based on best practices
- Automate rule enforcement in CI/CD pipelines
- Generate rule-compliant code templates

### Rule Discovery Agents
- Mine codebases for emerging patterns
- Identify inconsistencies in current rules
- Suggest new rules based on team practices
- Analyze rule effectiveness over time

### Rule Evolution Agents
- Track rule usage and effectiveness
- Propose rule modifications based on feedback
- Manage rule versioning and migration
- Coordinate rule changes across teams

## Ethical Considerations

### Transparency
- Explainable decision-making processes
- Clear audit trails for agent actions
- Understandable agent behavior models
- Open communication about agent capabilities

### Accountability
- Clear responsibility for agent decisions
- Human oversight and intervention capabilities
- Error handling and recovery mechanisms
- Performance monitoring and evaluation

### Fairness
- Unbiased decision-making algorithms
- Equal treatment across different contexts
- Protection against discriminatory outcomes
- Inclusive design principles

## Implementation Best Practices

### Design Principles
- **Single Responsibility**: Each agent has a clear, focused purpose
- **Loose Coupling**: Agents interact through well-defined interfaces
- **Fault Tolerance**: Graceful handling of failures and errors
- **Scalability**: Architecture supports growth and increased load

### Development Guidelines
- Start with simple reactive agents
- Add deliberative capabilities gradually
- Implement comprehensive testing strategies
- Monitor agent performance continuously
- Maintain clear documentation and specifications

## Future Directions

### Emerging Trends
- **Large Language Model Integration**: Leveraging advanced AI models
- **Collaborative AI**: Human-AI partnership models
- **Autonomous Development**: Self-improving development systems
- **Cross-Domain Agents**: Agents that work across multiple domains

### Research Areas
- Advanced reasoning capabilities
- Improved learning algorithms
- Better human-agent interaction models
- Scalable multi-agent coordination

Understanding these concepts will help you effectively use and extend Vibe Coding Rules Hub's AI capabilities for your development needs.`
  },

  {
    title: 'User Guide',
    slug: 'user-guide',
    order_index: 4,
    excerpt: 'Complete guide for using Vibe Coding Rules Hub features and workflows.',
    status: 'published',
    visibility: 'public',
    tags: ['tutorial', 'user-guide', 'workflow'],
    icon: '📖',
    content: `# User Guide

This comprehensive guide covers all the features and workflows in Vibe Coding Rules Hub, from basic usage to advanced configurations.

## Getting Started

### Account Setup
1. **Sign Up**: Use GitHub OAuth or create an account with email
2. **Profile Setup**: Complete your profile with relevant information
3. **Organization Joining**: Join your team's organization if applicable
4. **Preferences**: Configure your personal settings and preferences

### Dashboard Overview
The main dashboard provides:
- **Recent Rules**: Latest rules you've viewed or created
- **Popular Categories**: Most active rule categories
- **Team Activity**: Recent changes by your team members
- **Quick Actions**: Shortcuts to common tasks

## Working with Rules

### Browsing Rules
- **Categories**: Navigate through organized rule categories
- **Search**: Use full-text search to find specific rules
- **Filters**: Apply filters by language, framework, or tags
- **Sorting**: Sort by popularity, recency, or relevance

### Creating Rules
1. **Choose Category**: Select appropriate category for your rule
2. **Rule Details**: Add title, description, and content
3. **Metadata**: Set language, framework, and tags
4. **Examples**: Include code examples and use cases
5. **Review**: Preview and refine before publishing

### Editing Rules
- **In-place Editing**: Click edit button on any rule you have permission to modify
- **Version History**: View and restore previous versions
- **Collaborative Editing**: Work with team members on rule improvements
- **Change Comments**: Document what changed and why

## Categories and Organization

### Category Management
- **Hierarchical Structure**: Organize rules in nested categories
- **Custom Categories**: Create organization-specific categories
- **Category Descriptions**: Provide context for category purpose
- **Access Control**: Set permissions for different categories

### Tagging System
- **Free-form Tags**: Add descriptive tags to improve discoverability
- **Tag Hierarchies**: Use structured tag taxonomies
- **Auto-tagging**: Leverage AI for automatic tag suggestions
- **Tag Management**: Clean up and organize tags over time

## Search and Discovery

### Advanced Search
- **Boolean Operators**: Use AND, OR, NOT for complex queries
- **Field-specific Search**: Search within specific fields
- **Regex Support**: Use regular expressions for pattern matching
- **Saved Searches**: Save frequently used search queries

### Semantic Search
- **Natural Language**: Search using natural language descriptions
- **Concept Matching**: Find conceptually related rules
- **Example-based Search**: Find rules similar to code examples
- **Context-aware Results**: Results tailored to your current project

## GitHub Integration

### Repository Sync
1. **Connect Repository**: Link your GitHub repositories
2. **Configure Sync**: Set up which files and folders to sync
3. **Sync Rules**: Initial import of existing rules from repositories
4. **Ongoing Sync**: Automatic updates when repository changes

### Webhook Configuration
- **Real-time Updates**: Get immediate updates when rules change
- **Conflict Resolution**: Handle conflicts between local and remote changes
- **Sync History**: Track all synchronization activities
- **Error Handling**: Manage and resolve sync errors

## Collaboration Features

### Team Management
- **User Roles**: Assign appropriate roles (viewer, contributor, admin)
- **Permissions**: Control who can view, edit, or delete rules
- **Team Workspaces**: Create focused workspaces for different teams
- **Activity Feeds**: Track team member activities and contributions

### Comments and Discussions
- **Rule Comments**: Discuss specific rules with team members
- **Threaded Discussions**: Organize conversations in threads
- **Mentions**: Notify specific team members using @mentions
- **Resolution Tracking**: Mark discussions as resolved

### Voting and Feedback
- **Rule Voting**: Vote on rule quality and usefulness
- **Feedback Collection**: Provide structured feedback on rules
- **Usage Metrics**: Track which rules are most valuable
- **Community Curation**: Let the community improve rule quality

## AI-Powered Features

### Smart Suggestions
- **Rule Recommendations**: Get suggestions for relevant rules
- **Content Improvements**: AI-powered suggestions for rule content
- **Duplicate Detection**: Identify similar or duplicate rules
- **Gap Analysis**: Find missing rules in your knowledge base

### Automated Workflows
- **Rule Generation**: Generate rules from code examples
- **Quality Assessment**: Automated rule quality scoring
- **Consistency Checking**: Identify inconsistencies across rules
- **Update Notifications**: Get notified about relevant rule changes

## Personal Productivity

### Bookmarks and Collections
- **Bookmarking**: Save frequently referenced rules
- **Personal Collections**: Organize rules into personal collections
- **Shared Collections**: Create collections for team use
- **Export Options**: Export collections for offline use

### Notifications
- **Activity Notifications**: Stay updated on relevant changes
- **Custom Alerts**: Set up alerts for specific rule changes
- **Digest Options**: Choose daily, weekly, or real-time updates
- **Channel Preferences**: Configure email, web, or mobile notifications

### Keyboard Shortcuts
- **Navigation**: Quick navigation between sections
- **Search**: Instant search activation
- **Actions**: Quick access to common actions
- **Customization**: Configure shortcuts to match your workflow

## Mobile and Offline Usage

### Mobile App
- **Native Features**: Full-featured mobile application
- **Offline Reading**: Access downloaded rules without internet
- **Push Notifications**: Important updates on your mobile device
- **Quick Entry**: Add rules and notes on the go

### Offline Capabilities
- **Sync for Offline**: Download rules for offline access
- **Local Changes**: Make changes that sync when online
- **Conflict Resolution**: Handle conflicts from offline changes
- **Backup and Restore**: Local backup of important data

## Advanced Features

### API Access
- **REST API**: Programmatic access to all features
- **GraphQL**: Flexible data querying interface
- **Webhooks**: React to events in real-time
- **SDK Libraries**: Official libraries for popular languages

### Integrations
- **IDE Plugins**: Direct access from your development environment
- **CI/CD Integration**: Incorporate rules into your build process
- **Documentation Tools**: Generate documentation from rules
- **Code Review Tools**: Integrate with code review workflows

### Custom Workflows
- **Automation Rules**: Create custom automation workflows
- **Custom Fields**: Add organization-specific metadata
- **Template System**: Create reusable rule templates
- **Reporting**: Generate custom reports and analytics

## Troubleshooting

### Common Issues
- **Sync Problems**: Resolve repository synchronization issues
- **Permission Errors**: Fix access control problems
- **Performance Issues**: Optimize for better performance
- **Search Problems**: Improve search results quality

### Getting Help
- **Documentation**: Comprehensive documentation and guides
- **Community Support**: Active community forums and discussions
- **Support Tickets**: Direct support for complex issues
- **Training Resources**: Videos, tutorials, and best practices

This guide provides a foundation for effective use of Vibe Coding Rules Hub. As you become more familiar with the platform, explore advanced features to maximize your team's productivity and code quality.`
  }
];

async function createTags() {
  console.log('🏷️  Creating documentation tags...');
  
  const tags = [
    { name: 'getting-started', description: 'Beginner-friendly introductory content', color: '#F59E0B' },
    { name: 'introduction', description: 'Introductory and foundational content', color: '#059669' },
    { name: 'architecture', description: 'System architecture and design', color: '#6366F1' },
    { name: 'system-design', description: 'System design principles and patterns', color: '#F97316' },
    { name: 'overview', description: 'High-level overviews and summaries', color: '#14B8A6' },
    { name: 'agentic-ai', description: 'Agentic artificial intelligence concepts', color: '#9333EA' },
    { name: 'ai-agents', description: 'AI agent development and management', color: '#DC2626' },
    { name: 'concepts', description: 'Core concepts and theoretical foundations', color: '#0284C7' },
    { name: 'tutorial', description: 'Step-by-step tutorial content', color: '#06B6D4' },
    { name: 'user-guide', description: 'User guides and how-to content', color: '#84CC16' },
    { name: 'workflow', description: 'Development workflows and processes', color: '#EC4899' }
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
        console.error(`❌ Error creating tag ${tag.name}:`, error);
      } else {
        console.log(`✅ Created tag: ${tag.name}`);
      }
    }
  }
}

async function createDocumentationPages() {
  console.log('📚 Creating documentation pages...');

  // Get all admin users
  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .select('email');

  console.log('Admin data:', adminData, 'Error:', adminError);

  if (!adminData || adminData.length === 0) {
    console.error('❌ No admin users found. Please add an admin user first.');
    return;
  }

  // Find an admin with a matching profile
  let authorId = null;
  let matchedAdmin = null;

  for (const admin of adminData) {
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, name')
      .eq('email', admin.email)
      .single();

    console.log(`Checking profile for ${admin.email}:`, userProfile, 'Error:', profileError);

    if (userProfile) {
      authorId = userProfile.id;
      matchedAdmin = admin;
      console.log(`✅ Found matching admin and profile: ${admin.email} (${userProfile.name || userProfile.email})`);
      break;
    }
  }

  if (!authorId) {
    console.error('❌ No admin user with a matching profile found.');
    console.log('📋 Available admins:', adminData.map(a => a.email));
    
    // Check available profiles
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('email, name')
      .limit(10);
    console.log('📋 Available profiles:', allProfiles);
    return;
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
      console.log(`ℹ️  Page ${doc.title} already exists, skipping...`);
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
        path: `/docs/${doc.slug}`
      })
      .select()
      .single();

    if (pageError) {
      console.error(`❌ Error creating page ${doc.title}:`, pageError);
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

// Run if this is the main module
main();

export { basicDocumentationContent }; 