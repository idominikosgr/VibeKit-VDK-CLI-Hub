// Common type definitions for the application - FIXED SCHEMA ALIGNMENT
import z from 'zod';
import { Database } from './supabase/database.types';

// Database row types from Supabase (these use snake_case as per DB schema)
export type DatabaseRule = Database['public']['Tables']['rules']['Row'];
export type DatabaseCategory = Database['public']['Tables']['categories']['Row'];
export type DatabaseCollection = Database['public']['Tables']['collections']['Row'];
export type DatabaseProfile = Database['public']['Tables']['profiles']['Row'];
export type DatabaseWizardConfiguration = Database['public']['Tables']['wizard_configurations']['Row'];
export type DatabaseGeneratedPackage = Database['public']['Tables']['generated_packages']['Row'];

// Application types - ALIGNED WITH DATABASE SCHEMA (using snake_case for DB fields)
export interface Rule {
  // Core identifiers (matching DB exactly)
  id: string;
  title: string;
  slug: string;
  path: string;
  content: string;
  description: string;
  version: string;
  
  // Foreign keys and references (DB uses snake_case)
  category_id: string;
  
  // Computed/joined fields (camelCase as they're not DB fields)
  categoryName?: string;
  categorySlug?: string;
  
  // Nullable fields (matching DB schema exactly)
  tags: string[] | null;
  globs: string[] | null;
  downloads: number | null;
  votes: number | null;
  compatibility: {
    ides?: string[];
    aiAssistants?: string[];
    frameworks?: string[];
    mcpDatabases?: string[];
  } | null;
  examples: Record<string, any> | null;
  always_apply: boolean | null;
  
  // Timestamps (DB uses snake_case)
  last_updated: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Pagination types (these are application-level, so camelCase is fine)
export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: Pagination;
}

// Category type - ALIGNED WITH DATABASE SCHEMA
export interface RuleCategory {
  // Core DB fields (snake_case)
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  order_index: number | null;
  parent_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  
  // Computed fields (camelCase as they're not DB fields)
  title?: string; // Maps to name for UI compatibility
  count?: number;
}

// MagnifyingGlass result type (application-level)
export interface MagnifyingGlassResult {
  id: string;
  title: string;
  path: string;
  content: string;
  category_id: string;  // Matching DB field name
  category: string;     // Computed field
  tags: string[] | null;
  excerpt: string;
}

// User profile type - ALIGNED WITH DATABASE SCHEMA AND APP USAGE
// Note: Uses snake_case to match database fields and consistent app usage
export interface User {
  // Core fields
  id: string;
  email: string;
  name: string | null;
  
  // Database fields (snake_case)
  github_username: string | null;
  avatar_url: string | null;
  preferred_language: string | null;
  preferred_theme: string | null;
  
  // Timestamps
  created_at: string | null;
  updated_at: string | null;
}

// Collection type - ALIGNED WITH DATABASE SCHEMA
export interface Collection {
  // Core DB fields (snake_case)
  id: string;
  name: string;
  description: string;
  user_id: string | null;
  is_public: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  
  // Computed field (camelCase as it's not a DB field)
  rules?: Rule[];
}

// User preferences (application-level, can use camelCase)
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  codeTheme: 'github' | 'vscode' | 'atom';
  fontSize: 'sm' | 'md' | 'lg';
  preferredLanguage?: string;
}

// Wizard Configuration - ALIGNED WITH DATABASE SCHEMA
export interface WizardConfiguration {
  // Core DB fields (snake_case)
  id: string;
  user_id: string | null;
  session_id: string | null;
  stack_choices: Record<string, any>;      // JSONB field
  language_choices: Record<string, any>;   // JSONB field
  tool_preferences: Record<string, any>;   // JSONB field
  environment_details: Record<string, any>; // JSONB field
  output_format: string | null;
  custom_requirements: string | null;
  generated_rules: string[] | null;
  generation_timestamp: string | null;
  created_at: string | null;
}

// Generated Package - ALIGNED WITH DATABASE SCHEMA
export interface GeneratedPackage {
  // Core DB fields (snake_case)
  id: string;
  configuration_id: string | null;
  package_type: string;
  download_url: string | null;
  file_size: number | null;
  rule_count: number | null;
  download_count: number | null;
  expires_at: string | null;
  created_at: string | null;
}

// Form schemas (application-level, can use camelCase for form data)
export const setupFormSchema = z.object({
  languages: z.array(z.string()).min(1, "Select at least one programming language"),
  aiAssistants: z.array(z.string()).min(1, "Select at least one AI assistant"),
  frameworks: z.array(z.string()).optional(),
  options: z.object({
    includeComments: z.boolean().default(true),
    strictMode: z.boolean().default(false),
    generateReadme: z.boolean().default(true)
  })
});

export type SetupFormValues = z.infer<typeof setupFormSchema>;

// Utility type for converting snake_case DB fields to camelCase for forms
export type CamelCaseRule = {
  id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  category_id: string;  // camelCase for forms
  tags: string[];
  compatibility?: {
    ides?: string[];
    aiAssistants?: string[];
    frameworks?: string[];
  };
  alwaysApply?: boolean;  // camelCase for forms
};

// Helper type for rule creation/updates (form data)
export interface RuleFormData {
  title: string;
  content: string;
  category_id: string;  // Form uses camelCase
  tags?: string[];
  compatibility?: {
    ides?: string[];
    aiAssistants?: string[];
    frameworks?: string[];
  };
  alwaysApply?: boolean;  // Form uses camelCase
}

// Database insert/update types (these should match DB schema exactly)
export interface RuleInsertData {
  id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  path: string;
  category_id: string;     // DB field
  version: string;
  tags: string[] | null;
  globs: string[] | null;
  compatibility: Record<string, any> | null;
  examples: Record<string, any> | null;
  always_apply: boolean | null;  // DB field
}

export interface RuleUpdateData extends Partial<RuleInsertData> {
  updated_at?: string;  // DB field
  last_updated?: string;  // DB field
}