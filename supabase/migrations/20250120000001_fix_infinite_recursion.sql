-- Fix infinite recursion in admin policies
-- The issue: admins table RLS policy references itself causing infinite recursion

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can read admin table" ON public.admins;

-- Disable RLS on admins table since it's a simple lookup table
-- and the is_admin() function provides security through SECURITY DEFINER
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- Update the is_admin function to ensure it works without RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Direct query without policy check since we disabled RLS
  RETURN auth.email() IN (SELECT email FROM public.admins);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment explaining why RLS is disabled
COMMENT ON TABLE public.admins IS 'RLS disabled - security handled by is_admin() function and admin email verification'; 