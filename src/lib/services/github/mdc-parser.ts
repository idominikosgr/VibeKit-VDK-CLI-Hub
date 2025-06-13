// MDC Parser for Vibe Coding Rules
// Parses .mdc files to extract content, metadata, and compatibility info

import matter from 'gray-matter';
import { z } from 'zod';

// Define Zod schemas for validation

// Compatibility schema
const compatibilitySchema = z.object({
  ides: z.array(z.string()).optional(),
  aiAssistants: z.array(z.string()).optional(),
  frameworks: z.array(z.string()).optional(),
  mcpDatabases: z.array(z.string()).optional()
});

// Version constraints schema
const versionConstraintsSchema = z.object({
  minVersion: z.string().optional(),
  maxVersion: z.string().optional(),
  strictVersionCheck: z.boolean().optional().default(false)
});

// MDC content schema
const mdcContentSchema = z.object({
  // File content and metadata
  title: z.string(),
  description: z.string(),
  version: z.string(),
  author: z.string().optional(),
  content: z.string(),
  path: z.string(), // GitHub path

  // Extracted tags and compatibility
  tags: z.array(z.string()),
  compatibility: compatibilitySchema,

  // Version constraints
  versionConstraints: versionConstraintsSchema.optional(),

  // Additional metadata
  globs: z.array(z.string()).optional(),
  examples: z.record(z.any()).optional(),
  alwaysApply: z.boolean().optional()
});

// Export type from the schema
export type MdcContent = z.infer<typeof mdcContentSchema>;

export interface MdcParseOptions {
  includeContent?: boolean;
  normalizeHeadings?: boolean;
}

/**
 * Parse MDC file content
 * @param content Raw content of the .mdc file
 * @param path Path of the file in the repository
 * @param options Parsing options
 */
export function parseMdcContent(content: string, path: string, options: MdcParseOptions = {}): MdcContent {
  const { includeContent = true, normalizeHeadings = true } = options;

  // Fix malformed frontmatter by adding missing opening delimiter
  let fixedContent = content;
  
  // Check if content starts with YAML without opening ---
  if (!content.startsWith('---') && content.includes('---\n')) {
    const lines = content.split('\n');
    const delimiterIndex = lines.findIndex(line => line.trim() === '---');
    
    if (delimiterIndex > 0) {
      // Add opening delimiter at the beginning
      fixedContent = '---\n' + content;
    }
  }

  // Use gray-matter to parse frontmatter and content
  const { data, content: mdContent } = matter(fixedContent);

  // Extract title from frontmatter or first heading
  let title = data.title;
  let processedContent = mdContent;

  if (!title) {
    // If no title in frontmatter, try to extract from first heading
    const titleMatch = mdContent.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1];

      // Remove the first heading if we're using it as title
      if (normalizeHeadings) {
        processedContent = mdContent.replace(/^#\s+(.+)$/m, '').trim();
      }
    }
  }

  // Extract tags - handle both tags and compatibleWith fields
  let tags: string[] = [];
  
  if (Array.isArray(data.tags)) {
    tags = data.tags;
  } else if (typeof data.tags === 'string') {
    tags = data.tags.split(',').map(t => t.trim());
  }
  
  // Also extract tags from compatibleWith field (common in these files)
  if (data.compatibleWith) {
    const compatibleTags = Array.isArray(data.compatibleWith) 
      ? data.compatibleWith 
      : [data.compatibleWith];
    tags = [...tags, ...compatibleTags];
  }

  // Extract and normalize globs - handle both array and comma-separated string formats
  let globPatterns: string[] = [];
  if (data.globs) {
    if (Array.isArray(data.globs)) {
      globPatterns = data.globs;
    } else if (typeof data.globs === 'string') {
      // Handle comma-separated string of glob patterns
      globPatterns = data.globs.split(',').map(g => g.trim());
    }
  }
  
  // Extract compatibility - handle both standard format and custom formats
  let compatibility = data.compatibility || {};
  
  // Handle platforms field (common in these files)
  if (data.platforms && Array.isArray(data.platforms)) {
    // Separate platforms into ides and aiAssistants
    const ides = data.platforms.filter((p: string) => 
      ['cursor', 'vscode', 'jetbrains', 'zed'].includes(p.toLowerCase())
    );
    const aiAssistants = data.platforms.filter((p: string) => 
      ['claude', 'github-copilot', 'openai-codex', 'windsurf'].includes(p.toLowerCase())
    );
    
    if (!compatibility.ides && ides.length > 0) compatibility.ides = ides;
    if (!compatibility.aiAssistants && aiAssistants.length > 0) compatibility.aiAssistants = aiAssistants;
  }
  
  // Handle compatibleWith field as frameworks
  if (data.compatibleWith && !compatibility.frameworks) {
    const frameworks = Array.isArray(data.compatibleWith) 
      ? data.compatibleWith 
      : [data.compatibleWith];
    compatibility.frameworks = frameworks;
  }
  
  // Extract version constraints
  const versionConstraints = data.versionConstraints || {};

  // Clean up paths
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;

  // Create the MDC content object
  const mdcData = {
    title: title || 'Untitled Rule',
    description: data.description || '',
    version: data.version || data.lastUpdated || '1.0.0',
    author: data.author,
    content: includeContent ? processedContent : '',
    path: cleanPath,

    // Tags and compatibility
    tags,
    compatibility: {
      ides: Array.isArray(compatibility.ides) ? compatibility.ides : [],
      aiAssistants: Array.isArray(compatibility.aiAssistants) ? compatibility.aiAssistants : [],
      frameworks: Array.isArray(compatibility.frameworks) ? compatibility.frameworks : [],
      mcpDatabases: Array.isArray(compatibility.mcpDatabases) ? compatibility.mcpDatabases : []
    },
    
    // Version constraints
    versionConstraints: {
      minVersion: versionConstraints.minVersion,
      maxVersion: versionConstraints.maxVersion,
      strictVersionCheck: !!versionConstraints.strictVersionCheck
    },

    // Additional metadata
    globs: globPatterns,
    examples: data.examples || {},
    alwaysApply: !!data.alwaysApply
  };
  
  // Validate with Zod schema
  try {
    return mdcContentSchema.parse(mdcData);
  } catch (error) {
    console.error('MDC validation error:', error);
    
    // Return the data anyway, but log the error
    // In a production environment, you might want to throw the error instead
    return mdcData as MdcContent;
  }
}

