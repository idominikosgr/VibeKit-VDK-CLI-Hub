// Supabase-specific implementation of rule service - FIXED SCHEMA ALIGNMENT
import { createServerSupabaseClient } from '../supabase/server-client';
import { Database } from '../supabase/database.types';
import { Rule, RuleCategory, PaginatedResult } from '../types';
import { ApiError } from '../error-handling';

// Type aliases for database types
type DbRule = Database['public']['Tables']['rules']['Row'];
type DbCategory = Database['public']['Tables']['categories']['Row'];

/**
 * Safely serialize JSON data from database to ensure proper serialization
 */
function safeSerializeJson(jsonData: any): any {
  if (jsonData === null || jsonData === undefined) {
    return null;
  }
  
  try {
    // If it's already a plain object/array, ensure it's properly serialized
    return JSON.parse(JSON.stringify(jsonData));
  } catch (error) {
    console.warn('Failed to serialize JSON data:', error);
    return null;
  }
}

/**
 * Map a database rule to the application Rule type
 * FIXED: Now properly handles snake_case DB fields and ensures serialization
 */
function mapDbRuleToRule(dbRule: DbRule, categoryName?: string, categorySlug?: string): Rule {
  return {
    // Core identifiers (exact match)
    id: dbRule.id,
    title: dbRule.title,
    slug: dbRule.slug,
    path: dbRule.path,
    description: dbRule.description,
    content: dbRule.content,
    version: dbRule.version,
    
    // Database fields using snake_case (FIXED: no more camelCase conversion)
    category_id: dbRule.category_id,
    tags: dbRule.tags,
    globs: dbRule.globs,
    downloads: dbRule.downloads,
    votes: dbRule.votes,
    always_apply: dbRule.always_apply,
    last_updated: dbRule.last_updated,
    created_at: dbRule.created_at,
    updated_at: dbRule.updated_at,
    
    // Handle JSONB fields properly with safe serialization
    compatibility: safeSerializeJson(dbRule.compatibility) as Rule['compatibility'],
    examples: safeSerializeJson(dbRule.examples) as Rule['examples'],
    
    // Computed fields (these can use camelCase as they're not DB fields)
    categoryName: categoryName,
    categorySlug: categorySlug,
  };
}

/**
 * Map a database category to the application RuleCategory type
 * FIXED: Now properly handles snake_case DB fields and ensures serialization
 */
function mapDbCategoryToCategory(dbCategory: DbCategory, ruleCount?: number): RuleCategory {
  return {
    // Database fields using snake_case (FIXED: exact match with DB)
    id: dbCategory.id,
    name: dbCategory.name,
    slug: dbCategory.slug,
    description: dbCategory.description,
    icon: dbCategory.icon,
    order_index: dbCategory.order_index,
    parent_id: dbCategory.parent_id,
    created_at: dbCategory.created_at,
    updated_at: dbCategory.updated_at,
    
    // Computed field for UI compatibility
    title: dbCategory.name, // Map name to title for UI components
    count: ruleCount,
  };
}

/**
 * Handle database errors consistently
 */
function handleDatabaseError(error: any, operation: string): ApiError {
  console.error(`Database error during ${operation}:`, error);
  
  return {
    message: 'Database operation failed',
    status: 500,
    details: error
  };
}

/**
 * Get all rule categories with rule counts
 */
export async function getRuleCategories(): Promise<RuleCategory[]> {
  try {
    const supabase = await createServerSupabaseClient();

    // Get categories without join to prevent serialization issues
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true })
      .order('name');

    if (error) {
      throw handleDatabaseError(error, 'getRuleCategories');
    }

    // For each category, get the rule count separately to avoid serialization issues
    const categoriesWithCounts = await Promise.all(
      (data || []).map(async (category) => {
        try {
          const { count } = await supabase
            .from('rules')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', category.id);
          
          return mapDbCategoryToCategory(category, count || 0);
        } catch (error) {
          console.warn(`Failed to get count for category ${category.id}:`, error);
          return mapDbCategoryToCategory(category, 0);
        }
      })
    );

    return categoriesWithCounts;
  } catch (error) {
    console.error('Error in getRuleCategories:', error);
    throw error;
  }
}

