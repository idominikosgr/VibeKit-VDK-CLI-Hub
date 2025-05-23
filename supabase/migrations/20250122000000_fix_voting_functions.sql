-- Fix voting functions to avoid parameter naming conflicts
-- Replace rule_id parameter with target_rule_id to avoid column name conflicts

-- Drop existing functions
DROP FUNCTION IF EXISTS public.vote_for_rule(TEXT);
DROP FUNCTION IF EXISTS public.remove_rule_vote(TEXT);
DROP FUNCTION IF EXISTS public.increment_rule_downloads(TEXT);

-- Recreate voting functions with different parameter names
CREATE OR REPLACE FUNCTION public.vote_for_rule(target_rule_id TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_votes (user_id, rule_id)
  VALUES (auth.uid(), target_rule_id)
  ON CONFLICT (user_id, rule_id) DO NOTHING;
  
  -- Update vote count in rules table
  UPDATE public.rules 
  SET votes = (SELECT COUNT(*) FROM public.user_votes WHERE user_votes.rule_id = target_rule_id)
  WHERE id = target_rule_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.remove_rule_vote(target_rule_id TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.user_votes
  WHERE user_id = auth.uid() AND rule_id = target_rule_id;
  
  -- Update vote count in rules table
  UPDATE public.rules 
  SET votes = (SELECT COUNT(*) FROM public.user_votes WHERE user_votes.rule_id = target_rule_id)
  WHERE id = target_rule_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate download increment function for consistency
CREATE OR REPLACE FUNCTION public.increment_rule_downloads(target_rule_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.rules 
  SET downloads = downloads + 1
  WHERE id = target_rule_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 