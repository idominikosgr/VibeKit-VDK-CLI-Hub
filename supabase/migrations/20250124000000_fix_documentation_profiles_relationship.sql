-- Fix Documentation System Foreign Key Relationships
-- Generated: 2025-01-24T00:00:00.000Z
-- Description: Updates documentation system to properly reference profiles table instead of auth.users

-- First, remove any existing data that might cause constraint violations
-- (This is safe since we're in development)
DELETE FROM public.documentation_comments;
DELETE FROM public.documentation_versions;
DELETE FROM public.documentation_pages;

-- Drop existing foreign key constraints for documentation_pages
ALTER TABLE public.documentation_pages 
DROP CONSTRAINT IF EXISTS documentation_pages_author_id_fkey;

ALTER TABLE public.documentation_pages 
DROP CONSTRAINT IF EXISTS documentation_pages_last_edited_by_fkey;

-- Drop existing foreign key constraints for documentation_versions
ALTER TABLE public.documentation_versions 
DROP CONSTRAINT IF EXISTS documentation_versions_author_id_fkey;

-- Drop existing foreign key constraints for documentation_comments
ALTER TABLE public.documentation_comments 
DROP CONSTRAINT IF EXISTS documentation_comments_author_id_fkey;

ALTER TABLE public.documentation_comments 
DROP CONSTRAINT IF EXISTS documentation_comments_resolved_by_fkey;

-- Drop existing foreign key constraints for documentation_permissions
ALTER TABLE public.documentation_permissions 
DROP CONSTRAINT IF EXISTS documentation_permissions_user_id_fkey;

ALTER TABLE public.documentation_permissions 
DROP CONSTRAINT IF EXISTS documentation_permissions_granted_by_fkey;

-- Drop existing foreign key constraints for documentation_bookmarks
ALTER TABLE public.documentation_bookmarks 
DROP CONSTRAINT IF EXISTS documentation_bookmarks_user_id_fkey;

-- Drop existing foreign key constraints for documentation_templates
ALTER TABLE public.documentation_templates 
DROP CONSTRAINT IF EXISTS documentation_templates_created_by_fkey;

-- Add new foreign key constraints referencing profiles table
ALTER TABLE public.documentation_pages 
ADD CONSTRAINT documentation_pages_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.documentation_pages 
ADD CONSTRAINT documentation_pages_last_edited_by_fkey 
FOREIGN KEY (last_edited_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.documentation_versions 
ADD CONSTRAINT documentation_versions_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.documentation_comments 
ADD CONSTRAINT documentation_comments_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.documentation_comments 
ADD CONSTRAINT documentation_comments_resolved_by_fkey 
FOREIGN KEY (resolved_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.documentation_permissions 
ADD CONSTRAINT documentation_permissions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.documentation_permissions 
ADD CONSTRAINT documentation_permissions_granted_by_fkey 
FOREIGN KEY (granted_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.documentation_bookmarks 
ADD CONSTRAINT documentation_bookmarks_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.documentation_templates 
ADD CONSTRAINT documentation_templates_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL; 