/**
 * Get a specific category by ID or slug
 */
export async function getCategory(category_idOrSlug: string): Promise<RuleCategory | null> {
  try {
    const supabase = await createServerSupabaseClient();
    
    // First try to find by slug (most common case) - Remove join to prevent serialization issues
    let { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', category_idOrSlug)
      .maybeSingle();

    // If not found and the input looks like a UUID, try by ID
    if (!data && !error && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category_idOrSlug)) {
      const result = await supabase
        .from('categories')
        .select('*')
        .eq('id', category_idOrSlug)
        .maybeSingle();
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      throw handleDatabaseError(error, `getCategory:${category_idOrSlug}`);
    }

    if (!data) {
      return null;
    }

    // Get rule count separately to avoid serialization issues
    try {
      const { count } = await supabase
        .from('rules')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', data.id);
      
      return mapDbCategoryToCategory(data, count || 0);
    } catch (countError) {
      console.warn(`Failed to get count for category ${data.id}:`, countError);
      return mapDbCategoryToCategory(data, 0);
    }
  } catch (error) {
    console.error(`Error fetching category ${category_idOrSlug}:`, error);
    throw error;
  }
}

/**
 * Get rules for a specific category with pagination
 */
export async function getRulesByCategory(
  category_idOrSlug: string,
  page: number = 1,
  pageSize: number = 20,
  searchQuery?: string
): Promise<PaginatedResult<Rule>> {
  try {
    const supabase = await createServerSupabaseClient();
    
    // First, resolve the category
    const category = await getCategory(category_idOrSlug);
    if (!category) {
      throw new Error(`Category not found: ${category_idOrSlug}`);
    }
    
    // Build count query
    let countQuery = supabase
      .from('rules')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', category.id);
    
    // Add search filter if provided (for count)
    if (searchQuery) {
      countQuery = countQuery.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }
    
    // Get count for pagination
    const { count: totalCount, error: countError } = await countQuery;
    
    if (countError) {
      throw handleDatabaseError(countError, `getRulesByCategory count:${category.id}`);
    }
    
    // Calculate pagination
    const totalPages = Math.ceil((totalCount || 0) / pageSize);
    const startIndex = (page - 1) * pageSize;
    
    // Build data query - FIXED: Remove join to prevent serialization issues
    let dataQuery = supabase
      .from('rules')
      .select('*')
      .eq('category_id', category.id);
    
    // Add search filter if provided (for data)
    if (searchQuery) {
      dataQuery = dataQuery.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }
    
    // Get paginated rules
    const { data: rules, error } = await dataQuery
      .range(startIndex, startIndex + pageSize - 1)
      .order('title');

    if (error) {
      throw handleDatabaseError(error, `getRulesByCategory:${category.id}`);
    }

    const mappedRules = (rules || []).map((rule: any) => 
      mapDbRuleToRule(rule, category.name, category.slug)
    );

    return {
      data: mappedRules,
      pagination: {
        page,
        pageSize,
        totalCount: totalCount || 0,
        totalPages
      }
    };
  } catch (error) {
    console.error(`Error fetching rules for category ${category_idOrSlug}:`, error);
    throw error;
  }
}

/**
 * Get a specific rule by ID or slug
 */
