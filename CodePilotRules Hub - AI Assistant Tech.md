# Vibe Coding Rules Hub - AI Assistant Technical Reference & Critical Issues

## 📋 Project Overview

### Business Logic & Purpose
Vibe Coding Rules Hub is a **frontend application** for the main `codepilotrules` project, serving as an intelligent rule distribution platform. The app functions as:

1. **Rule Catalog Hub**: Centralized browsing of handpicked AI development rules organized by categories
2. **Configuration Wizard**: Interactive questionnaire about user's development stack, technologies, and frameworks
3. **Tailored Rule Generator**: Creates customized rule packages from high-level general rules down to low-level programming language-specific ones
4. **Multi-Format Output**: Generates bash scripts, zip archives, or other formats based on user preferences
5. **Real-time Sync**: Automatically synchronizes rules and categories from the main codepilotrules repository

### Core User Flows

#### 1. Rule Discovery Flow
```
Initial Catalog Endpoint
↓
Display Categories (from Supabase)
↓
User Clicks Category → Modal/Page with Category Rules
↓
User Clicks Single Rule → Markdown Modal with:
├── Rule Content (formatted markdown)
├── Hover Actions (Copy, Download buttons)
└── Side Panel Info:
    ├── Rule Description
    ├── Version Number
    ├── Author (if applicable)
    ├── Compatibility Info
    └── Usage Examples
```

#### 2. Configuration Wizard Flow  
```
Setup Wizard Entry
↓
Stack Selection (React, Vue, Angular, etc.)
↓
Technology Preferences (TypeScript, JavaScript, etc.)
↓
Framework Choices (Next.js, Vite, etc.)
↓
Tool Preferences (ESLint, Prettier, etc.)
↓
Environment Details (Node version, etc.)
↓
Rule Generation Engine
↓
Output Options:
├── Bash Script (.sh)
├── Zip Archive (.zip)
├── Configuration Files
└── Custom Package
```

#### 3. Rule Hierarchy & Tailoring
The app generates rules in a hierarchical structure:
- **High-Level General Rules**: Universal best practices, project structure
- **Stack-Specific Rules**: Framework-specific configurations and patterns  
- **Language-Specific Rules**: Programming language syntax, conventions, tooling
- **Environment-Specific Rules**: IDE settings, local development configs

### Technology Stack
- **Frontend Framework:** Next.js 15.x (App Router) with React 19
- **Language:** TypeScript 5.x with strict mode
- **Backend-as-a-Service:** Supabase (PostgreSQL + Auth + RLS)
- **UI Framework:** shadcn/ui (built on Radix UI) + Tailwind CSS
- **Forms:** React Hook Form + Zod validation
- **Package Manager:** pnpm (workspace configuration)
- **Testing:** Vitest + React Testing Library (configured but unused)
- **API Integration:** Octokit (GitHub API), Next.js API Routes + Server Actions

### Project Structure
```
Vibe Coding Rules Hub/
├── codepilotrules-hub/           # Main application package
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API route handlers
│   │   │   ├── rules/            # Rule-related endpoints
│   │   │   ├── admin/            # Admin-only endpoints  
│   │   │   └── webhooks/         # GitHub webhook handlers
│   │   ├── auth/                 # Authentication pages
│   │   ├── rules/                # Rule browsing/viewing pages
│   │   ├── collections/          # User collection management
│   │   ├── admin/                # Admin interface
│   │   └── profile/              # User profile management
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui primitives
│   │   ├── auth/                 # Auth-specific components
│   │   ├── rules/                # Rule-related components
│   │   └── layout/               # Layout components
│   ├── lib/                      # Core libraries and utilities
│   │   ├── actions/              # Next.js Server Actions
│   │   ├── services/             # Service layer (Supabase, GitHub)
│   │   ├── supabase/             # Supabase client + types
│   │   └── utils.ts              # Utility functions
│   ├── hooks/                    # Custom React hooks
│   ├── scripts/                  # Build/sync scripts
│   └── supabase/                 # Client-side Supabase config
├── supabase/                     # Supabase project configuration
│   ├── migrations/               # Database migrations
│   └── functions/                # Edge functions (if any)
└── implementation-plan.md        # Project planning docs
```

