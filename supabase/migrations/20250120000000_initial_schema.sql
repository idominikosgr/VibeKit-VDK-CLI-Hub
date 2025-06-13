-- Vibe Coding Rules Hub: Initial Schema Migration
-- Generated: 2025-01-20T00:00:00.000Z
-- Based on: supabase-complete.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For better text search

---------------------------------------
-- CORE TABLES
---------------------------------------

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT,
  parent_id UUID REFERENCES public.categories (id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rules table (primary content)
CREATE TABLE IF NOT EXISTS public.rules (
  id TEXT PRIMARY KEY, -- Using text ID for GitHub path-based IDs
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE, -- Original GitHub path
  category_id UUID NOT NULL REFERENCES public.categories (id) ON DELETE CASCADE,
  version TEXT NOT NULL DEFAULT '1.0.0',
  downloads INTEGER DEFAULT 0,
  votes INTEGER DEFAULT 0,
  globs TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  examples JSONB DEFAULT '{}'::JSONB,
  compatibility JSONB DEFAULT '{"ides": [], "aiAssistants": [], "frameworks": [], "mcpServers": []}'::JSONB,
  always_apply BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Rule versions for history tracking
CREATE TABLE IF NOT EXISTS public.rule_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id TEXT REFERENCES public.rules(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  content TEXT NOT NULL,
  changes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync logs for tracking GitHub synchronization
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sync_type TEXT NOT NULL, -- 'github', 'local', 'manual', 'scheduled'
  added_count INTEGER DEFAULT 0,
  updated_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::JSONB,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin access table
CREATE TABLE IF NOT EXISTS public.admins (
  email TEXT PRIMARY KEY,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------
-- USER TABLES
---------------------------------------

-- User profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  github_username TEXT,
  avatar_url TEXT,
  preferred_language TEXT,
  preferred_theme TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User collections
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collection items 
CREATE TABLE IF NOT EXISTS public.collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  rule_id TEXT REFERENCES public.rules(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_id, rule_id)
);

-- User votes 
CREATE TABLE IF NOT EXISTS public.user_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rule_id TEXT REFERENCES public.rules(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, rule_id)
);

---------------------------------------
-- BUSINESS LOGIC TABLES
---------------------------------------

-- Wizard Configurations: User setup choices for rule generation
CREATE TABLE IF NOT EXISTS public.wizard_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional for anonymous users
  session_id TEXT,                  -- For anonymous users
  stack_choices JSONB NOT NULL,     -- Selected frameworks (React, Vue, etc.)
  language_choices JSONB NOT NULL,  -- Programming languages (TS, JS, etc.)
  tool_preferences JSONB NOT NULL,  -- Development tools (ESLint, Prettier, etc.)
  environment_details JSONB NOT NULL, -- Environment specifics (Node version, etc.)
  output_format TEXT DEFAULT 'zip', -- Preferred output format
  custom_requirements TEXT,         -- Additional user requirements
  generated_rules TEXT[],           -- Array of rule IDs included in generation
  generation_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated Packages: Track generated rule packages for analytics and downloads
CREATE TABLE IF NOT EXISTS public.generated_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  configuration_id UUID REFERENCES public.wizard_configurations(id) ON DELETE SET NULL,
  package_type TEXT NOT NULL,       -- 'bash', 'zip', 'config', etc.
  download_url TEXT,               -- S3/Storage URL for generated package
  file_size INTEGER,               -- Package size in bytes
  rule_count INTEGER,              -- Number of rules included
  download_count INTEGER DEFAULT 0, -- Download tracking
  expires_at TIMESTAMPTZ,          -- Package expiration date
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rule Compatibility Matrix: Tech stack compatibility for wizard matching
CREATE TABLE IF NOT EXISTS public.rule_compatibility (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id TEXT REFERENCES public.rules(id) ON DELETE CASCADE,
  technology TEXT NOT NULL,         -- 'react', 'typescript', 'eslint', etc.
  version_pattern TEXT,             -- Semantic version pattern (^18.0.0, >=16.0.0)
  compatibility_type TEXT CHECK (compatibility_type IN ('required', 'recommended', 'optional', 'incompatible')),
  notes TEXT,                       -- Additional compatibility notes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rule Dependencies: Define rule relationships for intelligent generation
CREATE TABLE IF NOT EXISTS public.rule_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id TEXT REFERENCES public.rules(id) ON DELETE CASCADE,
  depends_on_rule_id TEXT REFERENCES public.rules(id) ON DELETE CASCADE,
  dependency_type TEXT CHECK (dependency_type IN ('requires', 'conflicts', 'enhances')),
  condition_tags JSONB,             -- Conditional dependencies based on tech stack
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rule_id, depends_on_rule_id, dependency_type)
);

-- Generation Templates: Output format templates for package generation
CREATE TABLE IF NOT EXISTS public.generation_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,        -- 'bash-script', 'zip-archive', 'docker-setup'
  description TEXT,
  template_content TEXT NOT NULL,   -- Template file content with placeholders
  output_format TEXT NOT NULL,      -- File extension or format type
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------
-- INDEXES
---------------------------------------

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories (parent_id);

-- Rules indexes
CREATE INDEX IF NOT EXISTS idx_rules_slug ON public.rules (slug);
CREATE INDEX IF NOT EXISTS idx_rules_category_id ON public.rules (category_id);
CREATE INDEX IF NOT EXISTS idx_rules_tags ON public.rules USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_rules_always_apply ON public.rules (always_apply) WHERE always_apply = TRUE;
CREATE INDEX IF NOT EXISTS idx_rules_content_search ON public.rules USING GIN(to_tsvector('english', title || ' ' || description || ' ' || content));

-- Rule versions indexes
CREATE INDEX IF NOT EXISTS idx_rule_versions_rule_id ON public.rule_versions (rule_id);

-- Collection indexes
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON public.collections (user_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON public.collection_items (collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_rule_id ON public.collection_items (rule_id);

-- Business logic indexes
CREATE INDEX IF NOT EXISTS idx_wizard_configurations_user_id ON public.wizard_configurations (user_id);
CREATE INDEX IF NOT EXISTS idx_wizard_configurations_session_id ON public.wizard_configurations (session_id);
CREATE INDEX IF NOT EXISTS idx_generated_packages_configuration_id ON public.generated_packages (configuration_id);
CREATE INDEX IF NOT EXISTS idx_generated_packages_expires_at ON public.generated_packages (expires_at);
CREATE INDEX IF NOT EXISTS idx_rule_compatibility_rule_id ON public.rule_compatibility (rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_compatibility_technology ON public.rule_compatibility (technology);
CREATE INDEX IF NOT EXISTS idx_rule_dependencies_rule_id ON public.rule_dependencies (rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_dependencies_depends_on ON public.rule_dependencies (depends_on_rule_id);
CREATE INDEX IF NOT EXISTS idx_generation_templates_active ON public.generation_templates (is_active) WHERE is_active = TRUE;

---------------------------------------
-- ROW LEVEL SECURITY (RLS)
---------------------------------------

-- Enable RLS for all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wizard_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_templates ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access for categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read access for rules" ON public.rules FOR SELECT USING (true);
CREATE POLICY "Public read access for rule versions" ON public.rule_versions FOR SELECT USING (true);

-- Wizard and package policies (allow anonymous access)
CREATE POLICY "Anonymous users can create wizard configs" ON public.wizard_configurations 
FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read their own wizard configs" ON public.wizard_configurations 
FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anonymous users can read generated packages" ON public.generated_packages 
FOR SELECT USING (true);

-- User-specific access policies
CREATE POLICY "Users can manage their own profiles" ON public.profiles 
FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their own collections" ON public.collections 
FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read public collections" ON public.collections 
FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);
CREATE POLICY "Users can manage items in their collections" ON public.collection_items 
FOR ALL USING (EXISTS (SELECT 1 FROM public.collections c WHERE c.id = collection_id AND c.user_id = auth.uid()));
CREATE POLICY "Users can read items in public collections" ON public.collection_items 
FOR SELECT USING (EXISTS (SELECT 1 FROM public.collections c WHERE c.id = collection_id AND (c.is_public OR c.user_id = auth.uid())));
CREATE POLICY "Users can manage their votes" ON public.user_votes 
FOR ALL USING (auth.uid() = user_id);

-- Admin access policies
CREATE POLICY "Admins can manage all data" ON public.categories 
FOR ALL USING (auth.email() IN (SELECT email FROM public.admins));
CREATE POLICY "Admins can manage all rules" ON public.rules 
FOR ALL USING (auth.email() IN (SELECT email FROM public.admins));
CREATE POLICY "Admins can view sync logs" ON public.sync_logs 
FOR SELECT USING (auth.email() IN (SELECT email FROM public.admins));
CREATE POLICY "Admins can read admin table" ON public.admins 
FOR SELECT USING (auth.email() IN (SELECT email FROM public.admins));

---------------------------------------
-- DATABASE FUNCTIONS
---------------------------------------

-- Admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.email() IN (SELECT email FROM public.admins);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Voting functions
CREATE OR REPLACE FUNCTION public.vote_for_rule(rule_id TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_votes (user_id, rule_id)
  VALUES (auth.uid(), rule_id)
  ON CONFLICT (user_id, rule_id) DO NOTHING;
  
  UPDATE public.rules 
  SET votes = (SELECT COUNT(*) FROM public.user_votes WHERE user_votes.rule_id = $1)
  WHERE id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.remove_rule_vote(rule_id TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.user_votes
  WHERE user_id = auth.uid() AND user_votes.rule_id = $1;
  
  UPDATE public.rules 
  SET votes = (SELECT COUNT(*) FROM public.user_votes WHERE user_votes.rule_id = $1)
  WHERE id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Download increment function
CREATE OR REPLACE FUNCTION public.increment_rule_downloads(rule_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.rules 
  SET downloads = downloads + 1
  WHERE id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search function
CREATE OR REPLACE FUNCTION public.search_rules(
  search_query TEXT, 
  category_slug TEXT DEFAULT NULL,
  tags TEXT[] DEFAULT '{}')
RETURNS SETOF public.rules AS $$
BEGIN
  RETURN QUERY
  SELECT r.*
  FROM public.rules r
  LEFT JOIN public.categories c ON r.category_id = c.id
  WHERE 
    (search_query IS NULL OR 
     to_tsvector('english', r.title || ' ' || r.description || ' ' || r.content) @@ plainto_tsquery('english', search_query)) AND
    (category_slug IS NULL OR c.slug = category_slug) AND
    (array_length(tags, 1) IS NULL OR r.tags && tags)
  ORDER BY 
    CASE WHEN search_query IS NOT NULL 
    THEN ts_rank(to_tsvector('english', r.title || ' ' || r.description || ' ' || r.content), plainto_tsquery('english', search_query)) 
    ELSE 0 END DESC,
    r.votes DESC,
    r.downloads DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get rules by category function
CREATE OR REPLACE FUNCTION public.get_rules_by_category(category_slug TEXT)
RETURNS SETOF public.rules AS $$
BEGIN
  RETURN QUERY
  SELECT r.*
  FROM public.rules r
  JOIN public.categories c ON r.category_id = c.id
  WHERE c.slug = category_slug
  ORDER BY r.votes DESC, r.downloads DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get popular rules function
CREATE OR REPLACE FUNCTION public.get_popular_rules(limit_count INTEGER DEFAULT 10)
RETURNS SETOF public.rules AS $$
BEGIN
  RETURN QUERY
  SELECT r.*
  FROM public.rules r
  ORDER BY 
    (r.votes * 2 + r.downloads) DESC,
    r.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

---------------------------------------
-- TRIGGERS
---------------------------------------

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE TRIGGER trigger_categories_set_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trigger_rules_set_updated_at
BEFORE UPDATE ON public.rules
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trigger_profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trigger_collections_set_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trigger_generation_templates_set_updated_at
BEFORE UPDATE ON public.generation_templates
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Function to sync vote counts
CREATE OR REPLACE FUNCTION trigger_sync_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.rules
    SET votes = votes + 1
    WHERE id = NEW.rule_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.rules
    SET votes = votes - 1
    WHERE id = OLD.rule_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for vote count syncing
CREATE TRIGGER trigger_vote_count_update
AFTER INSERT OR DELETE ON public.user_votes
FOR EACH ROW EXECUTE FUNCTION trigger_sync_vote_count();

-- Function to update rule's last_updated field when content changes
CREATE OR REPLACE FUNCTION trigger_update_rule_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.content IS DISTINCT FROM NEW.content THEN
    NEW.last_updated = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for rule timestamp update
CREATE TRIGGER trigger_rule_content_update
BEFORE UPDATE ON public.rules
FOR EACH ROW EXECUTE FUNCTION trigger_update_rule_timestamp();