export async function getRule(ruleIdOrSlug: string): Promise<Rule | null> {
  try {
    const supabase = await createServerSupabaseClient();
    
    // First try to find by slug (most common case)
    let { data: rule, error } = await supabase
      .from('rules')
      .select('*')
      .eq('slug', ruleIdOrSlug)
      .maybeSingle();

    // If not found, try by ID (text field, not UUID)
    if (!rule && !error) {
      const result = await supabase
        .from('rules')
        .select('*')
        .eq('id', ruleIdOrSlug)
        .maybeSingle();
      
      rule = result.data;
      error = result.error;
    }

    if (error) {
      throw handleDatabaseError(error, `getRule:${ruleIdOrSlug}`);
    }

    if (!rule) {
      return null;
    }

    // Get category information separately to avoid serialization issues
    const category = await getCategory(rule.category_id);
    
    return mapDbRuleToRule(rule, category?.name, category?.slug);
  } catch (error) {
    console.error(`Error fetching rule ${ruleIdOrSlug}:`, error);
    throw error;
  }
}

/**
 * Find a rule by various identifiers (ID, slug, or path)
 * Used by API routes for flexible rule lookup
 */
export async function findRuleByIdentifier(identifier: string): Promise<Rule | null> {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Try multiple ways to find the rule - first by slug - FIXED: Remove join
    let { data: rule, error } = await supabase
      .from('rules')
      .select('*')
      .eq('slug', identifier)
      .maybeSingle();

    // If not found, try by ID
    if (!rule && !error) {
      const result = await supabase
        .from('rules')
        .select('*')
        .eq('id', identifier)
        .maybeSingle();
      
      rule = result.data;
      error = result.error;
    }

    // If still not found, try by path
    if (!rule && !error) {
      const result = await supabase
        .from('rules')
        .select('*')
        .eq('path', identifier)
        .maybeSingle();
      
      rule = result.data;
      error = result.error;
    }

    if (error) {
      throw handleDatabaseError(error, `findRuleByIdentifier:${identifier}`);
    }

    if (!rule) {
      return null;
    }

    // Get category information separately to avoid serialization issues
    const category = await getCategory(rule.category_id);

    return mapDbRuleToRule(rule, category?.name, category?.slug);
  } catch (error) {
    console.error(`Error finding rule ${identifier}:`, error);
    throw error;
  }
}

/**
 * Get all rules with pagination
 */
