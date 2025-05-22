// FIXED Rule Mapping Function - Aligned with Database Schema
import { Database } from '../supabase/database.types';
import { Rule } from '../types';

// Type aliases for database types
type DbRule = Database['public']['Tables']['rules']['Row'];

// Type for compatibility JSON field (properly typed)
interface RuleCompatibility {
  ides?: string[];
  aiAssistants?: string[];
  frameworks?: string[];
  mcpServers?: string[];
}

/**
 * Updated mapping function for the new schema
 * FIXED: Use correct database field names (snake_case) and handle nullable fields properly
 */
export const mapDbRuleToRule = (dbRule: DbRule, categoryName?: string, categorySlug?: string): Rule => {
  // Safely cast JSONB compatibility field with proper type checking
  const compatibility = dbRule.compatibility 
    ? dbRule.compatibility as RuleCompatibility 
    : null;

  return {
    // Core identifiers (exact match with DB)
    id: dbRule.id,
    title: dbRule.title,
    slug: dbRule.slug,
    path: dbRule.path,
    content: dbRule.content,
    description: dbRule.description,
    version: dbRule.version,
    
    // Foreign keys and references (FIXED: Keep snake_case to match DB schema)
    category_id: dbRule.category_id,
    
    // Computed/joined fields (camelCase as they're not DB fields)
    categoryName: categoryName,
    categorySlug: categorySlug,
    
    // Nullable fields (FIXED: Properly handle nullable database fields)
    tags: dbRule.tags, // Keep as string[] | null
    globs: dbRule.globs, // Keep as string[] | null
    downloads: dbRule.downloads, // Keep as number | null
    votes: dbRule.votes, // Keep as number | null
    compatibility: compatibility, // Keep as RuleCompatibility | null
    examples: dbRule.examples as Record<string, any> | null, // Proper JSONB casting
    always_apply: dbRule.always_apply, // FIXED: Use snake_case field name
    
    // Timestamps (FIXED: Use snake_case to match DB schema)
    last_updated: dbRule.last_updated,
    created_at: dbRule.created_at,
    updated_at: dbRule.updated_at,
  };
};

/**
 * Mapping function for rule collections/arrays
 */
export const mapDbRulesToRules = (dbRules: DbRule[], categoryName?: string): Rule[] => {
  return dbRules.map(dbRule => mapDbRuleToRule(dbRule, categoryName));
};

/**
 * Reverse mapping: Convert application Rule to database insert format
 * Useful for creating/updating rules
 */
export const mapRuleToDbInsert = (rule: Partial<Rule>): Partial<DbRule> => {
  const dbData: Partial<DbRule> = {};
  
  // Direct mappings
  if (rule.id !== undefined) dbData.id = rule.id;
  if (rule.title !== undefined) dbData.title = rule.title;
  if (rule.slug !== undefined) dbData.slug = rule.slug;
  if (rule.path !== undefined) dbData.path = rule.path;
  if (rule.content !== undefined) dbData.content = rule.content;
  if (rule.description !== undefined) dbData.description = rule.description;
  if (rule.version !== undefined) dbData.version = rule.version;
  
  // Field name transformations (snake_case for DB)
  if (rule.category_id !== undefined) dbData.category_id = rule.category_id;
  if (rule.always_apply !== undefined) dbData.always_apply = rule.always_apply;
  if (rule.last_updated !== undefined) dbData.last_updated = rule.last_updated;
  
  // Nullable fields
  if (rule.tags !== undefined) dbData.tags = rule.tags;
  if (rule.globs !== undefined) dbData.globs = rule.globs;
  if (rule.downloads !== undefined) dbData.downloads = rule.downloads;
  if (rule.votes !== undefined) dbData.votes = rule.votes;
  if (rule.compatibility !== undefined) dbData.compatibility = rule.compatibility as any;
  if (rule.examples !== undefined) dbData.examples = rule.examples as any;
  
  return dbData;
};

/**
 * Type-safe helper to check if a rule has specific compatibility
 */
export const hasCompatibility = (rule: Rule, type: keyof RuleCompatibility, value: string): boolean => {
  const compatibility = rule.compatibility as RuleCompatibility | null;
  if (!compatibility || !compatibility[type]) return false;
  
  return compatibility[type]!.includes(value);
};

/**
 * Helper to get rule tags safely
 */
export const getRuleTags = (rule: Rule): string[] => {
  return rule.tags || [];
};

/**
 * Helper to check if rule should always apply
 */
export const shouldAlwaysApply = (rule: Rule): boolean => {
  return rule.always_apply === true;
};