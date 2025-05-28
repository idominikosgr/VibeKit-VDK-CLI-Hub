-- Create the document_pages table for the new Notion-like documentation system
CREATE TABLE IF NOT EXISTS public.document_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Untitled',
    content JSONB DEFAULT '{"root":{"children":[{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    icon TEXT,
    cover TEXT,
    parent_id UUID REFERENCES public.document_pages(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_document_pages_parent_id ON public.document_pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_document_pages_position ON public.document_pages(position);
CREATE INDEX IF NOT EXISTS idx_document_pages_created_by ON public.document_pages(created_by);
CREATE INDEX IF NOT EXISTS idx_document_pages_is_published ON public.document_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_document_pages_created_at ON public.document_pages(created_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_document_pages_updated_at ON public.document_pages;
CREATE TRIGGER update_document_pages_updated_at
    BEFORE UPDATE ON public.document_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.document_pages ENABLE ROW LEVEL SECURITY;

-- Create policies for document_pages
DROP POLICY IF EXISTS "Users can view all published pages" ON public.document_pages;
CREATE POLICY "Users can view all published pages" ON public.document_pages
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Users can view their own pages" ON public.document_pages;
CREATE POLICY "Users can view their own pages" ON public.document_pages
    FOR SELECT USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Authenticated users can create pages" ON public.document_pages;
CREATE POLICY "Authenticated users can create pages" ON public.document_pages
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update their own pages" ON public.document_pages;
CREATE POLICY "Users can update their own pages" ON public.document_pages
    FOR UPDATE USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete their own pages" ON public.document_pages;
CREATE POLICY "Users can delete their own pages" ON public.document_pages
    FOR DELETE USING (auth.uid() = created_by);

-- Grant necessary permissions
GRANT ALL ON public.document_pages TO authenticated;
GRANT SELECT ON public.document_pages TO anon; 