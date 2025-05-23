-- Temporarily disable RLS on documentation tables to fix infinite recursion
-- Generated: 2025-01-24T00:00:01.000Z
-- Description: Disables Row Level Security on documentation tables to resolve infinite recursion in policies

-- Disable RLS on all documentation tables
ALTER TABLE public.documentation_pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_versions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_page_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_bookmarks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_search_cache DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean up
DROP POLICY IF EXISTS "Public pages are viewable by everyone" ON public.documentation_pages;
DROP POLICY IF EXISTS "Users can view pages they have permission to" ON public.documentation_pages;
DROP POLICY IF EXISTS "Authors can update their pages" ON public.documentation_pages;
DROP POLICY IF EXISTS "Users with edit permission can update pages" ON public.documentation_pages;
DROP POLICY IF EXISTS "Authenticated users can create pages" ON public.documentation_pages;
DROP POLICY IF EXISTS "Authors and admins can delete pages" ON public.documentation_pages;

DROP POLICY IF EXISTS "Comments are viewable by everyone if page is public" ON public.documentation_comments;
DROP POLICY IF EXISTS "Authenticated users can comment on pages they can view" ON public.documentation_comments;
DROP POLICY IF EXISTS "Authors can update their comments" ON public.documentation_comments;

DROP POLICY IF EXISTS "Page permissions are viewable by page authors and admins" ON public.documentation_permissions;
DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON public.documentation_bookmarks;
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON public.documentation_tags;
DROP POLICY IF EXISTS "Page tags are viewable by everyone" ON public.documentation_page_tags;
DROP POLICY IF EXISTS "Templates are viewable by everyone" ON public.documentation_templates;
DROP POLICY IF EXISTS "Search cache is viewable by everyone" ON public.documentation_search_cache;
DROP POLICY IF EXISTS "Versions are viewable if page is viewable" ON public.documentation_versions;
DROP POLICY IF EXISTS "Links are viewable if source page is viewable" ON public.documentation_links; 