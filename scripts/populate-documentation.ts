import { createServerSupabaseClient } from '../lib/supabase/server-client';

// Use server client for Node.js script
const getSupabaseClient = () => createServerSupabaseClient();

const documentationContent = [
  // Getting Started Section
  {
    title: 'Installation & Setup',
    slug: 'installation',
    parent_path: '/docs/getting-started',
    icon: '🚀',
    content: `# Installation & Setup

Welcome to CodePilotRules Hub! This guide will help you get the application running locally in just a few minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **pnpm** - Install with \`npm install -g pnpm\`
- **Git** - [Download](https://git-scm.com/)
- **Supabase CLI** - [Installation Guide](https://supabase.com/docs/guides/cli)

## Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/codepilotrules/codepilotrules-hub.git
cd codepilotrules-hub/codepilotrules-hub
\`\`\`

### 2. Install Dependencies

\`\`\`bash
pnpm install
\`\`\`

### 3. Set Up Environment Variables

Copy the environment template:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update \`.env.local\` with your configuration:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# GitHub Integration (Optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
\`\`\`

### 4. Initialize Database

Start Supabase locally:

\`\`\`bash
npx supabase start
\`\`\`

Reset and seed the database:

\`\`\`bash
npx supabase db reset
\`\`\`

### 5. Run the Application

\`\`\`bash
pnpm dev
\`\`\`

The application will be available at [http://localhost:3000](http://localhost:3000).

## Production Deployment

For production deployment, see our [Deployment Guide](/docs/getting-started/deployment).

## Next Steps

- [Basic Configuration](/docs/getting-started/configuration)
- [First Steps](/docs/getting-started/first-steps)
- [System Overview](/docs/app-architecture/system-overview)
`,
    tags: ['installation', 'setup', 'getting-started']
  },

  {
    title: 'System Overview',
    slug: 'system-overview',
    parent_path: '/docs/app-architecture',
    icon: '🏗️',
    content: `# System Overview

CodePilotRules Hub is a modern full-stack application built for AI-assisted development rule management and distribution.

## Architecture Principles

### 🎯 Design Philosophy

- **AI-First**: Built specifically for AI assistant integration
- **Rule-Based**: Everything centers around reusable development rules
- **Collaborative**: Multi-user workflows with real-time features
- **Extensible**: Modular architecture for easy customization

### 🏗️ Technology Stack

The application uses a modern technology stack:

**Frontend:**
- React 19 with Next.js 15
- Tailwind CSS for styling
- shadcn/ui components
- TypeScript for type safety

**Backend:**
- Next.js API Routes
- Server Actions
- Middleware for authentication

**Database:**
- Supabase PostgreSQL
- Real-time subscriptions
- Row Level Security (RLS)

**Services:**
- GitHub synchronization
- Authentication with OAuth
- File storage and management

## Core Components

### 📊 Data Layer

The application uses Supabase PostgreSQL with the following core entities:

- **Rules**: Core content with metadata and versioning
- **Categories**: Hierarchical organization system
- **Users**: Authentication and profile management
- **Collections**: User-curated rule sets
- **Documentation**: Notion-like wiki system

### 🔄 Business Logic

#### Rule Management
- Automatic GitHub synchronization
- Version control and history
- Compatibility matrices
- Download tracking

#### User Experience
- Setup wizard for rule generation
- Real-time collaborative editing
- Advanced search and filtering
- Collection management

#### Administrative Tools
- Content management dashboard
- Analytics and monitoring
- User management
- System configuration

## Data Flow

### 1. Rule Synchronization

GitHub Repository → Sync Service → Database → Cache → API → UI

### 2. User Interactions

User Action → Client → API Route → Service Layer → Database → Real-time Update

### 3. Content Generation

Wizard Input → Rule Matching → Template Engine → Package Generation → Download

## Security Model

### Authentication
- Supabase Auth with OAuth providers
- JWT-based session management
- Role-based access control

### Authorization
- Row Level Security (RLS) policies
- Admin-only functions
- Content visibility controls

### Data Protection
- Input sanitization
- SQL injection prevention
- XSS protection

## Performance Characteristics

### Optimization Strategies
- **Database**: Optimized indexes and queries
- **Caching**: Strategic cache layers
- **CDN**: Static asset delivery
- **Real-time**: Efficient subscription management

### Scalability Patterns
- Horizontal database scaling
- Serverless function deployment
- Edge computing capabilities
- Progressive loading strategies

## Development Workflow

### Local Development
1. Feature branch creation
2. Local development with hot reload
3. Automated testing
4. Pull request review

### Deployment Pipeline
1. Staging deployment
2. Integration testing
3. Production deployment
4. Monitoring and rollback

For detailed implementation guides, see:
- [Database Schema](/docs/app-architecture/database-schema)
- [API Design](/docs/app-architecture/api-design)
- [Component Structure](/docs/app-architecture/component-structure)
`,
    tags: ['architecture', 'overview', 'system-design']
  },

  {
    title: 'Introduction to Agentic AI',
    slug: 'agentic-ai-intro',
    parent_path: '/docs/agentic-ai',
    icon: '🤖',
    content: `# Introduction to Agentic AI

Agentic AI represents a paradigm shift from traditional reactive AI systems to proactive, goal-oriented agents that can reason, plan, and act autonomously.

## What is Agentic AI?

### 🎯 Definition

**Agentic AI** refers to artificial intelligence systems that exhibit agency—the ability to act independently to achieve goals, make decisions, and adapt to changing circumstances.

### 🔑 Key Characteristics

1. **Autonomy**: Operates independently with minimal human intervention
2. **Goal-Oriented**: Works toward specific objectives
3. **Adaptive**: Learns and adjusts strategies based on outcomes
4. **Proactive**: Initiates actions rather than just responding
5. **Context-Aware**: Understands and leverages situational context

## Core Components

### 🧠 Reasoning Engine

The reasoning engine enables agents to:

- Analyze current context and situations
- Plan sequences of actions to achieve goals
- Make decisions between multiple options
- Reflect on outcomes and learn from experience

### 📚 Knowledge Base

Agents maintain dynamic knowledge representations:

- Facts about the world and domain
- Rules for reasoning and decision-making
- Relationships between entities and concepts
- Experiences and learned patterns

### 🎯 Goal Management

Sophisticated goal hierarchies and prioritization:

- Primary goals and sub-goals
- Dynamic priority adjustment
- Goal decomposition strategies
- Progress evaluation metrics

## Agent Types

### 1. Reactive Agents

- Respond to immediate stimuli
- Rule-based behavior
- Fast execution
- Limited reasoning capabilities

**Use Cases:**
- Simple automation tasks
- Real-time response systems
- Basic filtering and routing

### 2. Deliberative Agents

- Plan before acting
- Model-based reasoning
- Strategic thinking
- Higher computational cost

**Use Cases:**
- Complex problem solving
- Strategic planning
- Research and analysis

### 3. Hybrid Agents

- Combine reactive and deliberative approaches
- Multi-layered architecture
- Balanced performance
- Real-world applicability

**Use Cases:**
- Production AI systems
- Autonomous vehicles
- Intelligent assistants

## Implementation Patterns

### 📋 Belief-Desire-Intention (BDI)

A popular architecture for intelligent agents:

- **Beliefs**: What the agent knows about the world
- **Desires**: What the agent wants to achieve
- **Intentions**: What the agent plans to do

This model provides a structured approach to agent reasoning and decision-making.

### 🔄 OODA Loop (Observe-Orient-Decide-Act)

A decision-making framework:

1. **Observe**: Gather information from environment
2. **Orient**: Analyze and synthesize information
3. **Decide**: Determine best course of action
4. **Act**: Execute the chosen action

## Communication Patterns

### 🗣️ Agent Communication Language (ACL)

Standardized communication between agents:

- **Performatives**: Types of speech acts (inform, request, propose)
- **Content**: The actual message content
- **Ontology**: Shared vocabulary and concepts

### 🤝 Negotiation Protocols

Structured interaction patterns:

- Proposal and counter-proposal cycles
- Auction-based resource allocation
- Consensus building mechanisms

## Applications in Development

### 🔨 Code Generation Agents

- Analyze requirements and specifications
- Generate implementation code
- Test and validate generated code
- Refactor and optimize existing code

### 📚 Documentation Agents

- Extract knowledge from codebases
- Generate explanations and tutorials
- Maintain documentation consistency
- Update documentation with code changes

### 🧪 Testing Agents

- Design comprehensive test cases
- Execute automated test suites
- Analyze failure patterns
- Suggest improvements and fixes

## Best Practices

### 🎯 Design Principles

1. **Clear Goals**: Define specific, measurable objectives
2. **Bounded Autonomy**: Set appropriate limits on agent actions
3. **Transparent Reasoning**: Make decision processes auditable
4. **Graceful Degradation**: Handle failures elegantly
5. **Human Oversight**: Maintain appropriate human control

### 🛡️ Safety Considerations

- Input validation and sanitization
- Output filtering and verification
- Rate limiting and resource management
- Audit trails and comprehensive logging
- Emergency stop mechanisms

### 📊 Monitoring and Evaluation

Key metrics for agent performance:

- Goal achievement rate
- Average response time
- Resource utilization efficiency
- Error rate and recovery
- User satisfaction scores

## Getting Started

To begin working with agentic AI in your projects:

1. **Start Simple**: Begin with reactive agents for basic tasks
2. **Define Clear Goals**: Establish measurable objectives
3. **Implement Monitoring**: Track performance and behavior
4. **Iterate and Improve**: Refine based on real-world feedback
5. **Scale Gradually**: Add complexity as needed

## Next Steps

- [Agent Communication Patterns](/docs/agentic-ai/agent-communication)
- [Multi-Agent Systems](/docs/agentic-ai/multi-agent-systems)
- [Agent Memory Management](/docs/agentic-ai/agent-memory)

## Further Reading

- **Books**: "Artificial Intelligence: A Modern Approach" by Russell & Norvig
- **Papers**: "BDI Agents: From Theory to Practice" by Rao & Georgeff
- **Resources**: Online courses and tutorials on agent-oriented programming
`,
    tags: ['agentic-ai', 'agents', 'artificial-intelligence', 'introduction']
  },

  {
    title: 'Sequential Reasoning Patterns',
    slug: 'sequential-reasoning',
    parent_path: '/docs/sequential-thinking',
    icon: '🧩',
    content: `# Sequential Reasoning Patterns

Sequential reasoning is a fundamental cognitive process where complex problems are broken down into logical steps, enabling systematic problem-solving and decision-making.

## Understanding Sequential Reasoning

### 🎯 Core Concepts

**Sequential Reasoning** involves:
- Breaking complex problems into manageable steps
- Building understanding progressively
- Maintaining context across reasoning chains
- Adapting strategies based on intermediate results

### 🧠 Cognitive Framework

Sequential reasoning follows a structured approach:

1. **Problem Analysis**: Understanding the scope and requirements
2. **Step Generation**: Creating logical progression of thoughts
3. **Context Maintenance**: Keeping track of previous reasoning
4. **Strategy Adaptation**: Adjusting approach based on results
5. **Solution Synthesis**: Combining insights into final answer

## Implementation Architecture

### 🏗️ Sequential Thinking Engine

A systematic approach to complex problem solving:

**Core Components:**
- Step generation and tracking
- Context management
- Strategy selection
- Progress evaluation
- Solution synthesis

**Key Features:**
- Dynamic step adjustment
- Confidence assessment
- Dependency tracking
- Revision capabilities

### 🔄 Dynamic Strategy Selection

Different reasoning strategies for different problem types:

**Analysis Strategy**: Breaking down complex problems
**Synthesis Strategy**: Combining information from multiple sources
**Evaluation Strategy**: Assessing options and alternatives
**Inference Strategy**: Drawing logical conclusions
**Validation Strategy**: Checking reasoning quality

## Reasoning Patterns

### 1. 🎯 Deductive Reasoning

Moving from general principles to specific conclusions:

**Process:**
1. Establish major premise (general principle)
2. Apply minor premise (specific case)
3. Draw logical conclusion

**Example:**
- Major Premise: All mammals are warm-blooded
- Minor Premise: Dolphins are mammals
- Conclusion: Dolphins are warm-blooded

### 2. 🔍 Inductive Reasoning

Moving from specific observations to general patterns:

**Process:**
1. Collect specific observations
2. Identify recurring patterns
3. Formulate general hypothesis
4. Validate against new evidence

**Example:**
- Observations: Multiple successful AI implementations
- Pattern: Common architectural elements
- Hypothesis: Certain patterns lead to success

### 3. 🔄 Abductive Reasoning

Finding the best explanation for observations:

**Process:**
1. Identify puzzling phenomena
2. Generate possible explanations
3. Evaluate explanation quality
4. Select most plausible explanation

**Example:**
- Observation: System performance degradation
- Explanations: Hardware failure, software bug, network issues
- Best Explanation: Based on available evidence

## Advanced Patterns

### 🌳 Tree-of-Thought Reasoning

Exploring multiple reasoning paths simultaneously:

**Benefits:**
- Parallel exploration of alternatives
- Better coverage of solution space
- Improved quality through comparison
- Recovery from dead-end paths

**Implementation:**
- Generate multiple thought branches
- Evaluate each branch independently
- Prune low-quality paths
- Combine insights from best paths

### 🔄 Self-Reflective Reasoning

Continuous improvement through self-evaluation:

**Process:**
1. Generate initial reasoning
2. Reflect on reasoning quality
3. Identify weaknesses and gaps
4. Refine and improve reasoning
5. Iterate until satisfactory

**Benefits:**
- Higher quality solutions
- Learning from mistakes
- Improved reasoning strategies
- Better meta-cognitive awareness

## Practical Applications

### 💻 Code Problem Solving

**Application Steps:**
1. **Understand Requirements**: Analyze problem specifications
2. **Break Down Components**: Identify sub-problems
3. **Design Architecture**: Plan solution structure
4. **Implement Core Logic**: Build main functionality
5. **Add Error Handling**: Ensure robustness
6. **Optimize and Refine**: Improve performance

**Example Process:**
- Problem: Build a user authentication system
- Step 1: Identify security requirements
- Step 2: Choose authentication method
- Step 3: Design database schema
- Step 4: Implement core auth logic
- Step 5: Add session management
- Step 6: Test and optimize

### 🎯 Strategic Decision Making

**Multi-step Analysis:**
1. **Situation Analysis**: Understand current context
2. **Stakeholder Analysis**: Identify affected parties
3. **Options Generation**: Brainstorm alternatives
4. **Impact Assessment**: Evaluate consequences
5. **Risk Analysis**: Identify potential problems
6. **Recommendation Synthesis**: Combine insights

## Integration Patterns

### 🔗 Chain Integration

Building connected reasoning sequences:

- **Sequential Chains**: Linear progression of steps
- **Parallel Chains**: Multiple simultaneous reasoning paths
- **Hierarchical Chains**: Nested sub-reasoning within steps
- **Iterative Chains**: Cyclical refinement processes

### 🔄 Feedback Loops

Incorporating learning and improvement:

- **Performance Feedback**: Quality assessment
- **Outcome Feedback**: Real-world results
- **Process Feedback**: Reasoning effectiveness
- **Strategy Feedback**: Method appropriateness

## Performance Optimization

### ⚡ Parallel Reasoning

Processing multiple reasoning paths simultaneously:

**Benefits:**
- Faster problem solving
- Better solution coverage
- Redundancy for reliability
- Comparative evaluation

### 💾 Reasoning Cache

Storing and reusing reasoning patterns:

**Components:**
- Pattern recognition
- Solution templates
- Context matching
- Result caching

**Benefits:**
- Faster resolution of similar problems
- Consistency across reasoning instances
- Learning from previous experiences
- Reduced computational overhead

## Best Practices

### 🎯 Effective Sequential Reasoning

1. **Clear Problem Definition**: Start with well-defined objectives
2. **Logical Step Progression**: Ensure each step builds on previous ones
3. **Context Preservation**: Maintain relevant information throughout
4. **Quality Checkpoints**: Regularly evaluate reasoning quality
5. **Flexible Adaptation**: Adjust strategy based on progress

### 🛡️ Common Pitfalls

- **Premature Closure**: Stopping reasoning too early
- **Context Loss**: Forgetting important previous insights
- **Rigid Thinking**: Failing to adapt strategy when needed
- **Insufficient Validation**: Not checking reasoning quality
- **Scope Creep**: Expanding problem beyond original bounds

## Measuring Success

### 📊 Key Metrics

- **Solution Quality**: Correctness and completeness
- **Reasoning Efficiency**: Steps needed to reach solution
- **Context Utilization**: Effective use of available information
- **Adaptability**: Ability to adjust when needed
- **Consistency**: Reliable performance across problems

## Next Steps

- [Chain of Thought Implementation](/docs/sequential-thinking/chain-of-thought)
- [Dynamic Problem Solving](/docs/sequential-thinking/dynamic-problem-solving)
- [Adaptive Thinking Strategies](/docs/sequential-thinking/adaptive-thinking)

Sequential reasoning forms the foundation of sophisticated AI problem-solving. By implementing these patterns, you can create systems that think through problems systematically and adapt their reasoning strategies based on context and feedback.
`,
    tags: ['sequential-thinking', 'reasoning', 'problem-solving', 'cognitive-patterns']
  },

  {
    title: 'Knowledge Graph Design',
    slug: 'knowledge-graphs',
    parent_path: '/docs/memory-management',
    icon: '🕸️',
    content: `# Knowledge Graph Design

Knowledge graphs provide a powerful way to represent, store, and query complex relationships between entities, enabling AI systems to maintain rich contextual understanding across interactions.

## Fundamentals

### 🎯 Core Concepts

A **Knowledge Graph** is a network of interconnected entities and their relationships, where:

- **Entities** represent concrete or abstract things
- **Relationships** define how entities connect
- **Attributes** provide additional entity information
- **Context** adds temporal and situational dimensions

### 🏗️ Graph Structure

**Basic Components:**

**Entities:**
- Unique identifiers
- Type classification
- Descriptive labels
- Attribute collections
- Confidence scores

**Relationships:**
- Source and target entities
- Relationship types
- Directional properties
- Weight/strength values
- Contextual metadata

**Context:**
- Temporal information
- Spatial constraints
- Domain specifications
- Confidence levels

## Design Patterns

### 🎨 Entity Design

**Entity Types:**

**People and Organizations:**
- Person entities with roles and skills
- Organization entities with structures
- Team entities with member relationships

**Technical Entities:**
- Project entities with specifications
- Component entities with dependencies
- API entities with endpoints

**Conceptual Entities:**
- Concept entities with definitions
- Pattern entities with implementations
- Technology entities with capabilities

**Content Entities:**
- Document entities with content
- Conversation entities with context
- Decision entities with rationales

### 🔗 Relationship Design

**Relationship Categories:**

**Hierarchical Relationships:**
- Parent-child relationships
- Container-contained relationships
- Member-group relationships

**Associative Relationships:**
- Collaboration relationships
- Usage relationships
- Dependency relationships

**Temporal Relationships:**
- Sequential relationships
- Concurrent relationships
- Causal relationships

**Semantic Relationships:**
- Similarity relationships
- Opposition relationships
- Instantiation relationships

## Implementation Architecture

### 🏛️ Knowledge Graph Engine

**Core Operations:**

**Entity Management:**
- Create, read, update, delete entities
- Batch operations for efficiency
- Validation and consistency checking
- Index maintenance

**Relationship Management:**
- Link creation and validation
- Relationship traversal
- Path finding algorithms
- Subgraph extraction

**Query Operations:**
- Pattern matching
- Semantic queries
- Graph traversal
- Aggregation functions

### 📊 Advanced Querying

**Pattern Matching:**
- Multi-entity patterns
- Relationship constraints
- Attribute filtering
- Variable binding

**Semantic Queries:**
- Similarity-based search
- Analogy detection
- Concept clustering
- Inference generation

**Graph Traversal:**
- Breadth-first search
- Depth-first search
- Shortest path algorithms
- Centrality measures

### 🧠 Reasoning Engine

**Inference Capabilities:**

**Transitive Inference:**
- Property inheritance
- Relationship chains
- Hierarchical reasoning

**Similarity Inference:**
- Entity similarity detection
- Pattern recognition
- Clustering analysis

**Causal Inference:**
- Cause-effect relationships
- Temporal reasoning
- Impact analysis

## Storage Strategies

### 🗄️ Database Design

**Relational Storage:**

Benefits:
- ACID compliance
- Mature ecosystem
- SQL familiarity
- Scalability options

Challenges:
- Complex join operations
- Performance with deep traversals
- Schema rigidity

**Graph Database:**

Benefits:
- Optimized for relationships
- Intuitive graph operations
- Flexible schema
- Performance at scale

Challenges:
- Learning curve
- Limited ecosystem
- Vendor lock-in

**Hybrid Approach:**

- Core entities in relational database
- Relationships in graph database
- Synchronization mechanisms
- Query federation

### 💾 Caching Strategy

**Multi-Level Caching:**

**Entity Cache:**
- Recently accessed entities
- Frequently requested entities
- LRU eviction policy

**Relationship Cache:**
- Common traversal paths
- Neighborhood caches
- Query result caching

**Traversal Cache:**
- Pre-computed paths
- Subgraph materialization
- Incremental updates

## Applications

### 🎯 Context-Aware Systems

**Contextual Entity Retrieval:**
- Relevance scoring
- Context filtering
- Dynamic ranking
- Personalization

**Context Enrichment:**
- Related entity discovery
- Missing information inference
- Context completion
- Insight generation

### 🔍 Recommendation Engine

**Graph-Based Recommendations:**

**Collaborative Filtering:**
- User similarity graphs
- Item association networks
- Preference propagation

**Content-Based Filtering:**
- Feature similarity graphs
- Category relationships
- Attribute matching

**Hybrid Approaches:**
- Multi-graph integration
- Weighted combination
- Context-aware blending

## Performance Optimization

### ⚡ Query Optimization

**Index Strategies:**
- Entity type indexes
- Relationship type indexes
- Attribute indexes
- Composite indexes

**Query Planning:**
- Join order optimization
- Filter pushdown
- Subquery optimization
- Parallel execution

### 🔄 Incremental Updates

**Change Management:**
- Entity versioning
- Relationship tracking
- Batch processing
- Conflict resolution

**Index Maintenance:**
- Incremental indexing
- Lazy updates
- Background processing
- Consistency guarantees

## Quality Assurance

### 🛡️ Data Quality

**Validation Rules:**
- Entity integrity constraints
- Relationship consistency
- Attribute value validation
- Cross-reference checking

**Quality Metrics:**
- Completeness measures
- Accuracy assessments
- Consistency scores
- Freshness indicators

### 📊 Monitoring

**Performance Monitoring:**
- Query response times
- Throughput metrics
- Resource utilization
- Error rates

**Content Monitoring:**
- Entity growth rates
- Relationship density
- Query patterns
- Usage analytics

## Best Practices

### 🎯 Design Guidelines

1. **Clear Entity Models**: Well-defined entity types and attributes
2. **Consistent Relationships**: Standardized relationship semantics
3. **Scalable Architecture**: Design for growth and performance
4. **Quality Controls**: Validation and monitoring systems
5. **Documentation**: Clear schemas and usage patterns

### 🔄 Evolution Strategy

- **Schema Versioning**: Manage schema changes over time
- **Migration Planning**: Smooth transitions between versions
- **Backward Compatibility**: Support legacy integrations
- **Deprecation Policies**: Graceful retirement of old patterns

## Next Steps

- [Context Persistence](/docs/memory-management/context-persistence)
- [Entity Relationships](/docs/memory-management/entity-relationships)
- [Memory Optimization](/docs/memory-management/memory-optimization)

Knowledge graphs provide the foundation for intelligent, context-aware AI systems. By implementing these patterns and optimization strategies, you can build systems that maintain rich, queryable representations of complex domains and relationships.
`,
    tags: ['knowledge-graphs', 'memory-management', 'data-modeling', 'relationships']
  }
];

