-- CodePilotRulesHub: Seed Data
-- Generated: 2025-01-20T00:00:00.000Z

---------------------------------------
-- SEED: ADMINS ONLY
---------------------------------------

-- Add a default admin user
-- Replace this with your actual admin email in production
INSERT INTO public.admins (email)
VALUES
  ('dominikospritis@example.com')  -- Replace with your actual email
ON CONFLICT (email) DO NOTHING;

---------------------------------------
-- VERIFICATION
---------------------------------------

-- Verify seed data was inserted successfully
DO $$
DECLARE
  category_count INTEGER;
  rule_count INTEGER;
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO category_count FROM public.categories;
  SELECT COUNT(*) INTO rule_count FROM public.rules;
  SELECT COUNT(*) INTO admin_count FROM public.admins;
  
  RAISE NOTICE 'Seed data verification:';
  RAISE NOTICE '- Categories: %', category_count;
  RAISE NOTICE '- Rules: %', rule_count;
  RAISE NOTICE '- Admins: %', admin_count;
  
  IF admin_count >= 1 THEN
    RAISE NOTICE '✅ Basic seed data inserted successfully!';
    RAISE NOTICE 'ℹ️  Rules and categories will be populated by sync script';
  ELSE
    RAISE WARNING '⚠️  Admin user not created. Check for conflicts or errors.';
  END IF;
END;
$$;