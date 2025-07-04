-- VibeKit VDK Hub: Documentation System Migration
-- Generated: 2025-01-23T00:00:00.000Z
-- Description: Creates a comprehensive documentation system with Notion-like features

---------------------------------------
-- DOCUMENTATION SYSTEM TABLES
---------------------------------------

-- Documentation pages table - Main content storage
CREATE TABLE IF NOT EXISTS public.documentation_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT, -- Auto-generated or manual excerpt
  icon TEXT, -- Icon emoji or name
  cover_image TEXT, -- Cover image URL
  parent_id UUID REFERENCES public.documentation_pages (id) ON DELETE CASCADE,
  path TEXT NOT NULL, -- Computed path for hierarchical navigation (/docs/getting-started/installation)
  order_index INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
  visibility TEXT CHECK (visibility IN ('public', 'private', 'team')) DEFAULT 'public',
  content_type TEXT CHECK (content_type IN ('markdown', 'rich_text', 'template')) DEFAULT 'markdown',
  template_data JSONB DEFAULT '{}'::JSONB, -- For template-based pages
  metadata JSONB DEFAULT '{}'::JSONB, -- Additional metadata (tags, custom fields, etc.)
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  view_count INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 0, -- Estimated reading time
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Documentation versions - Version history for collaborative editing
CREATE TABLE IF NOT EXISTS public.documentation_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES public.documentation_pages (id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  changes_summary TEXT, -- Summary of what changed
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_major_version BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentation comments - Comments on pages and specific content
CREATE TABLE IF NOT EXISTS public.documentation_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES public.documentation_pages (id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.documentation_comments (id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  selection_start INTEGER, -- For inline comments (character position)
  selection_end INTEGER, -- For inline comments (character position)
  selection_text TEXT, -- The text that was selected for the comment
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentation permissions - Access control for pages
CREATE TABLE IF NOT EXISTS public.documentation_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES public.documentation_pages (id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_type TEXT CHECK (permission_type IN ('read', 'comment', 'edit', 'admin')) NOT NULL,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id, user_id)
);

-- Documentation links - Cross-references to rules, categories, and other pages
CREATE TABLE IF NOT EXISTS public.documentation_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_page_id UUID REFERENCES public.documentation_pages (id) ON DELETE CASCADE,
  target_type TEXT CHECK (target_type IN ('rule', 'category', 'page', 'external')) NOT NULL,
  target_id TEXT, -- Could be rule_id, category_id, or page_id
  target_url TEXT, -- For external links
  link_text TEXT NOT NULL,
  context TEXT, -- Where in the content this link appears
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentation tags - Tagging system for better organization
CREATE TABLE IF NOT EXISTS public.documentation_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT, -- Hex color for UI
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page tags relationship
CREATE TABLE IF NOT EXISTS public.documentation_page_tags (
  page_id UUID REFERENCES public.documentation_pages (id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.documentation_tags (id) ON DELETE CASCADE,
  PRIMARY KEY (page_id, tag_id)
);

-- Documentation templates - Reusable page templates
CREATE TABLE IF NOT EXISTS public.documentation_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  content_template TEXT NOT NULL,
  template_type TEXT CHECK (template_type IN ('guide', 'api_reference', 'tutorial', 'concept', 'troubleshooting')) NOT NULL,
  variables JSONB DEFAULT '[]'::JSONB, -- Array of template variables
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentation bookmarks - User bookmarks for pages
CREATE TABLE IF NOT EXISTS public.documentation_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id UUID REFERENCES public.documentation_pages (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, page_id)
);

-- Documentation search cache - For better search performance
CREATE TABLE IF NOT EXISTS public.documentation_search_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES public.documentation_pages (id) ON DELETE CASCADE,
  search_vector TSVECTOR,
  content_hash TEXT, -- To detect changes
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------
-- INDEXES
---------------------------------------

-- Documentation pages indexes
CREATE INDEX IF NOT EXISTS idx_documentation_pages_slug ON public.documentation_pages (slug);
CREATE INDEX IF NOT EXISTS idx_documentation_pages_parent_id ON public.documentation_pages (parent_id);
CREATE INDEX IF NOT EXISTS idx_documentation_pages_path ON public.documentation_pages (path);
CREATE INDEX IF NOT EXISTS idx_documentation_pages_status ON public.documentation_pages (status);
CREATE INDEX IF NOT EXISTS idx_documentation_pages_visibility ON public.documentation_pages (visibility);
CREATE INDEX IF NOT EXISTS idx_documentation_pages_author_id ON public.documentation_pages (author_id);
CREATE INDEX IF NOT EXISTS idx_documentation_pages_created_at ON public.documentation_pages (created_at);
CREATE INDEX IF NOT EXISTS idx_documentation_pages_updated_at ON public.documentation_pages (updated_at);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_documentation_pages_search ON public.documentation_pages 
USING GIN(to_tsvector('english', title || ' ' || content || ' ' || COALESCE(excerpt, '')));

-- Documentation versions indexes
CREATE INDEX IF NOT EXISTS idx_documentation_versions_page_id ON public.documentation_versions (page_id);
CREATE INDEX IF NOT EXISTS idx_documentation_versions_author_id ON public.documentation_versions (author_id);
CREATE INDEX IF NOT EXISTS idx_documentation_versions_created_at ON public.documentation_versions (created_at);

-- Documentation comments indexes
CREATE INDEX IF NOT EXISTS idx_documentation_comments_page_id ON public.documentation_comments (page_id);
CREATE INDEX IF NOT EXISTS idx_documentation_comments_parent_id ON public.documentation_comments (parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_documentation_comments_author_id ON public.documentation_comments (author_id);

-- Documentation permissions indexes
CREATE INDEX IF NOT EXISTS idx_documentation_permissions_page_id ON public.documentation_permissions (page_id);
CREATE INDEX IF NOT EXISTS idx_documentation_permissions_user_id ON public.documentation_permissions (user_id);

-- Documentation links indexes
CREATE INDEX IF NOT EXISTS idx_documentation_links_source_page_id ON public.documentation_links (source_page_id);
CREATE INDEX IF NOT EXISTS idx_documentation_links_target_type ON public.documentation_links (target_type);
CREATE INDEX IF NOT EXISTS idx_documentation_links_target_id ON public.documentation_links (target_id);

-- Documentation tags indexes
CREATE INDEX IF NOT EXISTS idx_documentation_tags_slug ON public.documentation_tags (slug);
CREATE INDEX IF NOT EXISTS idx_documentation_page_tags_page_id ON public.documentation_page_tags (page_id);
CREATE INDEX IF NOT EXISTS idx_documentation_page_tags_tag_id ON public.documentation_page_tags (tag_id);

-- Documentation bookmarks indexes
CREATE INDEX IF NOT EXISTS idx_documentation_bookmarks_user_id ON public.documentation_bookmarks (user_id);
CREATE INDEX IF NOT EXISTS idx_documentation_bookmarks_page_id ON public.documentation_bookmarks (page_id);

-- Search cache indexes
CREATE INDEX IF NOT EXISTS idx_documentation_search_cache_page_id ON public.documentation_search_cache (page_id);
CREATE INDEX IF NOT EXISTS idx_documentation_search_vector ON public.documentation_search_cache USING GIN(search_vector);

---------------------------------------
-- FUNCTIONS
---------------------------------------

-- Function to generate page path based on hierarchy
CREATE OR REPLACE FUNCTION public.generate_documentation_path(page_id UUID)
RETURNS TEXT AS $$
DECLARE
  page_record RECORD;
  parent_path TEXT;
  result_path TEXT;
BEGIN
  SELECT parent_id, slug INTO page_record FROM public.documentation_pages WHERE id = page_id;
  
  IF page_record.parent_id IS NULL THEN
    RETURN '/docs/' || page_record.slug;
  ELSE
    SELECT public.generate_documentation_path(page_record.parent_id) INTO parent_path;
    RETURN parent_path || '/' || page_record.slug;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update page path when hierarchy changes
CREATE OR REPLACE FUNCTION public.update_documentation_paths()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the path for the current page
  UPDATE public.documentation_pages 
  SET path = public.generate_documentation_path(NEW.id)
  WHERE id = NEW.id;
  
  -- Update paths for all child pages recursively
  WITH RECURSIVE child_pages AS (
    SELECT id FROM public.documentation_pages WHERE parent_id = NEW.id
    UNION ALL
    SELECT dp.id FROM public.documentation_pages dp
    INNER JOIN child_pages cp ON dp.parent_id = cp.id
  )
  UPDATE public.documentation_pages 
  SET path = public.generate_documentation_path(documentation_pages.id)
  WHERE id IN (SELECT id FROM child_pages);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate reading time
CREATE OR REPLACE FUNCTION public.calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
  reading_time INTEGER;
BEGIN
  -- Calculate word count (rough estimation)
  word_count := array_length(string_to_array(content, ' '), 1);
  
  -- Average reading speed: 200 words per minute
  reading_time := CEIL(word_count::FLOAT / 200);
  
  -- Minimum 1 minute
  IF reading_time < 1 THEN
    reading_time := 1;
  END IF;
  
  RETURN reading_time;
END;
$$ LANGUAGE plpgsql;

-- Function to update search cache
CREATE OR REPLACE FUNCTION public.update_documentation_search_cache()
RETURNS TRIGGER AS $$
DECLARE
  content_hash TEXT;
  search_vector TSVECTOR;
BEGIN
  -- Generate content hash
  content_hash := md5(NEW.title || NEW.content || COALESCE(NEW.excerpt, ''));
  
  -- Generate search vector
  search_vector := to_tsvector('english', NEW.title || ' ' || NEW.content || ' ' || COALESCE(NEW.excerpt, ''));
  
  -- Update or insert search cache
  INSERT INTO public.documentation_search_cache (page_id, search_vector, content_hash, updated_at)
  VALUES (NEW.id, search_vector, content_hash, NOW())
  ON CONFLICT (page_id) 
  DO UPDATE SET 
    search_vector = EXCLUDED.search_vector,
    content_hash = EXCLUDED.content_hash,
    updated_at = EXCLUDED.updated_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to search documentation
CREATE OR REPLACE FUNCTION public.search_documentation(
  search_query TEXT,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  path TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dp.id,
    dp.title,
    dp.slug,
    dp.excerpt,
    dp.path,
    ts_rank(dsc.search_vector, plainto_tsquery('english', search_query)) as rank
  FROM public.documentation_pages dp
  JOIN public.documentation_search_cache dsc ON dp.id = dsc.page_id
  WHERE dp.status = 'published' 
    AND dp.visibility = 'public'
    AND dsc.search_vector @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, dp.updated_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get page hierarchy (breadcrumbs)
CREATE OR REPLACE FUNCTION public.get_documentation_breadcrumbs(page_id UUID)
RETURNS TABLE(
  id UUID,
  title TEXT,
  slug TEXT,
  path TEXT,
  level INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE page_hierarchy AS (
    SELECT dp.id, dp.title, dp.slug, dp.path, dp.parent_id, 0 as level
    FROM public.documentation_pages dp
    WHERE dp.id = page_id
    
    UNION ALL
    
    SELECT dp.id, dp.title, dp.slug, dp.path, dp.parent_id, ph.level + 1
    FROM public.documentation_pages dp
    INNER JOIN page_hierarchy ph ON dp.id = ph.parent_id
  )
  SELECT ph.id, ph.title, ph.slug, ph.path, ph.level
  FROM page_hierarchy ph
  ORDER BY ph.level DESC;
END;
$$ LANGUAGE plpgsql;

---------------------------------------
-- TRIGGERS
---------------------------------------

-- Trigger to update paths when hierarchy changes
CREATE TRIGGER trigger_update_documentation_paths
  AFTER INSERT OR UPDATE OF parent_id, slug ON public.documentation_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_documentation_paths();

-- Trigger to update updated_at timestamp
CREATE TRIGGER trigger_documentation_pages_set_updated_at
  BEFORE UPDATE ON public.documentation_pages
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- Trigger to calculate word count and reading time
CREATE OR REPLACE FUNCTION public.update_documentation_stats()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count := array_length(string_to_array(NEW.content, ' '), 1);
  NEW.reading_time_minutes := public.calculate_reading_time(NEW.content);
  
  -- Auto-generate excerpt if not provided
  IF NEW.excerpt IS NULL OR NEW.excerpt = '' THEN
    NEW.excerpt := LEFT(regexp_replace(NEW.content, E'[\\n\\r]+', ' ', 'g'), 200) || '...';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_documentation_stats
  BEFORE INSERT OR UPDATE OF content ON public.documentation_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_documentation_stats();

-- Trigger to update search cache
CREATE TRIGGER trigger_update_documentation_search_cache
  AFTER INSERT OR UPDATE OF title, content, excerpt ON public.documentation_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_documentation_search_cache();

-- Trigger to create version history
CREATE OR REPLACE FUNCTION public.create_documentation_version()
RETURNS TRIGGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  -- Only create version for content updates, not for view counts
  IF TG_OP = 'UPDATE' AND (OLD.content IS DISTINCT FROM NEW.content OR OLD.title IS DISTINCT FROM NEW.title) THEN
    SELECT COALESCE(MAX(version_number), 0) + 1 INTO next_version
    FROM public.documentation_versions
    WHERE page_id = NEW.id;
    
    INSERT INTO public.documentation_versions (
      page_id, 
      version_number, 
      title, 
      content, 
      author_id,
      changes_summary
    ) VALUES (
      NEW.id,
      next_version,
      NEW.title,
      NEW.content,
      NEW.last_edited_by,
      CASE 
        WHEN OLD.title IS DISTINCT FROM NEW.title AND OLD.content IS DISTINCT FROM NEW.content THEN 'Updated title and content'
        WHEN OLD.title IS DISTINCT FROM NEW.title THEN 'Updated title'
        WHEN OLD.content IS DISTINCT FROM NEW.content THEN 'Updated content'
        ELSE 'Updated page'
      END
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_documentation_version
  AFTER UPDATE ON public.documentation_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.create_documentation_version();

---------------------------------------
-- ROW LEVEL SECURITY (RLS)
---------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.documentation_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_page_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_search_cache ENABLE ROW LEVEL SECURITY;

-- Documentation pages policies
CREATE POLICY "Public pages are viewable by everyone" ON public.documentation_pages
  FOR SELECT USING (visibility = 'public' AND status = 'published');

CREATE POLICY "Users can view pages they have permission to" ON public.documentation_pages
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      visibility = 'public' OR
      author_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.documentation_permissions dp 
        WHERE dp.page_id = id AND dp.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Authors can update their pages" ON public.documentation_pages
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Users with edit permission can update pages" ON public.documentation_pages
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.documentation_permissions dp 
      WHERE dp.page_id = id AND dp.user_id = auth.uid() AND dp.permission_type IN ('edit', 'admin')
    )
  );

CREATE POLICY "Authenticated users can create pages" ON public.documentation_pages
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors and admins can delete pages" ON public.documentation_pages
  FOR DELETE USING (
    author_id = auth.uid() OR
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.documentation_permissions dp 
      WHERE dp.page_id = id AND dp.user_id = auth.uid() AND dp.permission_type = 'admin'
    )
  );

-- Comments policies
CREATE POLICY "Comments are viewable by everyone if page is public" ON public.documentation_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.documentation_pages dp 
      WHERE dp.id = page_id AND dp.visibility = 'public' AND dp.status = 'published'
    )
  );

CREATE POLICY "Authenticated users can comment on pages they can view" ON public.documentation_comments
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.documentation_pages dp 
      WHERE dp.id = page_id AND (
        dp.visibility = 'public' OR
        dp.author_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.documentation_permissions dper 
          WHERE dper.page_id = dp.id AND dper.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Authors can update their comments" ON public.documentation_comments
  FOR UPDATE USING (author_id = auth.uid());

-- Permissions policies
CREATE POLICY "Page permissions are viewable by page authors and admins" ON public.documentation_permissions
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.documentation_pages dp 
        WHERE dp.id = page_id AND dp.author_id = auth.uid()
      ) OR
      public.is_admin()
    )
  );

