import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { createDatabaseSupabaseClient } from '../supabase/server-client';
import { errorLogger } from '../error-handling';

// Constants for rule directory structure
const RULES_DIR = path.join(process.cwd(), 'vibecodingrules-hub', '.ai', 'rules');
const CATEGORY_DIRS = ['assistants', 'languages', 'stacks', 'tasks', 'technologies', 'tools'];

// File extensions to process
const RULE_FILE_EXTENSIONS = ['.mdc', '.md'];

// Types for synchronization results
interface SyncStats {
  categoriesCreated: number;
  categoriesUpdated: number;
  rulesCreated: number;
  rulesUpdated: number;
  errors: string[];
}

interface CleanupResult {
  rulesDeleted: number;
  errors: string[];
}

interface RuleMetadata {
  description?: string;
  globs?: string[];
  alwaysApply?: boolean;
  version?: string;
  lastUpdated?: string;
  compatibility?: {
    ides?: string[];
    frameworks?: string[];
    aiAssistants?: string[];
    mcpDatabases?: string[];
  };
  tags?: string[];
  examples?: Record<string, any>;
}

// Category type for mapping
interface Category {
  id: string;
  slug: string;
  name: string;
}

/**
 * Synchronize rules from the filesystem to Supabase
 */
export async function synchronizeRules(): Promise<SyncStats> {
  const stats: SyncStats = {
    categoriesCreated: 0,
    categoriesUpdated: 0,
    rulesCreated: 0,
    rulesUpdated: 0,
    errors: []
  };

  try {
    console.log('Starting rule synchronization');
    const supabase = await createDatabaseSupabaseClient();
    
    // First ensure all categories exist
    await syncCategories(supabase, stats);
    
    // Then synchronize all rules within categories
    await syncCategoryRules(supabase, stats);
    
    // Finally, sync standalone root-level rules
    await syncRootRules(supabase, stats);
    
    console.log('Rule synchronization completed successfully', stats);
    return stats;
  } catch (error) {
    const errorMessage = `Failed to synchronize rules: ${error instanceof Error ? error.message : String(error)}`;
    stats.errors.push(errorMessage);
    console.error(errorMessage, error);
    errorLogger.log(error, 'synchronizeRules');
    return stats;
  }
}

/**
 * Synchronize categories from filesystem to Supabase
 */
