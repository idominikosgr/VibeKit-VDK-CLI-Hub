-- Fix documentation search cache constraint
-- Generated: 2025-01-26T00:00:00.000Z
-- Description: Adds missing unique constraint for documentation_search_cache.page_id

-- The documentation system uses ON CONFLICT (page_id) in triggers but lacks the required unique constraint
-- This migration adds the missing constraint to prevent the error:
-- "there is no unique or exclusion constraint matching the ON CONFLICT specification"

-- Add unique constraint for page_id in documentation_search_cache
ALTER TABLE public.documentation_search_cache 
ADD CONSTRAINT documentation_search_cache_page_id_unique UNIQUE (page_id); 