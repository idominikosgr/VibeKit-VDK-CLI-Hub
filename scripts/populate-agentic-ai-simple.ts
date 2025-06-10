#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAgenticAIPage() {
  try {
    console.log('🚀 Creating Agentic AI Development page...');

    // Get the existing profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    if (!profile) {
      throw new Error('No profile found in database');
    }

    const authorId = profile.id;

    // Check if page already exists
    const { data: existingPage } = await supabase
      .from('documentation_pages')
      .select('id')
      .eq('slug', 'agentic-ai-development')
      .maybeSingle();

    if (existingPage) {
      console.log('✅ Page already exists with ID:', existingPage.id);
      return existingPage.id;
    }

    const pageContent = `# Agentic AI Development Guide

## Introduction to Agentic AI

Agentic AI represents a paradigm shift in artificial intelligence development, where AI systems are designed to act autonomously, make decisions, and take actions in pursuit of goals. Unlike traditional reactive AI systems, agentic AI systems demonstrate agency, intentionality, and proactive behavior.

## Core Concepts

### What Makes AI "Agentic"?

**Autonomy**: The ability to operate independently without constant human intervention.

**Goal-Directed Behavior**: Systems that pursue specific objectives and adapt their strategies to achieve them.

**Environmental Interaction**: Capability to perceive, understand, and act within their environment.

**Learning and Adaptation**: Continuous improvement based on experience and feedback.

**Decision Making**: Ability to evaluate options and make choices based on available information.

## Key Components of Agentic AI Systems

### 1. Perception Layer
- **Environment Sensing**: Understanding the current state of the system and environment
- **Context Awareness**: Maintaining awareness of relevant context and history
- **Signal Processing**: Converting raw input into actionable information

### 2. Reasoning Engine
- **Planning**: Creating strategies to achieve goals
- **Problem Solving**: Breaking down complex problems into manageable steps
- **Causal Reasoning**: Understanding cause-and-effect relationships
- **Sequential Thinking**: Following logical sequences of actions

### 3. Action Layer
- **Tool Usage**: Leveraging available tools and capabilities
- **Execution**: Implementing planned actions
- **Monitoring**: Tracking the results of actions
- **Adaptation**: Adjusting behavior based on outcomes

### 4. Memory System
- **Short-term Memory**: Maintaining context for immediate tasks
- **Long-term Memory**: Storing patterns, experiences, and learned behaviors
- **Episodic Memory**: Remembering specific events and experiences
- **Semantic Memory**: Understanding concepts and relationships

## Development Architecture

### Agent Design Patterns

#### The Observe-Orient-Decide-Act (OODA) Loop
\`\`\`
Observe  → Orient   → Decide   → Act
   ↑                              ↓
   ←-------- Feedback Loop --------
\`\`\`

#### Multi-Agent Systems
- **Hierarchical Agents**: Parent-child relationships with delegation
- **Peer-to-Peer Agents**: Collaborative agents working together
- **Specialized Agents**: Domain-specific agents with unique capabilities

## Tool Integration and MCP Servers

### Model Context Protocol (MCP)
MCP serves as the foundation for tool integration in agentic AI systems:

#### Core MCP Capabilities
- **Standardized Tool Interface**: Consistent way to expose tools to AI agents
- **Dynamic Discovery**: Agents can discover available tools at runtime
- **Secure Communication**: Controlled access to external systems and resources
- **Extensible Architecture**: Easy addition of new capabilities

#### Common MCP Server Types
- **Filesystem MCP**: File operations and code management
- **Memory MCP**: Persistent storage for agent memory
- **Web MCP**: Internet access and API interactions
- **Database MCP**: Data storage and retrieval
- **Development MCP**: Code compilation, testing, and deployment

### Building Agentic Workflows

#### Tool Composition
\`\`\`typescript
// Example: Combining multiple tools for a complex task
async function improveCodeQuality(codeFilePath: string) {
  // 1. Read current code
  const code = await filesystemMCP.readFile(codeFilePath);
  
  // 2. Analyze for issues
  const analysis = await codeReviewMCP.analyze(code);
  
  // 3. Generate improvements
  const improvements = await codeGenerationMCP.improve(code, analysis);
  
  // 4. Apply changes
  await filesystemMCP.writeFile(codeFilePath, improvements.code);
  
  // 5. Run tests
  const testResults = await testingMCP.runTests(codeFilePath);
  
  // 6. Store results in memory
  await memoryMCP.store(\`improvement_\${Date.now()}\`, {
    file: codeFilePath,
    analysis,
    improvements,
    testResults
  });
}
\`\`\`

## Best Practices for Agentic AI Development

### Design Principles

#### Transparency and Explainability
- **Decision Logging**: Recording why decisions were made
- **Action Tracing**: Tracking the sequence of actions taken
- **Outcome Attribution**: Understanding what led to specific results

#### Safety and Reliability
- **Bounded Autonomy**: Setting clear limits on agent capabilities
- **Fail-Safe Mechanisms**: Ensuring graceful handling of errors
- **Human Oversight**: Maintaining appropriate human control
- **Rollback Capabilities**: Ability to undo actions when needed

## Vibe Coding Rules Hub Integration

### Using Rules in Agentic Systems

The Vibe Coding Rules Hub provides structured guidance for building agentic AI systems:

#### Rule Categories for Agents
- **Agent Behavior Rules**: How agents should interact and make decisions
- **Tool Usage Rules**: Best practices for using MCP servers and external tools
- **Safety Rules**: Constraints and safeguards for agent operations
- **Performance Rules**: Optimization guidelines for efficient agent operation

## Conclusion

Agentic AI represents the future of intelligent systems that can understand, reason, and act autonomously while remaining aligned with human goals and values. By combining structured rules, powerful tools through MCP, and thoughtful design, we can build AI systems that truly augment human capabilities and drive innovation forward.

The Vibe Coding Rules Hub serves as both a repository of knowledge and a practical platform for developing and deploying agentic AI systems in real-world development environments.`;

    // Create new page
    const { data: page, error: pageError } = await supabase
      .from('documentation_pages')
      .insert({
        title: 'Agentic AI Development Guide',
        slug: 'agentic-ai-development',
        content: pageContent,
        excerpt: 'Comprehensive guide to building autonomous AI systems that can reason, plan, and act independently while remaining aligned with human goals.',
        icon: '🤖',
        status: 'published',
        visibility: 'public',
        content_type: 'markdown',
        author_id: authorId,
        last_edited_by: authorId,
        path: '/docs/agentic-ai-development',
        order_index: 1
      })
      .select()
      .single();

    if (pageError) {
      console.error('Page creation error:', pageError);
      throw new Error(`Failed to create page: ${pageError.message}`);
    }

    console.log('✅ Successfully created Agentic AI Development page!');
    console.log(`📄 Page ID: ${page.id}`);
    console.log(`📄 Page Title: ${page.title}`);
    
    return page.id;

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

createAgenticAIPage(); 