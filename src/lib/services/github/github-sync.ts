// GitHub API client for syncing rules from the VDK Rules repository - FIXED SCHEMA ALIGNMENT
import { Octokit } from 'octokit';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../supabase/database.types';
import { parseMdcContent, slugifyPath, extractCategoryFromPath } from './mdc-parser';
import pLimit from 'p-limit';
import path from 'path';

// Type definitions
type DbRule = Database['public']['Tables']['rules']['Row'];
type DbCategory = Database['public']['Tables']['categories']['Row'];

// Environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'idominikosgr';
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME || 'VibeKit-VDK-AI-rules';

// Initialize Octokit
const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Type definitions
export interface SyncOptions {
  path?: string;
  category?: string;
  force?: boolean;
  logResults?: boolean;
}

export interface SyncResult {
  added: number;
  updated: number;
  errors: Error[];
  duration: number;
}

export interface GitHubFile {
  path: string;
  sha: string;
  content?: string;
}

// FIXED: Rule insert data type aligned with database schema
interface RuleInsertData {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  path: string;
  category_id: string;
  version: string;
  tags: string[] | null;
  globs: string[] | null;
  compatibility: Record<string, any> | null;
  examples: Record<string, any> | null;
  always_apply: boolean | null;
  last_updated: string;
}

export class GitHubSync {
  private options: SyncOptions;
  private concurrencyLimit = 5;

  constructor(options: SyncOptions = {}) {
    this.options = {
      logResults: false,
      force: false,
      ...options
    };
  }

  /**
   * Sync all rules from the repository
   */
  async syncAllRules(): Promise<SyncResult> {
    const startTime = Date.now();
    const result: SyncResult = {
      added: 0,
      updated: 0,
      errors: [],
      duration: 0
    };

    try {
      // Get all .mdc files from the repository
      const files = await this.getRepositoryFiles();

      // Log the result if enabled
      if (this.options.logResults) {
        console.log(`Found ${files.length} rule files in the repository`);
      }

      // Process files in parallel with concurrency limit
      const limit = pLimit(this.concurrencyLimit);
      const syncPromises = files.map(file => limit(() => this.processFile(file, result)));

      await Promise.all(syncPromises);

      // Calculate duration
      result.duration = Date.now() - startTime;

      // Log the final result if enabled
      if (this.options.logResults) {
        console.log(`Sync completed in ${result.duration}ms`);
        console.log(`Added: ${result.added}, Updated: ${result.updated}, Errors: ${result.errors.length}`);
      }

      // Log the sync operation in the database
      await this.logSyncOperation(result);

    } catch (error) {
      console.error('Error during sync:', error);
      result.errors.push(error as Error);
      result.duration = Date.now() - startTime;

      // Log the sync operation in the database even if it failed
      await this.logSyncOperation(result);
    }

    return result;
  }

  /**
   * Get all .mdc files from the repository
   */
  private async getRepositoryFiles(): Promise<GitHubFile[]> {
    // Filter based on options if provided
    const path = this.options.path || '';

    try {
      // Use GitHub API to get all .mdc files recursively
      const { data } = await octokit.rest.git.getTree({
        owner: GITHUB_REPO_OWNER,
        repo: GITHUB_REPO_NAME,
        tree_sha: 'main', // or 'master' depending on your repo
        recursive: 'true'
      });

      // Filter for .mdc files in the .ai/rules directory structure
      // Define proper typings for GitHub API response
      interface TreeItem {
        type?: string;
        path?: string;
        sha?: string;
      }
      
      return data.tree
        .filter((item: TreeItem) => {
          const isBlob = item.type === 'blob';
          const isMdc = item.path?.endsWith('.mdc');
          const isInAiRulesDir = item.path?.includes('.ai/rules/');
          const matchesPath = !path || item.path?.startsWith(path);
          return isBlob && isMdc && isInAiRulesDir && matchesPath;
        })
        .map((item: TreeItem) => ({
          path: item.path!,
          sha: item.sha!
        }));
    } catch (error) {
      console.error('Error getting repository files:', error);
      throw error;
    }
  }

