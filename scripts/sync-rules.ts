#!/usr/bin/env ts-node

/**
 * Unified Rules Sync Script
 * 
 * This script combines the best features from all three sync scripts:
 * - Comprehensive error handling and logging
 * - Dry-run capability for testing
 * - Version tracking and sync logging
 * - Proper category management
 * - MDC file parsing with frontmatter support
 * - Database schema alignment
 * 
 * Usage:
 *   npm run sync-rules
 *   npm run sync-rules -- --dry-run
 *   npm run sync-rules -- --force
 */

import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../lib/supabase/database.types';

// Constants
const RULES_DIR = path.resolve(process.cwd(), '.ai/rules');
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE_SYNC = process.argv.includes('--force');

// Load environment variables manually (more robust than dotenv)
async function loadEnvFile(filePath: string): Promise<void> {
  try {
    if (await fs.access(filePath).then(() => true).catch(() => false)) {
      const envContent = await fs.readFile(filePath, 'utf-8');
      envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(")?(.*?)("|$)/);
        if (match && match[1] && match[3]) {
          const key = match[1].trim();
          const value = match[3].trim();
          if (key && value && !process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  } catch (error) {
    console.warn(`Could not load env file ${filePath}:`, error);
  }
}

// Load environment variables
async function loadEnvironment(): Promise<void> {
  await loadEnvFile(path.resolve(process.cwd(), '.env'));
  await loadEnvFile(path.resolve(process.cwd(), '.env.local'));
}

// Initialize Supabase client
async function createSupabaseClient() {
  await loadEnvironment();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing required environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and ' +
      '(NEXT_SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY) are set in .env or .env.local'
    );
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey);
}

// Types
interface SyncResult {
  added: number;
  updated: number;
  skipped: number;
  errors: Array<{ file: string; error: string }>;
  duration: number;
}

interface RuleMetadata {
  title?: string;
  description?: string;
  version?: string;
  lastUpdated?: string;
  globs?: string[] | string;
  tags?: string[] | string;
  alwaysApply?: boolean;
  compatibility?: {
    ides?: string[];
    aiAssistants?: string[];
    frameworks?: string[];
    mcpServers?: string[];
  };
  examples?: Record<string, any>;
}

interface ProcessedRule {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  path: string;
  category_id: string;
  version: string;
  tags: string[];
  globs: string[] | null;
  examples: Record<string, any> | null;
  compatibility: Record<string, any> | null;
  always_apply: boolean;
  last_updated: string;
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  parent_id: string | null;
  order_index: number;
}

// Standard categories (matching database schema)
const STANDARD_CATEGORIES = [
  { name: 'Core Rules', slug: 'core', description: 'Foundational rules that apply to all projects', icon: 'settings' },
  { name: 'Languages', slug: 'languages', description: 'Rules for specific programming languages', icon: 'code' },
  { name: 'Assistants', slug: 'assistants', description: 'Rules for various AI assistants', icon: 'bot' },
  { name: 'Stacks', slug: 'stacks', description: 'Rules for technology stacks', icon: 'layers' },
  { name: 'Tasks', slug: 'tasks', description: 'Rules for specific development tasks', icon: 'tasks' },
  { name: 'Technologies', slug: 'technologies', description: 'Rules for frameworks and technologies', icon: 'gear' },
  { name: 'Tools', slug: 'tools', description: 'Rules for development tools', icon: 'tool' }
];

/**
 * Ensure all standard categories exist in the database
 */
async function ensureCategories(supabase: any): Promise<Map<string, string>> {
  const categoryMap = new Map<string, string>();
  
  console.log('📁 Ensuring categories exist...');
  
  // Get existing categories
  const { data: existingCategories, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) {
    throw new Error(`Failed to fetch existing categories: ${error.message}`);
  }

  // Process each standard category
  for (const [index, category] of STANDARD_CATEGORIES.entries()) {
    const existing = existingCategories?.find((c: any) => c.slug === category.slug);
    
    if (existing) {
      categoryMap.set(category.slug, existing.id);
      console.log(`  ✓ Category exists: ${category.name}`);
    } else {
      const newCategory: CategoryData = {
        id: uuidv4(),
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        parent_id: null,
        order_index: index
      };
      
      if (!DRY_RUN) {
        const { data, error: insertError } = await supabase
          .from('categories')
          .insert(newCategory)
          .select()
          .single();
        
        if (insertError) {
          throw new Error(`Failed to create category ${category.name}: ${insertError.message}`);
        }
        
        categoryMap.set(category.slug, data.id);
        console.log(`  ✅ Created category: ${category.name}`);
      } else {
        categoryMap.set(category.slug, newCategory.id);
        console.log(`  [DRY RUN] Would create category: ${category.name}`);
      }
    }
  }
  
  return categoryMap;
}