/**
 * Validate MDC content against Zod schema
 * @param content MDC content to validate
 * @returns Validation result with success flag and errors if any
 */
export function validateMdcContent(content: any) {
  const result = mdcContentSchema.safeParse(content);
  
  if (result.success) {
    return { valid: true, data: result.data };
  } else {
    return { 
      valid: false, 
      errors: result.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    };
  }
}

/**
 * Check if a rule is compatible with the given environment
 * @param rule MDC content of the rule
 * @param environment Environment to check compatibility with
 * @returns Compatibility result with details
 */
export function checkRuleCompatibility(
  rule: MdcContent, 
  environment: { 
    ide?: string; 
    aiAssistant?: string; 
    frameworks?: string[];
    mcpDatabases?: string[];
  }
) {
  const compatibility = rule.compatibility;
  const results = {
    compatible: true,
    reasons: [] as string[]
  };
  
  // Check IDE compatibility
  if (environment.ide && compatibility.ides && compatibility.ides.length > 0) {
    if (!compatibility.ides.includes(environment.ide)) {
      results.compatible = false;
      results.reasons.push(`Rule is not compatible with IDE: ${environment.ide}`);
    }
  }
  
  // Check AI Assistant compatibility
  if (environment.aiAssistant && compatibility.aiAssistants && compatibility.aiAssistants.length > 0) {
    if (!compatibility.aiAssistants.includes(environment.aiAssistant)) {
      results.compatible = false;
      results.reasons.push(`Rule is not compatible with AI assistant: ${environment.aiAssistant}`);
    }
  }
  
  // Check framework compatibility
  if (environment.frameworks && environment.frameworks.length > 0 && 
      compatibility.frameworks && compatibility.frameworks.length > 0) {
    const hasCompatibleFramework = environment.frameworks.some(framework => 
      compatibility.frameworks!.includes(framework)
    );
    
    if (!hasCompatibleFramework) {
      results.compatible = false;
      results.reasons.push(`Rule is not compatible with frameworks: ${environment.frameworks.join(', ')}`);
    }
  }
  
  // Check MCP server compatibility
  if (environment.mcpDatabases && environment.mcpDatabases.length > 0 && 
      compatibility.mcpDatabases && compatibility.mcpDatabases.length > 0) {
    const hasCompatibleDatabase = environment.mcpDatabases.some(server => 
      compatibility.mcpDatabases!.includes(server)
    );
    
    if (!hasCompatibleDatabase) {
      results.compatible = false;
      results.reasons.push(`Rule is not compatible with MCP servers: ${environment.mcpDatabases.join(', ')}`);
    }
  }
  
  return results;
}

/**
 * Generate a slug from a file path
 * @param path Repository file path
 */
export function slugifyPath(path: string): string {
  // Remove file extension and directory path
  const filename = path.split('/').pop() || '';
  const nameWithoutExtension = filename.replace(/\.(mdc|md)$/, '');

  // Convert to kebab-case
  return nameWithoutExtension
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
}

/**
 * Extract category from path
 * @param path Repository file path
 */
export function extractCategoryFromPath(path: string): string | null {
  const parts = path.split('/');

  // Match directory structure: .ai/rules/[category]/[file].mdc
  // Examples from provided structure:
  // .ai/rules/languages/TypeScript5.mdc
  // .ai/rules/stacks/NextJS-Enterprise-Stack.mdc
  // .ai/rules/tasks/Generate-Types.mdc
  
  // First find the .ai directory
  const aiIndex = parts.findIndex(part => part === '.ai' || part.startsWith('.ai'));
  if (aiIndex === -1) return null;
  
  // Check if we have rules directory after .ai
  if (aiIndex + 1 < parts.length && parts[aiIndex + 1] === 'rules') {
    // Return the category (third level)
    if (aiIndex + 2 < parts.length) {
      return parts[aiIndex + 2];
    }
  }
  
  // Handle top-level rules that are directly in .ai/rules/
  // For example, .ai/rules/00-core-agent.mdc
  if (aiIndex + 1 < parts.length && parts[aiIndex + 1] === 'rules' && 
      aiIndex + 2 < parts.length && !parts[aiIndex + 3]) {
    return 'core'; // Core category for top-level rules
  }

  return null;
}