-- Bookmarks policies
CREATE POLICY "Users can manage their own bookmarks" ON public.documentation_bookmarks
  FOR ALL USING (user_id = auth.uid());

-- Other tables - basic policies
CREATE POLICY "Tags are viewable by everyone" ON public.documentation_tags
  FOR SELECT USING (true);

CREATE POLICY "Page tags are viewable by everyone" ON public.documentation_page_tags
  FOR SELECT USING (true);

CREATE POLICY "Templates are viewable by everyone" ON public.documentation_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Search cache is viewable by everyone" ON public.documentation_search_cache
  FOR SELECT USING (true);

-- Versions are viewable if you can view the page
CREATE POLICY "Versions are viewable if page is viewable" ON public.documentation_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.documentation_pages dp 
      WHERE dp.id = page_id AND (
        dp.visibility = 'public' OR
        dp.author_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.documentation_permissions dper 
          WHERE dper.page_id = dp.id AND dper.user_id = auth.uid()
        )
      )
    )
  );

-- Links are viewable if source page is viewable
CREATE POLICY "Links are viewable if source page is viewable" ON public.documentation_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.documentation_pages dp 
      WHERE dp.id = source_page_id AND (
        dp.visibility = 'public' OR
        dp.author_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.documentation_permissions dper 
          WHERE dper.page_id = dp.id AND dper.user_id = auth.uid()
        )
      )
    )
  ); 