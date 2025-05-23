import { documentationServiceServer } from '@/lib/services/documentation-service-server';
import type { CreateDocumentationPageRequest } from '@/types/documentation';

const basicDocs: CreateDocumentationPageRequest[] = [
  {
    title: 'Getting Started with CodePilotRules Hub',
    slug: 'getting-started',
    excerpt: 'Learn how to set up and start using CodePilotRules Hub for your AI-powered development workflow.',
    icon: '🚀',
    content: `# Getting Started with CodePilotRules Hub

Welcome to CodePilotRules Hub - your comprehensive platform for managing AI coding rules, documentation, and agentic development workflows.

## What is CodePilotRules Hub?

CodePilotRules Hub is a centralized platform that helps developers:

- **Manage AI Coding Rules**: Create, organize, and share coding rules for AI assistants
- **Document Knowledge**: Build comprehensive documentation for your projects and teams
- **Collaborate**: Work together on rules and documentation with your team
- **Sync with GitHub**: Keep your rules and docs in sync with your repositories

## Quick Setup

### 1. Authentication
- Sign up with your GitHub account for seamless integration
- Configure your profile and team settings

### 2. Create Your First Rule
- Navigate to the Rules section
- Click "Create New Rule" 
- Choose a category and define your coding standards
- Save and share with your team

### 3. Set Up Documentation
- Access the Documentation section
- Create your first doc page with our rich editor
- Organize content with tags and categories
- Collaborate with comments and reviews

### 4. GitHub Integration
- Connect your repositories
- Sync rules and documentation automatically
- Set up webhooks for real-time updates

## Key Features

- **Rich Text Editor**: Create beautiful documentation with markdown and rich formatting
- **Rule Management**: Organize coding rules by language, framework, and project type
- **Team Collaboration**: Share knowledge and maintain consistency across your team
- **Version Control**: Track changes and maintain history of your rules and docs
- **Search & Discovery**: Find relevant rules and documentation quickly

## Next Steps

1. [Explore the Rules System](/docs/rules-system)
2. [Learn About Documentation Features](/docs/documentation-features)
3. [Set Up GitHub Integration](/docs/github-integration)
4. [Team Management Guide](/docs/team-management)

Ready to get started? Jump into creating your first rule or documentation page!`,
    content_type: 'rich_text',
    visibility: 'public',
    status: 'published',
    tag_ids: [],
    metadata: {
      difficulty: 'beginner',
      estimated_time: '10 minutes'
    }
  },
  {
    title: 'Rules System Overview',
    slug: 'rules-system',
    excerpt: 'Understanding how to create, organize, and manage AI coding rules in CodePilotRules Hub.',
    icon: '📋',
    content: `# Rules System Overview

The Rules System is the core feature of CodePilotRules Hub, designed to help you create, manage, and share coding standards for AI assistants.

## Understanding Rules

### What are AI Coding Rules?
AI coding rules are structured guidelines that help AI assistants:
- Follow consistent coding patterns
- Adhere to project-specific conventions
- Apply best practices automatically
- Maintain code quality standards

### Rule Categories

**Language-Specific Rules**
- JavaScript/TypeScript patterns
- Python conventions
- React component guidelines
- API design standards

**Framework Rules**
- Next.js project structure
- Express.js patterns
- Database schemas
- Testing approaches

**Project Rules**
- File organization
- Naming conventions
- Documentation standards
- Git workflow patterns

## Creating Rules

### Basic Rule Structure
\\\`\\\`\\\`typescript
{
  title: "React Component Naming",
  category: "react",
  description: "Guidelines for naming React components",
  content: "Use PascalCase for component names...",
  tags: ["react", "naming", "components"],
  priority: "high"
}
\\\`\\\`\\\`

### Rule Templates
Choose from pre-built templates:
- **Component Guidelines**: For UI component standards
- **API Patterns**: For backend development rules
- **Testing Standards**: For test writing conventions
- **Documentation Rules**: For code documentation

## Organizing Rules

### Categories & Subcategories
- **Languages**: JavaScript, Python, TypeScript
- **Frameworks**: React, Next.js, Express
- **Tools**: ESLint, Prettier, Jest
- **Patterns**: MVC, Repository, Factory

### Tagging System
Use tags to cross-reference rules:
- Technology tags: react, typescript, nextjs
- Difficulty tags: beginner, intermediate, advanced
- Type tags: pattern, convention, best-practice

### Priority Levels
- **Critical**: Must-follow rules for code safety
- **High**: Important for consistency
- **Medium**: Recommended practices
- **Low**: Style preferences

## Rule Application

### In AI Assistants
Rules can be applied in:
- Code generation prompts
- Code review processes
- Documentation generation
- Refactoring suggestions

### Team Adoption
- Share rules across team members
- Create team-specific rule sets
- Track rule usage and effectiveness
- Gather feedback and iterate

## Best Practices

1. **Start Small**: Begin with essential rules for your most common patterns
2. **Be Specific**: Include clear examples and counterexamples
3. **Keep Updated**: Regularly review and update rules as your codebase evolves
4. **Get Team Buy-in**: Involve your team in rule creation and refinement
5. **Test Rules**: Apply rules to real code and gather feedback

## Advanced Features

### Rule Inheritance
- Base rules for general patterns
- Specific overrides for special cases
- Project-level customizations

### Automation
- Auto-apply rules in CI/CD
- Integration with code formatters
- Real-time rule validation

### Analytics
- Track rule usage
- Measure code quality impact
- Identify frequently violated rules

Ready to create your first rule? Visit the [Rules section](/rules) to get started!`,
    content_type: 'rich_text',
    visibility: 'public',
    status: 'published',
    tag_ids: [],
    metadata: {
      difficulty: 'intermediate',
      estimated_time: '15 minutes'
    }
  },
  {
    title: 'Documentation Features',
    slug: 'documentation-features',
    excerpt: 'Comprehensive guide to creating and managing documentation in CodePilotRules Hub.',
    icon: '📖',
    content: `
# Documentation Features

CodePilotRules Hub provides a powerful documentation system designed for technical teams and AI-powered development workflows.

## Rich Text Editor

### Markdown Support
- Full markdown syntax support
- Code highlighting with syntax detection
- Table creation and formatting
- Link management and validation

### Advanced Features
- **Live Preview**: See changes in real-time
- **Collaborative Editing**: Multiple users can edit simultaneously
- **Version History**: Track all changes with full revision history
- **Auto-save**: Never lose your work with automatic saving

### Code Blocks
\`\`\`javascript
// Example code block with syntax highlighting
function createRule(title, content) {
  return {
    title,
    content,
    createdAt: new Date(),
    status: 'draft'
  };
}
\`\`\`

## Organization Features

### Hierarchical Structure
- **Parent-Child Relationships**: Organize docs in logical hierarchies
- **Breadcrumb Navigation**: Easy navigation through document trees
- **Auto-generated Tables of Contents**: Based on document headings

### Categorization
- **Custom Categories**: Create categories that match your project structure
- **Tagging System**: Cross-reference content with flexible tags
- **Search & Filter**: Find content quickly with advanced search

### Visibility Controls
- **Public**: Accessible to everyone
- **Team**: Restricted to team members only
- **Private**: Personal documentation

## Collaboration Tools

### Comments & Reviews
- **Inline Comments**: Comment on specific sections
- **Review Workflows**: Assign reviewers and track approval status
- **Discussion Threads**: Have conversations about content changes

### Team Features
- **Author Attribution**: Track who created and modified content
- **Edit Permissions**: Control who can modify documentation
- **Activity Feed**: See recent changes and team activity

## Content Types

### Documentation Pages
Standard documentation with full editing capabilities:
- Project guides and tutorials
- API documentation
- Technical specifications
- Process documentation

### Knowledge Base Articles
Structured content for common questions:
- FAQ sections
- Troubleshooting guides
- How-to articles
- Best practices

### Templates
Reusable document structures:
- API endpoint documentation
- Feature specification templates
- Meeting notes templates
- Project setup guides

## Integration Features

### GitHub Sync
- **Automatic Sync**: Keep docs in sync with repository changes
- **Webhook Integration**: Real-time updates from GitHub
- **File Mapping**: Link documentation to specific code files

### API Access
- **REST API**: Programmatic access to all documentation
- **Webhook Support**: Integrate with external tools
- **Export Options**: Export to various formats (PDF, HTML, Markdown)

## Advanced Capabilities

### Analytics & Insights
- **View Tracking**: See which docs are most accessed
- **Search Analytics**: Understand what users are looking for
- **Collaboration Metrics**: Track team engagement

### AI-Powered Features
- **Content Suggestions**: AI-generated content recommendations
- **Auto-categorization**: Automatic tagging and categorization
- **Quality Scoring**: Assess documentation completeness

### Performance Features
- **Fast Search**: Full-text search across all content
- **Caching**: Optimized loading for large documentation sets
- **Mobile Responsive**: Perfect viewing on all devices

## Getting Started

1. **Create Your First Doc**: Use the "New Document" button to start
2. **Choose a Template**: Select from pre-built templates or start blank
3. **Add Content**: Use the rich editor to create your documentation
4. **Organize**: Add tags, set categories, and link related content
5. **Share**: Publish and share with your team

## Best Practices

### Writing Guidelines
- **Clear Headings**: Use descriptive, hierarchical headings
- **Code Examples**: Include practical, working examples
- **Regular Updates**: Keep documentation current with code changes
- **User-Focused**: Write from the reader's perspective

### Organization Tips
- **Logical Structure**: Group related content together
- **Consistent Naming**: Use clear, consistent naming conventions
- **Cross-Linking**: Link related documents for better discoverability
- **Regular Audits**: Review and update documentation regularly

Ready to start documenting? Create your first page in the [Documentation section](/docs)!
    `,
    content_type: 'rich_text',
    visibility: 'public',
    status: 'published',
    tag_ids: [],
    metadata: {
      difficulty: 'beginner',
      estimated_time: '20 minutes'
    }
  },
  {
    title: 'GitHub Integration Setup',
    slug: 'github-integration',
    excerpt: 'Step-by-step guide to connecting your GitHub repositories with CodePilotRules Hub.',
    icon: '🔗',
    content: `
# GitHub Integration Setup

Connect your GitHub repositories with CodePilotRules Hub to automatically sync rules, documentation, and maintain consistency across your development workflow.

## Overview

The GitHub integration provides:
- **Automatic Sync**: Keep rules and docs in sync with repository changes
- **Webhook Support**: Real-time updates when files change
- **File Mapping**: Link documentation to specific code files
- **Version Control**: Track changes across both platforms

## Prerequisites

Before setting up the integration:
- Admin access to your GitHub repository
- CodePilotRules Hub account with appropriate permissions
- GitHub App permissions configured

## Setup Process

### Step 1: Connect GitHub Account
1. Navigate to **Settings** → **Integrations**
2. Click **Connect GitHub Account**
3. Authorize CodePilotRules Hub to access your repositories
4. Select repositories you want to sync

### Step 2: Configure Repository Settings
\`\`\`yaml
# .codepilotrules/config.yml
version: 1
sync:
  rules:
    enabled: true
    directory: ".codepilotrules/rules"
    auto_sync: true
  documentation:
    enabled: true
    directory: "docs"
    formats: ["md", "mdx"]
webhooks:
  enabled: true
  events: ["push", "pull_request"]
\`\`\`

### Step 3: Set Up Webhooks
1. In repository settings, go to **Webhooks**
2. Add webhook URL: \`https://api.codepilotrules-hub.com/webhooks/github\`
3. Select events: **Push**, **Pull requests**, **Issues**
4. Set content type to **application/json**

### Step 4: Initial Sync
Run the initial sync to import existing content:
\`\`\`bash
# Using GitHub Actions
name: Sync with CodePilotRules Hub
on:
  push:
    branches: [main]
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: codepilotrules-hub/sync-action@v1
        with:
          api-key: \${{ secrets.CODEPILOTRULES_API_KEY }}
\`\`\`

## Sync Configuration

### Rules Synchronization
**Directory Structure**:
\`\`\`
.codepilotrules/
├── rules/
│   ├── javascript/
│   │   ├── naming-conventions.md
│   │   └── error-handling.md
│   ├── react/
│   │   ├── component-structure.md
│   │   └── hooks-usage.md
│   └── general/
│       └── code-style.md
├── templates/
│   ├── component-template.md
│   └── api-template.md
└── config.yml
\`\`\`

**Rule File Format**:
\`\`\`markdown
---
title: "React Component Naming"
category: "react"
tags: ["naming", "components", "conventions"]
priority: "high"
author: "team@company.com"
updated: "2024-01-15"
---

# React Component Naming Conventions

## Overview
All React components should use PascalCase naming...

## Examples
\`\`\`typescript
// ✅ Good
const UserProfile = () => { ... };
const NavigationBar = () => { ... };

// ❌ Bad
const userProfile = () => { ... };
const navigation_bar = () => { ... };
\`\`\`

## Exceptions
- Higher-order components should use camelCase...
\`\`\`

### Documentation Synchronization
**Supported Formats**:
- Markdown (.md)
- MDX (.mdx)
- Plain text (.txt)

**Auto-sync Features**:
- File creation/deletion tracking
- Content change detection
- Metadata preservation
- Link validation

## Workflow Integration

### Pull Request Integration
When creating pull requests:
1. **Rule Validation**: Check if code follows defined rules
2. **Documentation Updates**: Suggest doc updates for new features
3. **Consistency Checks**: Verify rule adherence across changes

### CI/CD Integration
\`\`\`yaml
# .github/workflows/rules-check.yml
name: Rules Compliance Check
on:
  pull_request:
    branches: [main]
jobs:
  check-rules:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Check Rules Compliance
        uses: codepilotrules-hub/compliance-check@v1
        with:
          rules-config: '.codepilotrules/config.yml'
          api-key: \${{ secrets.CODEPILOTRULES_API_KEY }}
\`\`\`

## Advanced Features

### Bidirectional Sync
- Changes in CodePilotRules Hub update GitHub files
- GitHub file changes update CodePilotRules Hub content
- Conflict resolution for simultaneous edits

### Branch Management
- Sync rules per branch
- Environment-specific configurations
- Feature branch rule validation

### Team Collaboration
- **Code Reviews**: Include rule compliance in review process
- **Notifications**: Get alerts when rules are updated
- **Permissions**: Control who can modify synced content

## Troubleshooting

### Common Issues

**Sync Failures**:
- Check API key permissions
- Verify webhook configuration
- Review repository access rights

**File Conflicts**:
- Use merge strategies in config
- Set up conflict resolution rules
- Monitor sync logs for issues

**Performance Issues**:
- Limit sync frequency for large repositories
- Use selective sync for specific directories
- Optimize file watching patterns

### Debug Commands
\`\`\`bash
# Check sync status
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.codepilotrules-hub.com/sync/status/REPO_ID

# Force sync
curl -X POST -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.codepilotrules-hub.com/sync/trigger/REPO_ID

# View sync logs
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.codepilotrules-hub.com/sync/logs/REPO_ID
\`\`\`

## Security Considerations

- **API Keys**: Store securely in GitHub Secrets
- **Permissions**: Use minimal required permissions
- **Access Control**: Review who has sync permissions
- **Audit Logs**: Monitor all sync activities

## Best Practices

1. **Start Small**: Begin with a single repository
2. **Test First**: Use a test repository for initial setup
3. **Document Changes**: Keep track of sync configuration changes
4. **Regular Reviews**: Periodically review sync logs and permissions
5. **Team Training**: Ensure team understands the sync workflow

Ready to connect your repositories? Visit the [Integrations page](/settings/integrations) to get started!
    `,
    content_type: 'rich_text',
    visibility: 'public',
    status: 'published',
    tag_ids: [],
    metadata: {
      difficulty: 'intermediate',
      estimated_time: '30 minutes'
    }
  },
  {
    title: 'API Reference',
    slug: 'api-reference',
    excerpt: 'Complete API documentation for integrating with CodePilotRules Hub programmatically.',
    icon: '🔧',
    content: `
# API Reference

The CodePilotRules Hub API provides programmatic access to all platform features including rules management, documentation, and team collaboration.

## Authentication

### API Key Authentication
Include your API key in the Authorization header:
\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.codepilotrules-hub.com/v1/rules
\`\`\`

### OAuth2 Flow
For applications requiring user-specific access:
\`\`\`javascript
// Step 1: Redirect to authorization
window.location.href = 'https://api.codepilotrules-hub.com/oauth/authorize?' +
  'client_id=YOUR_CLIENT_ID&' +
  'redirect_uri=YOUR_REDIRECT_URI&' +
  'scope=rules:read,docs:write';

// Step 2: Exchange code for token
const response = await fetch('https://api.codepilotrules-hub.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    code: 'AUTHORIZATION_CODE'
  })
});
\`\`\`

## Rules API

### List Rules
\`\`\`http
GET /v1/rules
\`\`\`

**Parameters:**
- \`category\` (string): Filter by category
- \`tags\` (string[]): Filter by tags
- \`limit\` (number): Results per page (default: 20)
- \`offset\` (number): Pagination offset

**Response:**
\`\`\`json
{
  "rules": [
    {
      "id": "rule_123",
      "title": "React Component Naming",
      "category": "react",
      "content": "Use PascalCase for components...",
      "tags": ["react", "naming"],
      "priority": "high",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z",
      "author": {
        "id": "user_456",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "total_count": 150,
  "has_more": true
}
\`\`\`

### Get Rule
\`\`\`http
GET /v1/rules/{rule_id}
\`\`\`

### Create Rule
\`\`\`http
POST /v1/rules
Content-Type: application/json

{
  "title": "New Coding Rule",
  "category": "javascript",
  "content": "Rule content in markdown...",
  "tags": ["javascript", "best-practice"],
  "priority": "medium",
  "visibility": "team"
}
\`\`\`

### Update Rule
\`\`\`http
PUT /v1/rules/{rule_id}
Content-Type: application/json

{
  "title": "Updated Rule Title",
  "content": "Updated rule content...",
  "priority": "high"
}
\`\`\`

### Delete Rule
\`\`\`http
DELETE /v1/rules/{rule_id}
\`\`\`

## Documentation API

### List Documentation Pages
\`\`\`http
GET /v1/docs
\`\`\`

**Parameters:**
- \`query\` (string): Search query
- \`status\` (string): published, draft
- \`visibility\` (string): public, team, private
- \`author\` (string): Filter by author ID
- \`tags\` (string[]): Filter by tags

### Get Documentation Page
\`\`\`http
GET /v1/docs/{page_id}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "doc_789",
  "title": "Getting Started Guide",
  "slug": "getting-started",
  "content": "# Getting Started\\n\\nWelcome to...",
  "excerpt": "Quick start guide...",
  "status": "published",
  "visibility": "public",
  "view_count": 1250,
  "reading_time_minutes": 5,
  "created_at": "2024-01-10T09:00:00Z",
  "updated_at": "2024-01-15T14:30:00Z",
  "author": {
    "id": "user_456",
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "tags": [
    {
      "id": "tag_101",
      "name": "getting-started",
      "color": "#3B82F6"
    }
  ],
  "breadcrumbs": [
    {
      "id": "doc_001",
      "title": "Documentation",
      "slug": "docs"
    }
  ]
}
\`\`\`

### Create Documentation Page
\`\`\`http
POST /v1/docs
Content-Type: application/json

{
  "title": "New Documentation Page",
  "content": "# New Page\\n\\nContent here...",
  "excerpt": "Brief description...",
  "status": "draft",
  "visibility": "team",
  "tags": ["tutorial", "api"],
  "parent_id": "doc_parent_123"
}
\`\`\`

## Search API

### Global Search
\`\`\`http
GET /v1/search?q=react%20components&type=all
\`\`\`

**Parameters:**
- \`q\` (string, required): Search query
- \`type\` (string): all, rules, docs, comments
- \`limit\` (number): Results per page

**Response:**
\`\`\`json
{
  "results": [
    {
      "type": "rule",
      "id": "rule_123",
      "title": "React Component Naming",
      "excerpt": "Use PascalCase for component names...",
      "score": 0.95,
      "url": "/rules/react/rule_123"
    },
    {
      "type": "doc",
      "id": "doc_456",
      "title": "React Best Practices",
      "excerpt": "Comprehensive guide to React...",
      "score": 0.87,
      "url": "/docs/react-best-practices"
    }
  ],
  "total_count": 25,
  "took_ms": 45
}
\`\`\`

## Teams API

### List Team Members
\`\`\`http
GET /v1/teams/{team_id}/members
\`\`\`

### Add Team Member
\`\`\`http
POST /v1/teams/{team_id}/members
Content-Type: application/json

{
  "email": "newmember@example.com",
  "role": "member"
}
\`\`\`

## Webhooks

### Configure Webhooks
\`\`\`http
POST /v1/webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["rule.created", "doc.updated"],
  "secret": "webhook_secret_key"
}
\`\`\`

### Webhook Events
- \`rule.created\`: New rule created
- \`rule.updated\`: Rule modified
- \`rule.deleted\`: Rule removed
- \`doc.created\`: New documentation page
- \`doc.updated\`: Documentation modified
- \`doc.published\`: Documentation published

**Webhook Payload Example:**
\`\`\`json
{
  "event": "rule.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "rule": {
      "id": "rule_789",
      "title": "New TypeScript Rule",
      "category": "typescript"
    },
    "actor": {
      "id": "user_456",
      "name": "John Doe"
    }
  }
}
\`\`\`

## Rate Limiting

API requests are limited to:
- **Free tier**: 1,000 requests/hour
- **Pro tier**: 10,000 requests/hour
- **Enterprise**: Custom limits

Rate limit headers:
\`\`\`http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
\`\`\`

## Error Handling

### Error Response Format
\`\`\`json
{
  "error": {
    "code": "validation_error",
    "message": "Title is required",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  },
  "request_id": "req_abc123"
}
\`\`\`

### Common Error Codes
- \`400\`: Bad Request - Invalid parameters
- \`401\`: Unauthorized - Invalid API key
- \`403\`: Forbidden - Insufficient permissions
- \`404\`: Not Found - Resource doesn't exist
- \`429\`: Too Many Requests - Rate limit exceeded
- \`500\`: Internal Server Error - Server error

## SDKs and Libraries

### JavaScript/TypeScript
\`\`\`bash
npm install @codepilotrules-hub/sdk
\`\`\`

\`\`\`javascript
import { CodePilotRulesHub } from '@codepilotrules-hub/sdk';

const client = new CodePilotRulesHub({
  apiKey: 'your_api_key',
  baseURL: 'https://api.codepilotrules-hub.com/v1'
});

// Create a rule
const rule = await client.rules.create({
  title: 'My New Rule',
  category: 'javascript',
  content: 'Rule content...'
});

// Search documentation
const docs = await client.docs.search('getting started');
\`\`\`

### Python
\`\`\`bash
pip install codepilotrules-hub
\`\`\`

\`\`\`python
from codepilotrules_hub import Client

client = Client(api_key='your_api_key')

# List rules
rules = client.rules.list(category='react')

# Create documentation
doc = client.docs.create(
    title='New Guide',
    content='# Guide Content',
    status='published'
)
\`\`\`

## Examples

### Batch Import Rules
\`\`\`javascript
async function importRules(rulesData) {
  const results = [];
  
  for (const rule of rulesData) {
    try {
      const created = await client.rules.create(rule);
      results.push({ success: true, rule: created });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }
  
  return results;
}
\`\`\`

### Sync Documentation
\`\`\`javascript
async function syncWithGitHub(repoPath) {
  // Read markdown files from repository
  const files = await readMarkdownFiles(repoPath);
  
  for (const file of files) {
    const existing = await client.docs.search(file.title);
    
    if (existing.results.length > 0) {
      // Update existing
      await client.docs.update(existing.results[0].id, {
        content: file.content,
        updated_at: file.lastModified
      });
    } else {
      // Create new
      await client.docs.create({
        title: file.title,
        content: file.content,
        status: 'published'
      });
    }
  }
}
\`\`\`

Need help with the API? Contact our support team or visit our [API Support Forum](/support/api).
    `,
    content_type: 'rich_text',
    visibility: 'public',
    status: 'published',
    tag_ids: [],
    metadata: {
      difficulty: 'advanced',
      estimated_time: '45 minutes'
    }
  }
];

export async function populateBasicDocs() {
  console.log('Starting to populate basic documentation...');
  
  const results = [];
  
  for (const docData of basicDocs) {
    try {
      console.log(`Creating: ${docData.title}`);
      // Add author information - the service expects this internally
      const pageDataWithAuthor = {
        ...docData,
        author_id: 'system', // This will be added internally by the service
        last_edited_by: 'system'
      };
      
      const page = await documentationServiceServer.createPage(pageDataWithAuthor as any);
      results.push({ success: true, page });
      console.log(`✅ Created: ${page.title}`);
    } catch (error) {
      console.error(`❌ Failed to create ${docData.title}:`, error);
      results.push({ 
        success: false, 
        title: docData.title, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
  
  console.log('\nPopulation complete!');
  console.log(`Successfully created: ${results.filter(r => r.success).length} pages`);
  console.log(`Failed: ${results.filter(r => !r.success).length} pages`);
  
  return results;
}

// If running directly
if (require.main === module) {
  populateBasicDocs()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Failed to populate docs:', error);
      process.exit(1);
    });
} 