export async function getAllRules(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResult<Rule>> {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Build count query
    const { count: totalCount, error: countError } = await supabase
      .from('rules')
      .select('id', { count: 'exact', head: true });
    
    if (countError) {
      throw handleDatabaseError(countError, 'getAllRules count');
    }
    
    // Calculate pagination
    const totalPages = Math.ceil((totalCount || 0) / pageSize);
    const startIndex = (page - 1) * pageSize;
    
    // Build data query - JOIN with categories to get category info
    const { data, error } = await supabase
      .from('rules')
      .select(`
        *,
        categories!inner(
          name,
          slug
        )
      `)
      .range(startIndex, startIndex + pageSize - 1)
      .order('title');

    if (error) {
      throw handleDatabaseError(error, 'getAllRules');
    }

    const mappedRules = (data || []).map((item: any) => {
      const rule = item;
      const category = item.categories;
      return mapDbRuleToRule(rule, category?.name, category?.slug);
    });

    return {
      data: mappedRules,
      pagination: {
        page,
        pageSize,
        totalCount: totalCount || 0,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching all rules:', error);
    throw error;
  }
}

/**
 * Search for rules across all categories
 */
export async function searchRules(
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResult<Rule>> {
  try {
    // If no query provided, return all rules
    if (!query || query.trim() === '') {
      return getAllRules(page, pageSize);
    }

    const supabase = await createServerSupabaseClient();
    const safeQuery = query.trim().replace(/[%_]/g, '');

    // Build count query
    const countQuery = supabase
      .from('rules')
      .select('id', { count: 'exact', head: true })
      .or(`title.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%,content.ilike.%${safeQuery}%`);
    
    // Get count for pagination
    const { count: totalCount, error: countError } = await countQuery;
    
    if (countError) {
      throw handleDatabaseError(countError, `searchRules count:${safeQuery}`);
    }
    
    // Calculate pagination
    const totalPages = Math.ceil((totalCount || 0) / pageSize);
    const startIndex = (page - 1) * pageSize;
    
    // Build data query - Get rules with category info
    const dataQuery = supabase
      .from('rules')
      .select(`
        *,
        categories!inner(
          name,
          slug
        )
      `)
      .or(`title.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%,content.ilike.%${safeQuery}%`);
    
    // Get paginated search results
    const { data, error } = await dataQuery
      .range(startIndex, startIndex + pageSize - 1)
      .order('title');

    if (error) {
      throw handleDatabaseError(error, `searchRules:${safeQuery}`);
    }

    const mappedRules = (data || []).map((item: any) => {
      const rule = item;
      const category = item.categories;
      return mapDbRuleToRule(rule, category?.name, category?.slug);
    });

    return {
      data: mappedRules,
      pagination: {
        page,
        pageSize,
        totalCount: totalCount || 0,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error searching rules:', error);
    throw error;
  }
}

/**
 * Increment the download count for a rule
 */
export async function incrementRuleDownloads(ruleId: string): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.rpc('increment_rule_downloads', {
      target_rule_id: ruleId
    });

    if (error) {
      throw handleDatabaseError(error, `incrementRuleDownloads:${ruleId}`);
    }
  } catch (error) {
    console.error(`Error incrementing downloads for rule ${ruleId}:`, error);
    throw error;
  }
}

/**
 * Vote for a rule using the stored procedure
 * FIXED: Use the correct RPC function from the schema
 */
export async function voteForRule(ruleId: string, userId: string): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.rpc('vote_for_rule', {
      target_rule_id: ruleId
    });

    if (error) {
      throw handleDatabaseError(error, `voteForRule:${ruleId}`);
    }
  } catch (error) {
    console.error(`Error voting for rule ${ruleId}:`, error);
    throw error;
  }
}

/**
 * Remove vote for a rule using the stored procedure
 * FIXED: Use the correct RPC function from the schema
 */
export async function removeRuleVote(ruleId: string, userId: string): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.rpc('remove_rule_vote', {
      target_rule_id: ruleId
    });

    if (error) {
      throw handleDatabaseError(error, `removeRuleVote:${ruleId}`);
    }
  } catch (error) {
    console.error(`Error removing vote for rule ${ruleId}:`, error);
    throw error;
  }
}

/**
 * Get popular rules using the stored procedure
 */
export async function getPopularRules(limit: number = 10): Promise<Rule[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc('get_popular_rules', {
      limit_count: limit
    });

    if (error) {
      throw handleDatabaseError(error, 'getPopularRules');
    }

    return (data || []).map((rule: DbRule) => mapDbRuleToRule(rule));
  } catch (error) {
    console.error('Error fetching popular rules:', error);
    throw error;
  }
}

/**
 * Get rules by category using the stored procedure
 */
export async function getRulesByCategorySlug(categorySlug: string): Promise<Rule[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc('get_rules_by_category', {
      category_slug: categorySlug
    });

    if (error) {
      throw handleDatabaseError(error, `getRulesByCategorySlug:${categorySlug}`);
    }

    return (data || []).map((rule: DbRule) => mapDbRuleToRule(rule));
  } catch (error) {
    console.error(`Error fetching rules for category ${categorySlug}:`, error);
    throw error;
  }
}

/**
 * Search rules using the stored procedure
 */
export async function searchRulesWithFunction(
  searchQuery: string,
  categorySlug?: string,
  tags?: string[]
): Promise<Rule[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.rpc('search_rules', {
      search_query: searchQuery,
      category_slug: categorySlug || undefined,
      tags: tags || []
    });

    if (error) {
      throw handleDatabaseError(error, `searchRulesWithFunction:${searchQuery}`);
    }

    return (data || []).map((rule: DbRule) => mapDbRuleToRule(rule));
  } catch (error) {
    console.error('Error searching rules with function:', error);
    throw error;
  }
}