  /**
   * Process a single file
   * FIXED: Use correct database field names and proper type handling
   */
  private async processFile(file: GitHubFile, result: SyncResult): Promise<void> {
    try {
      // Check if the file already exists in the database
      const { data: existingRule } = await supabaseAdmin
        .from('rules')
        .select('id, path')
        .eq('path', file.path)
        .maybeSingle();

      // Get the file content from GitHub
      const content = await this.getFileContent(file.path);
      if (!content) {
        throw new Error(`Failed to get content for ${file.path}`);
      }

      // Parse the MDC content
      const parsedContent = parseMdcContent(content, file.path, { includeContent: true });

      // Find or create the category
      const categorySlug = extractCategoryFromPath(file.path);
      const category_id = await this.findOrCreateCategory(categorySlug);

      // Generate rule data for storage - FIXED: Use correct database field names
      const fileName = path.basename(file.path, '.mdc'); // Extract filename without extension
      const ruleData: RuleInsertData = {
        id: fileName, // Use filename without extension as ID
        slug: slugifyPath(fileName), // Create slug from filename
        title: parsedContent.title,
        description: parsedContent.description || '',
        content: parsedContent.content || content, // Use full content if parsing didn't extract
        path: file.path,
        category_id: category_id, // FIXED: Use snake_case
        tags: parsedContent.tags && parsedContent.tags.length > 0 ? parsedContent.tags : null,
        version: parsedContent.version || '1.0.0',
        compatibility: parsedContent.compatibility ? {
          ides: parsedContent.compatibility.ides || [],
          aiAssistants: parsedContent.compatibility.aiAssistants || [],
          frameworks: parsedContent.compatibility.frameworks || [],
          mcpDatabases: parsedContent.compatibility.mcpDatabases || []
        } : null,
        examples: parsedContent.examples || null,
        globs: parsedContent.globs && parsedContent.globs.length > 0 ? parsedContent.globs : null,
        always_apply: parsedContent.alwaysApply || null, // FIXED: Use snake_case
        last_updated: new Date().toISOString() // FIXED: Use snake_case
      };

      if (this.options.logResults) {
        console.log(`Processing rule: ${ruleData.title} (ID: ${ruleData.id}, Slug: ${ruleData.slug})`);
      }

      // Insert or update the rule
      if (existingRule) {
        // Update existing rule - FIXED: Use correct field names
        const { error } = await supabaseAdmin
          .from('rules')
          .update({
            title: ruleData.title,
            slug: ruleData.slug,
            description: ruleData.description,
            content: ruleData.content,
            category_id: ruleData.category_id,
            tags: ruleData.tags,
            version: ruleData.version,
            compatibility: ruleData.compatibility,
            examples: ruleData.examples,
            globs: ruleData.globs,
            always_apply: ruleData.always_apply,
            last_updated: ruleData.last_updated,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRule.id);

        if (error) {
          throw error;
        }

        result.updated++;

        // Create a version record for history
        await this.createVersionRecord(existingRule.id, parsedContent);
      } else {
        // Insert new rule
        const { data, error } = await supabaseAdmin
          .from('rules')
          .insert(ruleData)
          .select('id')
          .single();

        if (error) {
          throw error;
        }

        result.added++;

        // Create initial version record
        if (data) {
          await this.createVersionRecord(data.id, parsedContent);
        }
      }
    } catch (error) {
      console.error(`Error processing file ${file.path}:`, error);
      result.errors.push(error as Error);
    }
  }

  /**
   * Get file content from GitHub
   */
  private async getFileContent(path: string): Promise<string | null> {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner: GITHUB_REPO_OWNER,
        repo: GITHUB_REPO_NAME,
        path,
        mediaType: {
          format: 'raw'
        }
      });

      return data as unknown as string;
    } catch (error) {
      console.error(`Error getting content for ${path}:`, error);
      return null;
    }
  }

  /**
   * Find or create a category based on the path
   * FIXED: Use correct database field names
   */
  private async findOrCreateCategory(categorySlug: string | null): Promise<string> {
    // Use 'core' if categorySlug is null (matching standard categories)
    const slug = categorySlug?.toLowerCase() || 'core';

    // Try to find existing category
    const { data: existingCategory } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (existingCategory) {
      return existingCategory.id;
    }

    // Create new category - FIXED: Use correct field names and proper defaults
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({
        name: this.titleCase(slug),
        slug,
        description: `Rules for ${this.titleCase(slug)}`,
        icon: this.getDefaultIcon(slug),
        order_index: 99, // Put new categories at the end
        parent_id: null,
      })
      .select('id')
      .single();

    if (error) {
      console.error(`Error creating category ${slug}:`, error);
      throw error;
    }

    return data.id;
  }

  /**
   * Create a version record for history tracking
   * FIXED: Use correct database field names
   */
  private async createVersionRecord(ruleId: string, parsedContent: any): Promise<void> {
    try {
      await supabaseAdmin
        .from('rule_versions')
        .insert({
          rule_id: ruleId, // FIXED: Use snake_case
          version: parsedContent.version || '1.0.0',
          content: parsedContent.content || '',
          changes: 'Updated via GitHub sync'
        });
    } catch (error) {
      console.error(`Error creating version record for ${ruleId}:`, error);
      // Don't throw, version recording is non-critical
    }
  }

  /**
   * Log the sync operation
   * FIXED: Use correct database field names
   */
  private async logSyncOperation(result: SyncResult): Promise<void> {
    try {
      await supabaseAdmin
        .from('sync_logs')
        .insert({
          sync_type: 'github', // Changed from 'manual' to 'github'
          added_count: result.added, // FIXED: Use snake_case
          updated_count: result.updated, // FIXED: Use snake_case
          error_count: result.errors.length, // FIXED: Use snake_case
          errors: result.errors.map(e => e.message),
          duration_ms: result.duration // FIXED: Use snake_case
        });
    } catch (error) {
      console.error('Error logging sync operation:', error);
      // Don't throw, logging is non-critical
    }
  }

  /**
   * Convert a string to title case
   */
  private titleCase(str: string): string {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get default icon for category
   */
  private getDefaultIcon(slug: string): string | null {
    const iconMap: Record<string, string> = {
      core: 'settings',
      languages: 'code',
      assistants: 'bot',
      stacks: 'layers',
      tasks: 'tasks',
      technologies: 'gear',
      tools: 'tool',
    };
    
    return iconMap[slug] || 'folder';
  }
}

/**
 * Create a new GitHub sync instance with options
 */
export function createGitHubSync(options: SyncOptions = {}): GitHubSync {
  return new GitHubSync(options);
}

/**
 * Convenience function to sync all rules
 */
export async function syncRulesFromGitHub(options: SyncOptions = {}): Promise<SyncResult> {
  const sync = new GitHubSync({ ...options, logResults: true });
  return sync.syncAllRules();
}

/**
 * Convenience function to sync specific category
 */
export async function syncCategoryFromGitHub(categorySlug: string, options: SyncOptions = {}): Promise<SyncResult> {
  const sync = new GitHubSync({ 
    ...options, 
    path: `.ai/rules/${categorySlug}`,
    logResults: true 
  });
  return sync.syncAllRules();
}