### Key Files & Implementations

#### Core Configuration
- `codepilotrules-hub/next.config.ts` - Next.js configuration with redirects, image optimization
- `codepilotrules-hub/middleware.ts` - Route protection and Supabase session management
- `codepilotrules-hub/tailwind.config.ts` - Tailwind CSS configuration
- `codepilotrules-hub/lib/supabase/client.ts` - Supabase client initialization

#### Database & Types
- `supabase/migrations/20250120000000_initial_schema.sql` - **SOURCE OF TRUTH** for database schema
- `supabase/seed.sql` - Initial seed data for categories, rules, and admin setup
- `codepilotrules-hub/lib/supabase/database.types.ts` - TypeScript types (generated from schema)

#### Core Business Logic Components
- `app/page.tsx` - **Initial Rules Catalog**: Displays categories populated from Supabase
- `app/rules/[category]/page.tsx` - **Category Rule Listing**: Shows rules filtered by category
- `app/rules/[category]/[ruleId]/page.tsx` - **Rule Detail Modal**: Markdown display with copy/download actions
- `app/setup/page.tsx` - **Configuration Wizard**: Multi-step form for stack selection
- `lib/actions/rule-actions.ts` - Server Actions for rule management (BROKEN)
- `lib/services/rule-generator.ts` - **Rule Tailoring Engine**: Generates customized rule packages
- `lib/services/package-generator.ts` - **Output Generator**: Creates bash scripts, zip files, etc.
- `lib/services/supabase-rule-service.ts` - Database service layer
- `scripts/sync-rules.ts` - **Sync Engine**: Pulls rules from main codepilotrules repository

#### Rule Generation & Output System
- `lib/generators/bash-generator.ts` - Creates executable bash scripts
- `lib/generators/zip-generator.ts` - Creates downloadable zip archives  
- `lib/generators/config-generator.ts` - Generates configuration files
- `components/setup/wizard-steps/` - Multi-step wizard components
- `components/rules/rule-modal.tsx` - Rule display modal with markdown rendering
- `components/rules/rule-actions.tsx` - Copy/download hover actions

### Database Schema Structure

#### Database Refactoring Opportunities
**🔑 KEY INSIGHT**: Since rule files are sourced from the sister `codepilotrules` repository and seeded into Supabase, we have **complete flexibility** to optimize the database structure for the hub's specific needs without being constrained by external schemas.

#### Current Schema Limitations & Improvement Opportunities

**1. Identifier Strategy Optimization**
```sql
-- CURRENT: Mixed UUID/TEXT approach creates complexity
rules.id TEXT PRIMARY KEY              -- From GitHub paths
categories.id UUID PRIMARY KEY        -- Generated UUIDs

-- SUGGESTED REFACTOR: Consistent, meaningful identifiers
rules.id TEXT PRIMARY KEY             -- Keep GitHub-based for sync simplicity  
rules.internal_id BIGSERIAL           -- Fast integer joins for performance
categories.id TEXT PRIMARY KEY        -- Use slugs as primary keys (languages, frameworks, etc.)
categories.internal_id BIGSERIAL      -- Fast integer for internal operations
```

**2. Enhanced Tag System Architecture**
```sql
-- CURRENT: Simple text array (limited querying)
rules.tags TEXT[]

-- SUGGESTED: Normalized tag system with metadata
CREATE TABLE public.tags (
  id TEXT PRIMARY KEY,               -- 'typescript', 'react', 'performance'
  name TEXT NOT NULL,                -- 'TypeScript', 'React', 'Performance'
  category TEXT NOT NULL,            -- 'language', 'framework', 'concept'
  color TEXT,                        -- UI color coding
  description TEXT,                  -- Tag explanation for users
  usage_count INTEGER DEFAULT 0,    -- Popularity tracking
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.rule_tags (
  rule_id TEXT REFERENCES rules(id),
  tag_id TEXT REFERENCES tags(id),
  relevance_score FLOAT DEFAULT 1.0, -- 0.0-1.0 for weighted matching
  auto_detected BOOLEAN DEFAULT false, -- Distinguish manual vs automated tags
  PRIMARY KEY (rule_id, tag_id)
);

-- Benefits:
-- • Better wizard matching with weighted relevance
-- • Tag categorization for UI grouping
-- • Popularity-based tag suggestions
-- • Faster queries with proper indexing
```