/**
 * Extract category from file path
 */
function extractCategoryFromPath(filePath: string): string {
  const parts = filePath.split('/');
  
  // Find .ai directory
  const aiIndex = parts.findIndex(part => part === '.ai' || part.startsWith('.ai'));
  if (aiIndex === -1) return 'core';
  
  // Check for rules directory after .ai
  if (aiIndex + 1 < parts.length && parts[aiIndex + 1] === 'rules') {
    // Return the category (third level)
    if (aiIndex + 2 < parts.length && parts[aiIndex + 2] !== path.basename(filePath)) {
      const categorySlug = parts[aiIndex + 2].toLowerCase();
      // Map known category variations
      const categoryMappings: Record<string, string> = {
        'language': 'languages',
        'stack': 'stacks',
        'task': 'tasks',
        'technology': 'technologies',
        'tool': 'tools',
        'assistant': 'assistants'
      };
      return categoryMappings[categorySlug] || categorySlug;
    }
  }
  
  return 'core'; // Default to core for top-level rules
}

/**
 * Generate a slug from text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Extract title from markdown content
 */
function extractTitle(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Normalize array fields (handle both arrays and comma-separated strings)
 */
function normalizeArrayField(field: string[] | string | undefined): string[] {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    return field.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [];
}

/**
 * Process a single rule file
 */
async function processRuleFile(
  filePath: string, 
  relativePath: string, 
  categoryMap: Map<string, string>
): Promise<ProcessedRule> {
  const content = await fs.readFile(filePath, 'utf-8');
  const { data: frontmatter, content: markdownContent } = matter(content);
  
  // Extract basic information
  const fileName = path.basename(filePath, path.extname(filePath));
  const title = frontmatter.title || extractTitle(markdownContent) || fileName;
  const slug = slugify(fileName);
  
  // Determine category
  const categorySlug = extractCategoryFromPath(relativePath);
  const category_id = categoryMap.get(categorySlug) || categoryMap.get('core')!;
  
  // Process metadata
  const tags = normalizeArrayField(frontmatter.tags);
  const globs = normalizeArrayField(frontmatter.globs);
  
  // Create processed rule
  const rule: ProcessedRule = {
    id: slug,
    title,
    slug,
    description: frontmatter.description || '',
    content,
    path: relativePath,
    category_id: category_id,
    version: frontmatter.version || '1.0.0',
    tags,
    globs: globs.length > 0 ? globs : null,
    examples: frontmatter.examples || null,
    compatibility: frontmatter.compatibility ? {
      ides: normalizeArrayField(frontmatter.compatibility.ides),
      aiAssistants: normalizeArrayField(frontmatter.compatibility.aiAssistants),
      frameworks: normalizeArrayField(frontmatter.compatibility.frameworks),
      mcpServers: normalizeArrayField(frontmatter.compatibility.mcpServers)
    } : null,
    always_apply: !!frontmatter.alwaysApply,
    last_updated: new Date().toISOString()
  };
  
  return rule;
}

/**
 * Scan directory for rule files
 */
async function scanForRuleFiles(dir: string): Promise<string[]> {
  const ruleFiles: string[] = [];
  
  async function scanDir(currentDir: string): Promise<void> {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.mdc') || entry.name.endsWith('.md'))) {
          ruleFiles.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${currentDir}:`, error);
    }
  }
  
  await scanDir(dir);
  return ruleFiles;
}

/**
 * Create version record for rule history tracking
 */
async function createVersionRecord(
  supabase: any, 
  ruleId: string, 
  version: string, 
  content: string
): Promise<void> {
  if (DRY_RUN) return;
  
  try {
    await supabase
      .from('rule_versions')
      .insert({
        rule_id: ruleId,
        version,
        content,
        changes: 'Updated via sync script'
      });
  } catch (error) {
    console.warn(`Warning: Could not create version record for ${ruleId}:`, error);
  }
}

/**
 * Log sync operation
 */
async function logSyncOperation(supabase: any, result: SyncResult): Promise<void> {
  if (DRY_RUN) return;
  
  try {
    await supabase
      .from('sync_logs')
      .insert({
        sync_type: 'local',
        added_count: result.added,
        updated_count: result.updated,
        error_count: result.errors.length,
        errors: result.errors.map(e => e.error),
        duration_ms: result.duration
      });
  } catch (error) {
    console.warn('Warning: Could not log sync operation:', error);
  }
}

/**
 * Main sync function
 */
async function syncRules(): Promise<SyncResult> {
  const startTime = Date.now();
  const result: SyncResult = {
    added: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    duration: 0
  };

  try {
    console.log('🚀 CodePilotRules Sync Script');
    console.log('==============================');
    console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
    console.log(`Rules directory: ${RULES_DIR}`);
    console.log('');

    // Check if rules directory exists
    try {
      await fs.access(RULES_DIR);
    } catch {
      throw new Error(`Rules directory not found: ${RULES_DIR}`);
    }

    // Initialize Supabase client
    console.log('🔌 Connecting to Supabase...');
    const supabase = await createSupabaseClient();
    
    // Ensure categories exist
    const categoryMap = await ensureCategories(supabase);
    
    // Scan for rule files
    console.log('📂 Scanning for rule files...');
    const ruleFiles = await scanForRuleFiles(RULES_DIR);
    console.log(`Found ${ruleFiles.length} rule files`);
    console.log('');

    // Process each rule file
    console.log('⚙️  Processing rules...');
    for (const filePath of ruleFiles) {
      try {
        const relativePath = path.relative(process.cwd(), filePath);
        console.log(`  Processing: ${relativePath}`);

        // Process the rule
        const rule = await processRuleFile(filePath, relativePath, categoryMap);
        
        // Check if rule already exists
        const { data: existingRule, error: checkError } = await supabase
          .from('rules')
          .select('id, version, content')
          .eq('id', rule.id)
          .maybeSingle();

        if (checkError) {
          throw new Error(`Failed to check existing rule: ${checkError.message}`);
        }

        if (existingRule) {
          // Rule exists - check if update is needed
          const contentChanged = existingRule.content !== rule.content;
          const versionChanged = existingRule.version !== rule.version;
          
          if (FORCE_SYNC || contentChanged || versionChanged) {
            if (!DRY_RUN) {
              const { error: updateError } = await supabase
                .from('rules')
                .update(rule)
                .eq('id', rule.id);

              if (updateError) {
                throw new Error(`Failed to update rule: ${updateError.message}`);
              }

              // Create version record
              await createVersionRecord(supabase, rule.id, rule.version, rule.content);
            }
            
            result.updated++;
            console.log(`    ✅ ${DRY_RUN ? '[DRY RUN] Would update' : 'Updated'}: ${rule.title}`);
          } else {
            result.skipped++;
            console.log(`    ⏭️  Skipped (no changes): ${rule.title}`);
          }
        } else {
          // New rule
          if (!DRY_RUN) {
            const { error: insertError } = await supabase
              .from('rules')
              .insert(rule);

            if (insertError) {
              throw new Error(`Failed to insert rule: ${insertError.message}`);
            }

            // Create initial version record
            await createVersionRecord(supabase, rule.id, rule.version, rule.content);
          }
          
          result.added++;
          console.log(`    ✨ ${DRY_RUN ? '[DRY RUN] Would add' : 'Added'}: ${rule.title}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        result.errors.push({ file: filePath, error: errorMessage });
        console.error(`    ❌ Error processing ${filePath}: ${errorMessage}`);
      }
    }

    // Calculate duration and log results
    result.duration = Date.now() - startTime;
    
    console.log('');
    console.log('📊 Sync Results:');
    console.log(`  Added: ${result.added}`);
    console.log(`  Updated: ${result.updated}`);
    console.log(`  Skipped: ${result.skipped}`);
    console.log(`  Errors: ${result.errors.length}`);
    console.log(`  Duration: ${result.duration}ms`);

    if (result.errors.length > 0) {
      console.log('');
      console.log('❌ Errors encountered:');
      result.errors.forEach(({ file, error }) => {
        console.log(`  ${path.relative(process.cwd(), file)}: ${error}`);
      });
    }

    // Log sync operation to database
    await logSyncOperation(supabase, result);

    console.log('');
    console.log('✅ Sync completed successfully!');
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('💥 Fatal error during sync:', errorMessage);
    
    result.duration = Date.now() - startTime;
    result.errors.push({ file: 'SYSTEM', error: errorMessage });
    
    return result;
  }
}

// Run the script
syncRules()
  .then((result) => {
    process.exit(result.errors.length > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });

export { syncRules };