async function syncCategories(supabase: any, stats: SyncStats): Promise<void> {
  try {
    // Create category records for predefined category directories
    for (const categoryDir of CATEGORY_DIRS) {
      try {
        const dirPath = path.join(RULES_DIR, categoryDir);
        if (!fs.existsSync(dirPath)) {
          console.log(`Category directory does not exist: ${dirPath}`);
          continue;
        }
        
        // Check if category already exists in the database
        const { data: existingCategory } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', categoryDir.toLowerCase())
          .maybeSingle();
        
        // Capitalize first letter for the category title
        const title = categoryDir.charAt(0).toUpperCase() + categoryDir.slice(1);
        
        if (existingCategory) {
          // Update existing category
          const { error } = await supabase
            .from('categories')
            .update({
              name: title,
              description: `Rules for ${title}`,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingCategory.id);
            
          if (error) {
            throw error;
          }
          
          stats.categoriesUpdated++;
          console.log(`Updated category: ${title}`);
        } else {
          // Create new category
          const { error } = await supabase
            .from('categories')
            .insert({
              name: title,
              slug: categoryDir.toLowerCase(),
              description: `Rules for ${title}`,
              order_index: CATEGORY_DIRS.indexOf(categoryDir)
            });
            
          if (error) {
            throw error;
          }
          
          stats.categoriesCreated++;
          console.log(`Created category: ${title}`);
        }
      } catch (categoryError) {
        const errorMessage = `Failed to sync category ${categoryDir}: ${categoryError instanceof Error ? categoryError.message : String(categoryError)}`;
        stats.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }
  } catch (error) {
    throw new Error(`Error synchronizing categories: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Synchronize rules within category directories
 */
async function syncCategoryRules(supabase: any, stats: SyncStats): Promise<void> {
  try {
    // Fetch all categories for reference
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, slug, name');
      
    if (categoriesError) {
      throw categoriesError;
    }
    
    // Create a mapping of category slug to ID for easy lookup
    const categoryMap = new Map<string, string>();
    if (categories) {
      categories.forEach((cat: Category) => {
        categoryMap.set(cat.slug, cat.id);
      });
    }
    
    // Process each category directory
    for (const categoryDir of CATEGORY_DIRS) {
      const dirPath = path.join(RULES_DIR, categoryDir);
      if (!fs.existsSync(dirPath)) {
        continue;
      }
      
      const category_id = categoryMap.get(categoryDir.toLowerCase());
      if (!category_id) {
        stats.errors.push(`Category ID not found for ${categoryDir}`);
        continue;
      }
      
      // Get all rule files in this category directory
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        try {
          if (!RULE_FILE_EXTENSIONS.some(ext => file.endsWith(ext))) {
            continue; // Skip non-rule files
          }
          
          const filePath = path.join(dirPath, file);
          const relativePath = path.relative(process.cwd(), filePath);
          
          // Generate rule ID from filename (strip extension)
          const ruleId = path.basename(file, path.extname(file));
          
          // Read and parse rule file
          const content = fs.readFileSync(filePath, 'utf8');
          const { data: metadata, content: markdownContent } = matter(content);
          
          // Clean up the metadata
          const ruleMetadata: RuleMetadata = {
            description: metadata.description || '',
            globs: metadata.globs || [],
            alwaysApply: metadata.alwaysApply || false,
            version: metadata.version || '1.0.0',
            lastUpdated: metadata.lastUpdated || new Date().toISOString(),
            compatibility: metadata.compatibility || {},
            tags: metadata.tags || [],
            examples: metadata.examples || {}
          };
          
          // Get rule title from markdown heading
          const titleMatch = markdownContent.match(/^# (.+)$/m);
          const title = titleMatch ? titleMatch[1] : ruleId;
          
          // Check if rule already exists
          const { data: existingRule } = await supabase
            .from('rules')
            .select('*')
            .eq('id', ruleId)
            .maybeSingle();
            
          if (existingRule) {
            // Update existing rule
            const { error } = await supabase
              .from('rules')
              .update({
                title,
                description: ruleMetadata.description,
                content,
                path: relativePath,
                category_id: category_id,
                version: ruleMetadata.version,
                globs: ruleMetadata.globs,
                tags: ruleMetadata.tags,
                examples: ruleMetadata.examples,
                compatibility: ruleMetadata.compatibility,
                always_apply: ruleMetadata.alwaysApply,
                updated_at: new Date().toISOString(),
                last_updated: ruleMetadata.lastUpdated
              })
              .eq('id', ruleId);
              
            if (error) {
              throw error;
            }
            
            stats.rulesUpdated++;
            console.log(`Updated rule: ${title}`);
          } else {
            // Create new rule
            const { error } = await supabase
              .from('rules')
              .insert({
                id: ruleId,
                slug: ruleId,
                title,
                description: ruleMetadata.description,
                content,
                path: relativePath,
                category_id: category_id,
                version: ruleMetadata.version,
                downloads: 0,
                votes: 0,
                globs: ruleMetadata.globs,
                tags: ruleMetadata.tags,
                examples: ruleMetadata.examples,
                compatibility: ruleMetadata.compatibility,
                always_apply: ruleMetadata.alwaysApply,
                last_updated: ruleMetadata.lastUpdated
              });
              
            if (error) {
              throw error;
            }
            
            stats.rulesCreated++;
            console.log(`Created rule: ${title}`);
          }
        } catch (ruleError) {
          const errorMessage = `Failed to sync rule ${file}: ${ruleError instanceof Error ? ruleError.message : String(ruleError)}`;
          stats.errors.push(errorMessage);
          console.error(errorMessage);
        }
      }
    }
  } catch (error) {
    throw new Error(`Error synchronizing category rules: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Synchronize rules at the root level of the rules directory
 */
async function syncRootRules(supabase: any, stats: SyncStats): Promise<void> {
  try {
    // Get all files in the root rules directory
    const rootFiles = fs.readdirSync(RULES_DIR);
    
    for (const file of rootFiles) {
      try {
        if (!RULE_FILE_EXTENSIONS.some(ext => file.endsWith(ext)) || file.startsWith('.')) {
          continue; // Skip non-rule files and hidden files
        }
        
        const filePath = path.join(RULES_DIR, file);
        
        // Skip if it's a directory
        if (fs.statSync(filePath).isDirectory()) {
          continue;
        }
        
        const relativePath = path.relative(process.cwd(), filePath);
        
        // Generate rule ID from filename (strip extension)
        const ruleId = path.basename(file, path.extname(file));
        
        // Read and parse rule file
        const content = fs.readFileSync(filePath, 'utf8');
        const { data: metadata, content: markdownContent } = matter(content);
        
        // Clean up the metadata
        const ruleMetadata: RuleMetadata = {
          description: metadata.description || '',
          globs: metadata.globs || [],
          alwaysApply: metadata.alwaysApply || false,
          version: metadata.version || '1.0.0',
          lastUpdated: metadata.lastUpdated || new Date().toISOString(),
          compatibility: metadata.compatibility || {},
          tags: metadata.tags || [],
          examples: metadata.examples || {}
        };
        
        // Get rule title from markdown heading
        const titleMatch = markdownContent.match(/^# (.+)$/m);
        const title = titleMatch ? titleMatch[1] : ruleId;
        
        // Create a category for this root rule if needed
        const categoryName = titleMatch ? titleMatch[1].split(' ')[0] : 'Core';
        const categorySlug = ruleId.toLowerCase();
        
        // Check if category exists
        let { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .maybeSingle();
          
        if (!category) {
          // Create category for this root rule
          const { data: newCategory, error: categoryError } = await supabase
            .from('categories')
            .insert({
              name: `${categoryName}`,
              slug: categorySlug,
              description: `Rules for ${categoryName}`,
              order_index: 0
            })
            .select('id')
            .single();
            
          if (categoryError) {
            throw categoryError;
          }
          
          category = newCategory;
          stats.categoriesCreated++;
          console.log(`Created category for root rule: ${categoryName}`);
        }
        
        // Check if rule already exists
        const { data: existingRule } = await supabase
          .from('rules')
          .select('*')
          .eq('id', ruleId)
          .maybeSingle();
          
        if (existingRule) {
          // Update existing rule
          const { error } = await supabase
            .from('rules')
            .update({
              title,
              description: ruleMetadata.description,
              content,
              path: relativePath,
              category_id: category.id,
              version: ruleMetadata.version,
              globs: ruleMetadata.globs,
              tags: ruleMetadata.tags,
              examples: ruleMetadata.examples,
              compatibility: ruleMetadata.compatibility,
              always_apply: ruleMetadata.alwaysApply,
              updated_at: new Date().toISOString(),
              last_updated: ruleMetadata.lastUpdated
            })
            .eq('id', ruleId);
            
          if (error) {
            throw error;
          }
          
          stats.rulesUpdated++;
          console.log(`Updated root rule: ${title}`);
        } else {
          // Create new rule
          const { error } = await supabase
            .from('rules')
            .insert({
              id: ruleId,
              slug: ruleId,
              title,
              description: ruleMetadata.description,
              content,
              path: relativePath,
              category_id: category.id,
              version: ruleMetadata.version,
              downloads: 0,
              votes: 0,
              globs: ruleMetadata.globs,
              tags: ruleMetadata.tags,
              examples: ruleMetadata.examples,
              compatibility: ruleMetadata.compatibility,
              always_apply: ruleMetadata.alwaysApply,
              last_updated: ruleMetadata.lastUpdated
            });
            
          if (error) {
            throw error;
          }
          
          stats.rulesCreated++;
          console.log(`Created root rule: ${title}`);
        }
      } catch (ruleError) {
        const errorMessage = `Failed to sync root rule ${file}: ${ruleError instanceof Error ? ruleError.message : String(ruleError)}`;
        stats.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }
  } catch (error) {
    throw new Error(`Error synchronizing root rules: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Delete rules from Supabase that no longer exist in the filesystem
 */
export async function cleanupOrphanedRules(): Promise<CleanupResult> {
  const result: CleanupResult = {
    rulesDeleted: 0,
    errors: []
  };
  
  try {
    console.log('Starting orphaned rules cleanup');
    const supabase = await createDatabaseSupabaseClient();
    
    // Get all rules from the database
    const { data: dbRules, error: fetchError } = await supabase
      .from('rules')
      .select('id, path');
      
    if (fetchError) {
      throw fetchError;
    }
    
    // Check each rule to see if its file still exists
    for (const rule of dbRules) {
      try {
        const filePath = path.join(process.cwd(), rule.path);
        
        if (!fs.existsSync(filePath)) {
          // Rule file no longer exists, delete from database
          const { error: deleteError } = await supabase
            .from('rules')
            .delete()
            .eq('id', rule.id);
            
          if (deleteError) {
            throw deleteError;
          }
          
          result.rulesDeleted++;
          console.log(`Deleted orphaned rule: ${rule.id}`);
        }
      } catch (ruleError) {
        const errorMessage = `Failed to process rule cleanup for ${rule.id}: ${ruleError instanceof Error ? ruleError.message : String(ruleError)}`;
        result.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }
    
    console.log('Orphaned rules cleanup completed', result);
    return result;
  } catch (error) {
    const errorMessage = `Failed to cleanup orphaned rules: ${error instanceof Error ? error.message : String(error)}`;
    result.errors.push(errorMessage);
    console.error(errorMessage, error);
    errorLogger.log(error, 'cleanupOrphanedRules');
    return result;
  }
} 