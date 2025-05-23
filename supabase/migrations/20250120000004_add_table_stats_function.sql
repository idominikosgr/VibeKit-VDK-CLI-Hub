-- Add the missing get_table_stats function for database stats API
CREATE OR REPLACE FUNCTION public.get_table_stats()
RETURNS TABLE (
  table_name TEXT,
  row_count BIGINT,
  size_bytes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    schemaname || '.' || tablename as table_name,
    COALESCE(n_tup_ins - n_tup_del, 0) as row_count,
    COALESCE(pg_total_relation_size(schemaname||'.'||tablename), 0) as size_bytes
  FROM pg_stat_user_tables
  WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 