**3. Rule Hierarchy & Dependency Optimization**
```sql
-- CURRENT: Basic parent-child relationship
rules.parent_rule_id TEXT REFERENCES rules(id)

-- SUGGESTED: Enhanced hierarchy with materialized paths
ALTER TABLE rules ADD COLUMN hierarchy_path TEXT; -- e.g., 'general.javascript.react.hooks'
ALTER TABLE rules ADD COLUMN hierarchy_level INTEGER; -- 0=general, 1=language, 2=framework, 3=specific
ALTER TABLE rules ADD COLUMN applies_to_children BOOLEAN DEFAULT true; -- Inheritance flag

-- Rule relationship matrix for intelligent suggestions
CREATE TABLE public.rule_relationships (
  primary_rule_id TEXT REFERENCES rules(id),
  related_rule_id TEXT REFERENCES rules(id),
  relationship_type TEXT CHECK (relationship_type IN ('extends', 'conflicts', 'complements', 'requires')),
  strength FLOAT DEFAULT 1.0,       -- Relationship strength (0.0-1.0)
  context_tags TEXT[],              -- When this relationship applies
  PRIMARY KEY (primary_rule_id, related_rule_id, relationship_type)
);
```

**4. Performance-Optimized Wizard Matching**
```sql
-- Pre-computed compatibility matrix for instant wizard results
CREATE TABLE public.wizard_rule_matches (
  rule_id TEXT REFERENCES rules(id),
  tech_stack_hash TEXT NOT NULL,    -- Hash of technology combination
  match_score FLOAT NOT NULL,       -- Computed relevance score
  match_reasons JSONB,              -- Why this rule matched
  last_computed TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (rule_id, tech_stack_hash)
);

-- Materialized view for category statistics (fast catalog loading)
CREATE MATERIALIZED VIEW category_stats AS
SELECT 
  c.id,
  c.name,
  c.slug,
  COUNT(r.id) as rule_count,
  AVG(r.votes) as avg_rating,
  SUM(r.downloads) as total_downloads,
  ARRAY_AGG(DISTINCT t.tag_id) FILTER (WHERE t.tag_id IS NOT NULL) as common_tags
FROM categories c
LEFT JOIN rules r ON c.id = r.category_id  
LEFT JOIN rule_tags t ON r.id = t.rule_id
GROUP BY c.id, c.name, c.slug;

-- Refresh strategy for real-time updates
CREATE OR REPLACE FUNCTION refresh_category_stats()
RETURNS TRIGGER AS $
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY category_stats;
  RETURN NULL;
END;
$ LANGUAGE plpgsql;
```

