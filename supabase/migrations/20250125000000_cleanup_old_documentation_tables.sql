-- VibeKit VDK Hub: Cleanup Old Documentation Tables
-- Generated: 2025-01-25T00:00:00.000Z
-- Description: Removes the old document_pages table and related objects that were replaced by the newer documentation_pages system

---------------------------------------
-- CLEANUP OLD DOCUMENTATION SYSTEM
---------------------------------------

-- Check if old table exists before attempting cleanup
DO $$
BEGIN
    -- Only attempt cleanup if the old table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'document_pages') THEN
        -- Drop old policies
        DROP POLICY IF EXISTS "Users can view all published pages" ON public.document_pages;
        DROP POLICY IF EXISTS "Users can view their own pages" ON public.document_pages;
        DROP POLICY IF EXISTS "Authenticated users can create pages" ON public.document_pages;
        DROP POLICY IF EXISTS "Users can update their own pages" ON public.document_pages;
        DROP POLICY IF EXISTS "Users can delete their own pages" ON public.document_pages;

        -- Drop old trigger
        DROP TRIGGER IF EXISTS update_document_pages_updated_at ON public.document_pages;

        -- Drop old table (this will also drop indexes automatically)
        DROP TABLE IF EXISTS public.document_pages CASCADE;
        
        RAISE NOTICE 'Successfully cleaned up old document_pages table.';
    ELSE
        RAISE NOTICE 'Old document_pages table does not exist, skipping cleanup.';
    END IF;
END $$;

-- Note: We keep the update_updated_at_column() function as it's used by other tables

---------------------------------------
-- VERIFICATION
---------------------------------------

-- Verify the new documentation_pages table exists and is properly configured
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'documentation_pages') THEN
        RAISE EXCEPTION 'documentation_pages table does not exist! Please ensure the newer documentation system migration has been applied.';
    END IF;
    
    -- Log successful verification
    RAISE NOTICE 'New documentation_pages system is active and verified.';
END $$; 