import { NextRequest, NextResponse } from 'next/server';
import { documentationServiceServer } from '@/lib/services/documentation-service-server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import type { CreateDocumentationPageRequest } from '@/types/documentation';

// Admin emails - replace with your actual admin logic
const adminEmails = ['admin@example.com', 'dominik@example.com', 'dominikos@myroomieapp.com'];

// Simple admin check - you can replace this with your actual admin logic
async function isAdmin(email: string): Promise<boolean> {
  return adminEmails.includes(email);
}

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
Create well-structured rules with examples and clear guidelines.

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

Ready to create your first rule? Visit the [Rules section](/rules) to get started!`,
    content_type: 'rich_text',
    visibility: 'public',
    status: 'published',
    tag_ids: [],
    metadata: {
      difficulty: 'intermediate',
      estimated_time: '15 minutes'
    }
  }
];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 401 }
      );
    }

    const userIsAdmin = await isAdmin(user.email);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('Starting to populate basic documentation...');
    const results = [];
    
    for (const docData of basicDocs) {
      try {
        console.log(`Creating: ${docData.title}`);
        
        // Check if page already exists
        const slug = docData.slug;
        if (slug) {
          const existingPage = await documentationServiceServer.getPage(slug);
          if (existingPage) {
            results.push({ 
              success: false, 
              title: docData.title, 
              error: 'Page already exists' 
            });
            continue;
          }
        }

        const pageDataWithAuthor = {
          ...docData,
          author_id: user.id,
          last_edited_by: user.id
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
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    return NextResponse.json({
      success: true,
      message: `Population complete! Successfully created: ${successCount} pages, Failed: ${failureCount} pages`,
      results
    });

  } catch (error) {
    console.error('Error populating documentation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to populate documentation' },
      { status: 500 }
    );
  }
} 