**5. Sync-Optimized Schema Design**
```sql
-- Track file-to-database mapping for efficient sync
CREATE TABLE public.file_sync_mapping (
  file_path TEXT PRIMARY KEY,       -- GitHub file path
  rule_id TEXT REFERENCES rules(id),
  file_hash TEXT NOT NULL,          -- Content hash for change detection
  last_synced TIMESTAMPTZ DEFAULT now(),
  sync_status TEXT DEFAULT 'synced' -- 'synced', 'modified', 'error'
);

-- Batch sync operations tracking
CREATE TABLE public.sync_operations (
  id BIGSERIAL PRIMARY KEY,
  operation_type TEXT NOT NULL,     -- 'full', 'incremental', 'category'
  repository_commit TEXT,
  files_processed INTEGER DEFAULT 0,
  rules_created INTEGER DEFAULT 0,
  rules_updated INTEGER DEFAULT 0,
  rules_deleted INTEGER DEFAULT 0,
  errors JSONB,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Value-Adding Enhancements (No Bloat)

**1. Smart Rule Recommendations**
```sql
-- User behavior tracking for personalized suggestions  
CREATE TABLE public.user_rule_interactions (
  user_id UUID REFERENCES auth.users(id),
  rule_id TEXT REFERENCES rules(id),
  interaction_type TEXT, -- 'view', 'download', 'copy', 'vote'
  context_tags TEXT[],   -- User's tech stack during interaction
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable: "Users who viewed this rule also liked..."
-- Enable: "Based on your tech stack, you might like..."
```

**2. Rule Quality Metrics**
```sql
-- Automated quality scoring
ALTER TABLE rules ADD COLUMN quality_score FLOAT DEFAULT 0.0;
ALTER TABLE rules ADD COLUMN completeness_score FLOAT DEFAULT 0.0; -- Based on examples, docs, etc.
ALTER TABLE rules ADD COLUMN maintenance_score FLOAT DEFAULT 1.0;  -- Freshness, update frequency

-- Computed from:
-- • Documentation completeness (examples, descriptions)
-- • User engagement (votes, downloads, comments)  
-- • Maintenance activity (recent updates, issue resolution)
-- • Compatibility coverage (how many tech stacks it supports)
```

**3. Intelligent Package Optimization**
```sql
-- Package generation cache for common configurations
CREATE TABLE public.package_cache (
  config_hash TEXT PRIMARY KEY,     -- Hash of wizard configuration
  package_content BYTEA,            -- Cached generated package
  rule_ids TEXT[],                  -- Rules included
  format TEXT,                      -- 'bash', 'zip', etc.
  size_bytes INTEGER,
  generated_at TIMESTAMPTZ DEFAULT now(),
  access_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT now()
);

-- Cache invalidation triggers when rules update
-- Significant performance improvement for popular configurations
```

#### Implementation Priority for Schema Refactoring

**Phase 1: Core Structure (Essential)**
1. ✅ Implement normalized tag system with categories
2. ✅ Add hierarchy materialized paths for performance  
3. ✅ Create file sync mapping for reliable updates
4. ✅ Build category statistics materialized view

**Phase 2: Intelligence Layer (High Value)**
1. ✅ Implement rule relationship matrix
2. ✅ Add wizard rule matching cache
3. ✅ Create quality scoring system
4. ✅ Build user interaction tracking

**Phase 3: Optimization (Performance)**
1. ✅ Package generation cache
2. ✅ Advanced indexing strategies
3. ✅ Query optimization for wizard
4. ✅ Sync performance improvements

#### Refactoring Benefits
- **🚀 Performance**: Materialized views and caching for instant catalog loading
- **🎯 Accuracy**: Better wizard matching with weighted tags and relationships
- **📊 Intelligence**: Quality scores and recommendations based on user behavior
- **🔄 Reliability**: Robust sync system with change detection and error recovery
- **🎨 UX**: Rich tag categorization enables better filtering and discovery
- **📈 Analytics**: Comprehensive tracking for product improvement insights

#### Migration Strategy
Since we control both the sync process and database schema:
1. **Implement new schema alongside current tables**
2. **Migrate data during next major sync operation**  
3. **Update application code to use optimized schema**
4. **Remove old tables after validation**
5. **Update sync scripts to populate new structure**

This approach allows **zero-downtime migration** while dramatically improving performance and user experience.
```sql
-- Rules: Central entity for AI development rules with hierarchy support
CREATE TABLE public.rules (
  id TEXT PRIMARY KEY,              -- Path-based IDs from GitHub sync
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,            -- Markdown content for modal display
  slug TEXT NOT NULL UNIQUE,
  path TEXT NOT NULL UNIQUE,        -- Original GitHub path for sync
  category_id UUID REFERENCES categories(id),
  parent_rule_id TEXT REFERENCES rules(id), -- For rule hierarchy (general → specific)
  version TEXT DEFAULT '1.0.0',
  author TEXT,                      -- Rule author for side panel display
  tags TEXT[],                      -- Technology tags for wizard matching
  globs TEXT[],                     -- File matching patterns for generation
  examples JSONB,                   -- Code examples for modal display
  compatibility JSONB,             -- Tech stack compatibility (wizard matching)
  rule_level TEXT CHECK (rule_level IN ('general', 'stack', 'language', 'environment')),
  always_apply BOOLEAN DEFAULT false, -- Auto-include in all generations
  downloads INTEGER DEFAULT 0,      -- Download counter for popularity
  votes INTEGER DEFAULT 0,          -- User rating system
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Categories: Hierarchical rule organization for catalog browsing
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,               -- Display name for catalog
  slug TEXT NOT NULL UNIQUE,        -- URL slug for navigation
  description TEXT,                 -- Category description
  icon TEXT,                        -- Icon for UI display
  parent_id UUID REFERENCES categories(id), -- Hierarchical structure
  order_index INTEGER DEFAULT 0,    -- Display order in catalog
  rule_count INTEGER DEFAULT 0,     -- Denormalized count for performance
  is_featured BOOLEAN DEFAULT false, -- Featured categories in catalog
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Wizard Configurations: User setup choices for rule generation
CREATE TABLE public.wizard_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,                  -- For anonymous users
  stack_choices JSONB NOT NULL,     -- Selected frameworks (React, Vue, etc.)
  language_choices JSONB NOT NULL,  -- Programming languages (TS, JS, etc.)
  tool_preferences JSONB NOT NULL,  -- Development tools (ESLint, Prettier, etc.)
  environment_details JSONB NOT NULL, -- Environment specifics (Node version, etc.)
  output_format TEXT DEFAULT 'zip', -- Preferred output format
  custom_requirements TEXT,         -- Additional user requirements
  generated_rules TEXT[],           -- Array of rule IDs included in generation
  generation_timestamp TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Generated Packages: Track generated rule packages for analytics
CREATE TABLE public.generated_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  configuration_id UUID REFERENCES wizard_configurations(id),
  package_type TEXT NOT NULL,       -- 'bash', 'zip', 'config', etc.
  download_url TEXT,               -- S3/Storage URL for generated package
  file_size INTEGER,               -- Package size in bytes
  rule_count INTEGER,              -- Number of rules included
  download_count INTEGER DEFAULT 0, -- Download tracking
  expires_at TIMESTAMPTZ,          -- Package expiration date
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sync Operations: Track synchronization from main codepilotrules project  
CREATE TABLE public.sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT NOT NULL,          -- 'full', 'incremental', 'categories'
  source_repository TEXT NOT NULL,  -- GitHub repo URL
  commit_hash TEXT,                 -- Last synced commit
  duration_ms INTEGER,              -- Sync performance tracking
  added_count INTEGER DEFAULT 0,    -- New rules added
  updated_count INTEGER DEFAULT 0,  -- Rules modified
  deleted_count INTEGER DEFAULT 0,  -- Rules removed
  error_count INTEGER DEFAULT 0,    -- Errors encountered
  errors JSONB,                     -- Detailed error information
  started_by UUID REFERENCES auth.users(id), -- Admin who triggered sync
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Advanced Features for Rule Generation
```sql
-- Rule Dependencies: Define rule relationships for intelligent generation
CREATE TABLE public.rule_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id TEXT REFERENCES rules(id),
  depends_on_rule_id TEXT REFERENCES rules(id),
  dependency_type TEXT CHECK (dependency_type IN ('requires', 'conflicts', 'enhances')),
  condition_tags JSONB,             -- Conditional dependencies based on tech stack
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(rule_id, depends_on_rule_id)
);

-- Rule Compatibility Matrix: Tech stack compatibility for wizard matching
CREATE TABLE public.rule_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id TEXT REFERENCES rules(id),
  technology TEXT NOT NULL,         -- 'react', 'typescript', 'eslint', etc.
  version_pattern TEXT,             -- Semantic version pattern (^18.0.0, >=16.0.0)
  compatibility_type TEXT CHECK (compatibility_type IN ('required', 'recommended', 'optional', 'incompatible')),
  notes TEXT,                       -- Additional compatibility notes
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Generation Templates: Output format templates for package generation
CREATE TABLE public.generation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,        -- 'bash-script', 'zip-archive', 'docker-setup'
  description TEXT,
  template_content TEXT NOT NULL,   -- Template file content with placeholders
  output_format TEXT NOT NULL,      -- File extension or format type
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### Row Level Security (RLS) Policies
```sql
-- Public read access for rules and categories
CREATE POLICY "Public read access" ON public.rules FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.categories FOR SELECT USING (true);

-- Admin-only write access for rules
CREATE POLICY "Admins can manage all rules" ON public.rules 
FOR ALL USING (auth.email() IN (SELECT email FROM public.admins));

-- Users manage their own data
CREATE POLICY "Users manage own profiles" ON public.profiles 
FOR ALL USING (auth.uid() = id);
```

#### Database Functions
```sql
-- Admin check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.email() IN (SELECT email FROM public.admins);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Voting functions
CREATE OR REPLACE FUNCTION vote_for_rule(rule_id TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_votes (user_id, rule_id)
  VALUES (auth.uid(), rule_id)
  ON CONFLICT (user_id, rule_id) DO NOTHING;
  
  UPDATE public.rules 
  SET votes = (SELECT COUNT(*) FROM public.user_votes WHERE rule_id = $1)
  WHERE id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Core Principles
- Never maintain backward compatibility
- Never implement compatibility layers, files, or functions
- Always prefer to update all relevant files, imports, exports, and preferences to new implementations
- Remove obsolete files and implementations completely
- Always check for existing functions, function names, classes, class names, files, and file names before creating something new
- Ensure that every existing or new feature/class/view/functionality/helper/utility is tightly integrated and properly imported/exported/referenced throughout the codebase

## Implementation Approach
### When Developing Any Code
- Create from scratch with complete implementations, not simplified placeholders
- Don't create single implementations to demonstrate concepts
- Always build full implementations across the entire app
- Don't use deprecated or legacy APIs and libraries
- Don't create compatibility layers or backward compatibility implementations
- Keep the entire codebase up to date with imports/exports/references
- Deeply integrate new components with the existing app structure
- Don't create duplicate or overlapping implementations
- Check if functionality exists (either as a file or within a file) before creating something new

### When Refactoring
- Identify all affected components
- Update all references simultaneously
- Remove deprecated code immediately
- Don't create bridging implementations

### When Adding Features
- Check for existing similar functionality before creating new implementations
- Ensure consistent naming with existing codebase patterns
- Reference new components from all relevant places
- Update all appropriate files to use new features

### Documentation
- Update documentation to reflect new implementations only
- Don't document legacy or compatibility aspects
- Ensure code comments reflect current implementation

---

## 🚨 CRITICAL ISSUES REQUIRING IMMEDIATE FIXES

### 1. Schema-Code Mismatch Crisis
**STATUS: BREAKING - Application will fail**

#### Issue 1.1: Non-existent `rules.created_by` Field
**Location:** `lib/actions/rule-actions.ts`
```typescript
// BROKEN CODE:
export async function saveRule(formData: FormData) {
  // ... auth check
  if (ruleId) {
    const { error } = await supabase
      .from('rules')
      .update(updateData)
      .eq('id', ruleId)
      .eq('created_by', session.user.id); // ❌ FIELD DOESN'T EXIST
  }
}

export async function deleteRule(ruleId: string) {
  // ... admin check fails (see 1.2)
  const { error } = await supabase
    .from('rules')
    .delete()
    .eq('id', ruleId)
    .eq('created_by', session.user.id); // ❌ FIELD DOESN'T EXIST
}
```

**Root Cause:** Database schema has no `created_by` field in `rules` table
**Impact:** Rule updates/deletions will fail or return empty results

#### Issue 1.2: Non-existent `profiles.role` Field  
**Location:** `lib/actions/rule-actions.ts`
```typescript
// BROKEN CODE:
export async function deleteRule(ruleId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role') // ❌ FIELD DOESN'T EXIST
    .eq('id', session.user.id)
    .single();
    
  if (profile?.role === 'admin') { // ❌ ALWAYS FALSE
    // Admin deletion logic - will never execute
  }
}
```

**Root Cause:** Database schema has no `role` field in `profiles` table
**Impact:** Admin-level rule deletion will never work

#### Issue 1.3: Broken Voting System
**Location:** `lib/actions/rule-actions.ts`
```typescript
// BROKEN CODE:
export async function voteForRule(ruleId: string, like: boolean) {
  const { data: existingVote } = await supabase
    .from('user_votes')  
    .select('like') // ❌ FIELD DOESN'T EXIST
    .eq('user_id', session.user.id)
    .eq('rule_id', ruleId)
    .single();

  if (existingVote?.like === like) { // ❌ ALWAYS UNDEFINED
    // Remove vote logic
  } else {
    // Add/update vote with 'like' field that doesn't exist
    await supabase
      .from('user_votes')
      .upsert({ 
        user_id: session.user.id, 
        rule_id: ruleId, 
        like // ❌ FIELD DOESN'T EXIST
      });
  }
  
  // Also tries to fetch non-existent field:
  const { data: rule } = await supabase
    .from('rules')
    .select('likes_count, slug') // ❌ SHOULD BE 'votes'
    .eq('id', ruleId)
    .single();
}
```

**Root Cause:** 
- `user_votes` table only has: `id`, `user_id`, `rule_id`, `created_at`
- `rules` table has `votes` field, not `likes_count`
**Impact:** Voting functionality completely broken

#### Issue 1.4: Missing Wizard & Generation Infrastructure
**Location:** Core business logic components missing
**Problem:** The main business value propositions are not implemented:
- Configuration wizard for stack/technology selection
- Rule generation engine for tailored packages
- Output generators for bash scripts, zip archives
- Rule hierarchy system (general → stack → language → environment)
**Impact:** App cannot fulfill its primary purpose as a rule generation hub
**Evidence:**
```typescript
// MISSING FILES:
// lib/services/rule-generator.ts - Core rule tailoring engine
// lib/generators/bash-generator.ts - Bash script generation
// lib/generators/zip-generator.ts - Zip archive creation
// components/setup/wizard-steps/ - Multi-step wizard components
// components/rules/rule-modal.tsx - Rule modal with markdown + actions
```

#### Issue 1.5: Missing Database Tables for Business Logic
**Location:** Database schema in `supabase-complete.sql`
**Problem:** Core business tables don't exist:
- `wizard_configurations` - User setup choices
- `generated_packages` - Package tracking and downloads
- `rule_dependencies` - Rule relationship management
- `rule_compatibility` - Tech stack compatibility matrix
- `generation_templates` - Output format templates
**Impact:** Wizard and generation functionality cannot be implemented

#### Issue 1.6: Catalog & Modal UI Flow Missing
**Location:** Frontend routing and components
**Problem:** Core user flows are not implemented:
- Initial catalog page showing categories from Supabase
- Category pages with filtered rules
- Rule modal with markdown display and hover actions (copy/download)
- Side panel with rule metadata (version, author, compatibility)
**Evidence:** Current routing doesn't support the described UI flows

#### Issue 1.7: Outdated TypeScript Types
**Location:** `lib/supabase/database.types.ts`
**Problem:** Type definitions don't match actual schema from `supabase-complete.sql`
**Examples:**
- Types may show fields that don't exist in SQL
- Missing fields that do exist in SQL  
- Wrong field types or constraints
- Missing business logic tables (`wizard_configurations`, `generated_packages`, etc.)

### 2. Authorization Model vs Business Logic Mismatch
**STATUS: CRITICAL SECURITY & FUNCTIONALITY ISSUE**

#### Issue 2.1: RLS vs Business Requirements Conflict
**Location:** RLS policies vs business logic requirements

**Current RLS (from `supabase-complete.sql`):**
```sql
-- ONLY admins can modify rules
CREATE POLICY "Admins can manage all rules" ON public.rules 
FOR ALL USING (auth.email() IN (SELECT email FROM public.admins));
```

**Business Logic Requirements:**
- **Rule Catalog**: Public read access to browse categories and rules ✅
- **Wizard System**: Anonymous users should generate packages ❌ (no policies for wizard tables)
- **Package Generation**: Users should download generated packages ❌ (no policies for generated_packages)
- **Rule Sync**: Automated sync from codepilotrules repository ❌ (admin-only blocks automated sync)

**Impact:** 
- Anonymous users cannot use the wizard (core business function)
- Package generation and downloads will fail
- Automated sync from main repository is blocked
- Business model fundamentally broken due to access restrictions

### 3. Missing Test Coverage
**STATUS: CRITICAL for SAFETY**
- No unit tests found for broken Server Actions
- No integration tests for API routes  
- No way to verify fixes work correctly
- High risk of introducing more bugs during fixes

---

## 🟡 HIGH PRIORITY TECHNICAL ISSUES

### 4. Code Duplication & Architecture Problems

#### Issue 4.1: API Route Logic Duplication
**Location:** Multiple files in `app/api/rules/`
```typescript
// Identical logic repeated across:
// - app/api/rules/route.ts
// - app/api/rules/r/[ruleId]/route.ts  
// - app/api/rules/r/[...rulePath]/route.ts

// DUPLICATED CODE:
const rule = await findRuleByIdentifier(identifier);
if (!rule) {
  return NextResponse.json(
    { error: 'Rule not found' }, 
    { status: 404 }
  );
}
return NextResponse.redirect(`/rules/${rule.category_id}/${rule.id}`);
```

**Fix:** Extract to shared utility: `lib/api/rule-lookup.ts`

#### Issue 4.2: Auth Check Boilerplate
**Location:** `lib/actions/rule-actions.ts`
```typescript
// REPEATED IN EVERY ACTION:
const supabase = await createServerSupabaseClient();
const { data: { session } } = await supabase.auth.getSession();
if (!session?.user) {
  return { error: 'Authentication required' };
}
```

**Fix:** Create auth wrapper HOF or middleware

#### Issue 4.3: Inconsistent Error Handling
**Examples:**
- API routes: `{ error: string, details?: string }`
- Server Actions: `{ error: string }` or `{ validationErrors: object }`
- Middleware: Silent continue on auth errors

### 5. Security Vulnerabilities

#### Issue 5.1: Admin Endpoint Security
**Location:** `app/api/admin/` endpoints
**Problem:** Inconsistent admin authorization - some use `is_admin()`, others don't
**Risk:** Unauthorized admin access

#### Issue 5.2: Middleware Auth Bypass
**Location:** `middleware.ts`
```typescript
try {
  const { data } = await supabase.auth.getSession();
  // Handle session...
} catch (error) {
  console.error('Auth error:', error);
  // ❌ CONTINUES TO PROTECTED ROUTE INSTEAD OF BLOCKING
}
```

#### Issue 5.3: Input Validation Gaps
**Location:** API routes
**Problem:** Server Actions use Zod validation, API routes don't consistently validate
**Risk:** Data integrity issues

### 6. Performance Issues

#### Issue 6.1: Inefficient Serialization
**Location:** `
```

### Schema Integrity & Authorization
- [x] Migration file created as single source of truth (`supabase/migrations/20250120000000_initial_schema.sql`)
- [x] Seed data separated into `supabase/seed.sql` with proper admin setup
- [x] `database.types.ts` includes all business logic tables and fields
- [x] All redundant SQL files removed (unified-schema.sql, schema-enhanced.sql, etc.)
- [x] Business logic tables implemented (wizard_configurations, generated_packages, rule_compatibility, rule_dependencies, generation_templates)
- [ ] All Server Actions work without field-not-found errors
- [ ] RLS policies support anonymous wizard usage and package generation
- [ ] Admin-only rule management properly enforced
- [ ] Sync system can update rules without authentication conflicts