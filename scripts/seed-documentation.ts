import { documentationServiceServer } from '@/lib/services/documentation-service-server';

const samplePages = [
  {
    title: 'Getting Started',
    slug: 'getting-started',
    content: `# Getting Started

Welcome to the CodePilotRules Hub documentation! This guide will help you get up and running quickly.

## Installation

First, clone the repository and install dependencies:

\`\`\`bash
git clone https://github.com/codepilotrules/hub.git
cd hub
npm install
\`\`\`

## Configuration

Copy the environment variables:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in your Supabase credentials and other required environment variables.

## Running the Application

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Your application will be available at http://localhost:3000.

## Next Steps

- Read the [System Overview](/docs/system-overview) to understand the architecture
- Check out the [API Documentation](/docs/api-reference) for integration details
- Explore the [AI Concepts](/docs/agentic-ai) section to understand the AI features
`,
    excerpt: 'Quick start guide to get CodePilotRules Hub up and running in minutes.',
    icon: '🚀',
    status: 'published' as const,
    visibility: 'public' as const,
    content_type: 'rich_text' as const,
  },
  {
    title: 'System Overview',
    slug: 'system-overview',
    content: `# System Overview

CodePilotRules Hub is a comprehensive platform for AI-assisted development rules and guidelines.

## Architecture

The system consists of several key components:

### Frontend
- **Next.js 14** with App Router
- **React 18** with Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** for data storage
- **Row Level Security** for data protection

### AI Integration
- **OpenAI API** for content generation
- **Vector embeddings** for semantic search
- **Custom agents** for automated workflows

## Key Features

- 📝 **Rich Documentation**: Create and edit documentation with a Notion-like editor
- 🤖 **AI Agents**: Automated rule generation and code analysis
- 🔍 **Semantic Search**: Find content using natural language queries
- 👥 **Collaboration**: Real-time editing and commenting
- 🛡️ **Security**: Role-based access control and data protection

## Database Schema

The system uses a PostgreSQL database with the following main tables:

- \`rules\` - Core rule definitions
- \`categories\` - Rule categorization
- \`documentation_pages\` - Rich documentation content
- \`profiles\` - User management
- \`collections\` - User-curated rule sets
`,
    excerpt: 'Comprehensive overview of the CodePilotRules Hub architecture and features.',
    icon: '🏗️',
    status: 'published' as const,
    visibility: 'public' as const,
    content_type: 'rich_text' as const,
  },
  {
    title: 'Agentic AI Concepts',
    slug: 'agentic-ai',
    content: `# Agentic AI Concepts

Learn about the AI-powered features that make CodePilotRules Hub intelligent and adaptive.

## What is Agentic AI?

Agentic AI refers to AI systems that can:
- **Plan** and execute complex tasks autonomously
- **Adapt** to changing requirements and contexts
- **Collaborate** with other agents and humans
- **Learn** from interactions and feedback

## Core Concepts

### 1. Sequential Thinking
Our AI agents use a structured thinking process that mirrors human problem-solving:

1. **Problem Analysis** - Understanding the context and requirements
2. **Strategy Formation** - Planning the approach and steps
3. **Execution** - Implementing the solution step by step
4. **Reflection** - Evaluating results and learning

### 2. Memory Management
Agents maintain both short-term and long-term memory:

- **Working Memory** - Current context and active tasks
- **Episodic Memory** - Past interactions and experiences
- **Semantic Memory** - Knowledge about rules, patterns, and best practices

### 3. Multi-Agent Coordination
Multiple specialized agents work together:

- **Code Analysis Agent** - Reviews and analyzes codebases
- **Rule Generation Agent** - Creates new rules based on patterns
- **Documentation Agent** - Maintains and updates documentation
- **Quality Assurance Agent** - Validates and tests generated content

## Implementation

Our agentic AI system is built on:

- **Function Calling** - Structured tool usage
- **Chain of Thought** - Transparent reasoning
- **Tool Integration** - Access to external APIs and databases
- **Feedback Loops** - Continuous improvement based on user input

## Use Cases

### Code Review
Agents analyze pull requests and suggest improvements based on established rules.

### Rule Mining
Agents scan codebases to identify patterns and suggest new rules.

### Documentation Generation
Agents automatically create and update documentation based on code changes.

### Quality Monitoring
Agents continuously monitor rule compliance and code quality metrics.
`,
    excerpt: 'Deep dive into the AI agent concepts powering CodePilotRules Hub.',
    icon: '🤖',
    status: 'published' as const,
    visibility: 'public' as const,
    content_type: 'rich_text' as const,
  },
  {
    title: 'API Reference',
    slug: 'api-reference',
    content: `# API Reference

Complete reference for the CodePilotRules Hub REST API.

## Authentication

All API requests require authentication using a Bearer token:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://api.codepilotrules.dev/v1/rules
\`\`\`

## Base URL

\`\`\`
https://api.codepilotrules.dev/v1
\`\`\`

## Rules API

### List Rules

\`\`\`http
GET /rules
\`\`\`

**Parameters:**
- \`category\` (string, optional) - Filter by category
- \`language\` (string, optional) - Filter by programming language
- \`limit\` (integer, optional) - Number of results (default: 20)
- \`offset\` (integer, optional) - Pagination offset (default: 0)

**Response:**
\`\`\`json
{
  "rules": [
    {
      "id": "rule-123",
      "title": "Use meaningful variable names",
      "description": "Variables should have descriptive names...",
      "category": "naming",
      "language": "javascript",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
\`\`\`

### Get Rule

\`\`\`http
GET /rules/:id
\`\`\`

### Create Rule

\`\`\`http
POST /rules
\`\`\`

**Body:**
\`\`\`json
{
  "title": "Rule title",
  "description": "Rule description",
  "category": "category-id",
  "language": "javascript",
  "rule_type": "style",
  "severity": "warning",
  "tags": ["readability", "best-practice"]
}
\`\`\`

## Documentation API

### List Pages

\`\`\`http
GET /docs
\`\`\`

### Get Page

\`\`\`http
GET /docs/:slug
\`\`\`

### Create Page

\`\`\`http
POST /docs
\`\`\`

### Update Page

\`\`\`http
PUT /docs/:id
\`\`\`

### Delete Page

\`\`\`http
DELETE /docs/:id
\`\`\`

## Error Handling

All API endpoints return consistent error responses:

\`\`\`json
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "validation error details"
  }
}
\`\`\`

## Rate Limiting

API requests are limited to 1000 requests per hour per API key.

Rate limit headers are included in responses:
- \`X-RateLimit-Limit\` - Request limit
- \`X-RateLimit-Remaining\` - Requests remaining
- \`X-RateLimit-Reset\` - Reset time (Unix timestamp)
`,
    excerpt: 'Complete REST API reference with examples and authentication details.',
    icon: '📡',
    status: 'published' as const,
    visibility: 'public' as const,
    content_type: 'rich_text' as const,
  }
];

async function seedDocumentation() {
  console.log('🌱 Seeding documentation...');
  
  try {
    for (const pageData of samplePages) {
      console.log(`Creating page: ${pageData.title}`);
      
      const page = await documentationServiceServer.createPage({
        ...pageData,
      });
      
      console.log(`✅ Created page: ${page.title} (${page.id})`);
    }
    
    // Create some tags
    console.log('Creating tags...');
    const tags = [
      { name: 'Getting Started', description: 'Basic setup and configuration', color: '#10B981' },
      { name: 'Architecture', description: 'System design and structure', color: '#3B82F6' },
      { name: 'AI', description: 'Artificial intelligence features', color: '#8B5CF6' },
      { name: 'API', description: 'Application programming interface', color: '#F59E0B' },
    ];
    
    for (const tagData of tags) {
      const tag = await documentationServiceServer.createTag(
        tagData.name,
        tagData.description,
        tagData.color
      );
      console.log(`✅ Created tag: ${tag.name}`);
    }
    
    console.log('🎉 Documentation seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding documentation:', error);
    process.exit(1);
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDocumentation();
}

export { seedDocumentation }; 