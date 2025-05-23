-- Fix missing INSERT policy for generated_packages table
-- Issue: Anonymous users can't insert into generated_packages table
-- This policy allows anonymous users to create package records

-- Add INSERT policy for anonymous users to create generated packages
CREATE POLICY "Anonymous users can create generated packages" ON public.generated_packages 
FOR INSERT WITH CHECK (true);

-- Add UPDATE policy to allow updating download counts
CREATE POLICY "Allow updating download counts" ON public.generated_packages 
FOR UPDATE USING (true) 
WITH CHECK (true);

-- Add comments for clarity
COMMENT ON POLICY "Anonymous users can create generated packages" ON public.generated_packages 
IS 'Allows anonymous users to create package records when generating rule packages from wizard';

COMMENT ON POLICY "Allow updating download counts" ON public.generated_packages 
IS 'Allows incrementing download counters for analytics and tracking'; 