async function populateDocumentation() {
  console.log('🚀 Starting documentation population...');

  try {
    const supabase = await getSupabaseClient();
    
    // Create documentation pages
    for (const doc of documentationContent) {
      console.log('📝 Creating page: ' + doc.title);
      
      const { data: page, error } = await supabase
        .from('documentation_pages')
        .insert({
          title: doc.title,
          slug: doc.slug,
          content: doc.content,
          icon: doc.icon,
          path: doc.parent_path + '/' + doc.slug,
          status: 'published',
          visibility: 'public',
          content_type: 'markdown',
          order_index: documentationContent.indexOf(doc)
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating page ' + doc.title + ':', error);
        continue;
      }

      // Create tags
      if (doc.tags && doc.tags.length > 0) {
        for (const tagName of doc.tags) {
          // Create tag if it doesn't exist
          const { data: existingTag } = await supabase
            .from('documentation_tags')
            .select('id')
            .eq('name', tagName)
            .single();

          let tagId = existingTag?.id;

          if (!existingTag) {
            const { data: newTag, error: tagError } = await supabase
              .from('documentation_tags')
              .insert({
                name: tagName,
                slug: tagName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                color: 'hsl(' + Math.floor(Math.random() * 360) + ', 70%, 50%)'
              })
              .select()
              .single();

            if (tagError) {
              console.error('❌ Error creating tag ' + tagName + ':', tagError);
              continue;
            }

            tagId = newTag.id;
          }

          // Associate tag with page
          if (tagId) {
            await supabase
              .from('documentation_page_tags')
              .insert({
                page_id: page.id,
                tag_id: tagId
              });
          }
        }
      }

      console.log('✅ Created page: ' + doc.title);
    }

    // Create documentation templates
    const templates = [
      {
        name: 'API Reference Template',
        description: 'Template for documenting API endpoints',
        template_type: 'api_reference',
        content_template: '# {{title}}\n\n{{description}}\n\n## Endpoint\n\n```\n{{method}} {{endpoint}}\n```\n\n## Parameters\n\n{{#parameters}}\n- **{{name}}** (`{{type}}`) - {{description}}\n{{/parameters}}\n\n## Response\n\n```json\n{{response_example}}\n```\n\n## Examples\n\n{{examples}}',
        variables: [
          { name: 'title', type: 'text', label: 'API Title', required: true },
          { name: 'description', type: 'textarea', label: 'Description', required: true },
          { name: 'method', type: 'select', label: 'HTTP Method', required: true, options: ['GET', 'POST', 'PUT', 'DELETE'] },
          { name: 'endpoint', type: 'text', label: 'Endpoint Path', required: true }
        ]
      },
      {
        name: 'Tutorial Template',
        description: 'Template for step-by-step tutorials',
        template_type: 'tutorial',
        content_template: '# {{title}}\n\n{{introduction}}\n\n## Prerequisites\n\n{{prerequisites}}\n\n## Steps\n\n{{#steps}}\n### Step {{number}}: {{title}}\n\n{{description}}\n\n```{{language}}\n{{code}}\n```\n\n{{/steps}}\n\n## Conclusion\n\n{{conclusion}}\n\n## Next Steps\n\n{{next_steps}}',
        variables: [
          { name: 'title', type: 'text', label: 'Tutorial Title', required: true },
          { name: 'introduction', type: 'textarea', label: 'Introduction', required: true },
          { name: 'prerequisites', type: 'textarea', label: 'Prerequisites', required: false }
        ]
      }
    ];

    for (const template of templates) {
      console.log('📋 Creating template: ' + template.name);
      
      const { error } = await supabase
        .from('documentation_templates')
        .insert(template);

      if (error) {
        console.error('❌ Error creating template ' + template.name + ':', error);
      } else {
        console.log('✅ Created template: ' + template.name);
      }
    }

    console.log('🎉 Documentation population completed successfully!');

  } catch (error) {
    console.error('💥 Error populating documentation:', error);
    process.exit(1);
  }
}

// Run the population script
populateDocumentation(); 