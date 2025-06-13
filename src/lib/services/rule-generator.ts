/**
 * Rule Generation Engine - FIXED SCHEMA ALIGNMENT
 * Core business logic for matching rules based on wizard configuration
 * and generating tailored packages from general to specific rules
 */

import { createDatabaseSupabaseClient } from '../supabase/server-client';
import { Database } from '../supabase/database.types';
import { WizardConfiguration, GeneratedPackage } from '../types';
import crypto from 'crypto';

type SupabaseClient = Awaited<ReturnType<typeof createDatabaseSupabaseClient>>;
type Tables = Database['public']['Tables'];
type DbRule = Tables['rules']['Row'];

// Application-level interface for wizard configuration (can use camelCase for forms)
export interface WizardConfigurationInput {
  id?: string;
  userId?: string;
  sessionId?: string;
  stackChoices: Record<string, any>; // React, Vue, Angular, etc.
  languageChoices: Record<string, any>; // TypeScript, JavaScript, etc.
  toolPreferences: Record<string, any>; // ESLint, Prettier, etc.
  environmentDetails: Record<string, any>; // Node version, package manager
  outputFormat: 'bash' | 'zip' | 'config';
  customRequirements?: string;
}

// Use the imported database type instead of custom interface
export type WizardConfigurationDb = WizardConfiguration;

// Application-level package interface (camelCase for API responses)
export interface GeneratedPackageOutput {
  id: string;
  configurationId: string | null;
  packageType: string;
  downloadUrl?: string | null;
  fileSize: number | null;
  ruleCount: number | null;
  downloadCount: number | null;
  expiresAt?: string | null;
  createdAt: string | null;
}

/**
 * Convert database GeneratedPackage to application GeneratedPackageOutput
 * Maps snake_case database fields to camelCase application fields
 */
function mapGeneratedPackageToOutput(dbPackage: GeneratedPackage): GeneratedPackageOutput {
  return {
    id: dbPackage.id,
    configurationId: dbPackage.configuration_id,
    packageType: dbPackage.package_type,
    downloadUrl: dbPackage.download_url,
    fileSize: dbPackage.file_size,
    ruleCount: dbPackage.rule_count,
    downloadCount: dbPackage.download_count,
    expiresAt: dbPackage.expires_at,
    createdAt: dbPackage.created_at,
  };
}

/**
 * Convert application WizardConfigurationInput to database insert format
 * Maps camelCase application fields to snake_case database fields
 */
function mapWizardConfigToDbInsert(config: WizardConfigurationInput): Omit<WizardConfiguration, 'id' | 'created_at'> {
  return {
    user_id: config.userId || null,
    session_id: config.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    stack_choices: config.stackChoices,
    language_choices: config.languageChoices,
    tool_preferences: config.toolPreferences,
    environment_details: config.environmentDetails,
    output_format: config.outputFormat,
    custom_requirements: config.customRequirements || null,
    generated_rules: null, // Will be populated after generation
    generation_timestamp: new Date().toISOString(),
  };
}

// Add a type for the partial rule data returned by our specific query
interface PartialRuleForMatching {
  id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[] | null;
  compatibility: any; // JSONB type from Supabase
  always_apply: boolean | null;
  rule_compatibility?: Array<{
    technology: string;
    version_pattern: string | null;
    compatibility_type: string | null;
  }>;
}

export interface MatchedRule {
  id: string;
  title: string;
  slug: string;
  content: string;
  level: 'general' | 'stack' | 'language' | 'environment';
  tags: string[] | null;
  compatibility: Record<string, any> | null;
  matchScore: number;
  matchReasons: string[];
  always_apply: boolean | null; // FIXED: Use snake_case to match DB
}

export class RuleGenerationEngine {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Generate a complete rule package based on wizard configuration
   */
  async generatePackage(config: WizardConfigurationInput): Promise<GeneratedPackageOutput> {
    try {
      // 1. FloppyDisk wizard configuration
      const configId = await this.saveWizardConfiguration(config);

      // 2. Get compatible rules based on configuration
      const matchedRules = await this.getCompatibleRules(config);

      // 3. Resolve rule dependencies and conflicts
      const resolvedRules = await this.resolveDependencies(matchedRules);

      // 4. Generate package content based on format
      const packageContent = await this.generatePackageContent(resolvedRules, config);

      // 5. Store generated package
      const packageRecord = await this.storeGeneratedPackage(
        configId,
        config.outputFormat,
        packageContent,
        resolvedRules
      );

      return packageRecord;
    } catch (error) {
      console.error('Error generating package:', error);
      throw new Error('Failed to generate rule package');
    }
  }

  /**
   * FloppyDisk wizard configuration to database
   * FIXED: Use correct database field names (snake_case) with proper type mapping
   */
  private async saveWizardConfiguration(config: WizardConfigurationInput): Promise<string> {
    const dbConfig = mapWizardConfigToDbInsert(config);
    
    const { data, error } = await this.supabase
      .from('wizard_configurations')
      .insert(dbConfig)
      .select('id')
      .single();

    if (error) {
      console.error('Error saving wizard configuration:', error);
      throw new Error('Failed to save configuration');
    }

    return data.id;
  }

  /**
   * Get rules compatible with the wizard configuration
   * FIXED: Properly handle nullable fields and correct field names
   */
  private async getCompatibleRules(config: WizardConfigurationInput): Promise<MatchedRule[]> {
    // Get all rules with their compatibility data
    const { data: rules, error } = await this.supabase
      .from('rules')
      .select(`
        id,
        title,
        slug,
        content,
        tags,
        compatibility,
        always_apply,
        rule_compatibility (
          technology,
          version_pattern,
          compatibility_type
        )
      `);

    if (error) {
      console.error('Error fetching rules:', error);
      throw new Error('Failed to fetch rules');
    }

    const matchedRules: MatchedRule[] = [];
    const selectedStacks = Object.keys(config.stackChoices).filter(key => config.stackChoices[key]);
    const selectedLanguages = Object.keys(config.languageChoices).filter(key => config.languageChoices[key]);
    const selectedTools = Object.keys(config.toolPreferences).filter(key => config.toolPreferences[key]);

    for (const rule of rules || []) {
      const matchResult = this.calculateRuleMatch(rule, {
        stacks: selectedStacks,
        languages: selectedLanguages,
        tools: selectedTools,
        environment: config.environmentDetails
      });

      if (matchResult.score > 0) {
        matchedRules.push({
          id: rule.id,
          title: rule.title,
          slug: rule.slug,
          content: rule.content,
          level: this.determineRuleLevel(rule, matchResult.reasons),
          tags: rule.tags, // Keep as nullable
          compatibility: rule.compatibility as Record<string, any> | null, // Proper type casting
          always_apply: rule.always_apply, // FIXED: Use snake_case field name
          matchScore: matchResult.score,
          matchReasons: matchResult.reasons
        });
      }
    }

    // Sort by match score (highest first) and rule level (general to specific)
    return matchedRules.sort((a, b) => {
      const levelOrder = { general: 0, stack: 1, language: 2, environment: 3 };
      const levelDiff = levelOrder[a.level] - levelOrder[b.level];
      return levelDiff !== 0 ? levelDiff : b.matchScore - a.matchScore;
    });
  }

  /**
   * Calculate how well a rule matches the user's configuration
   * FIXED: Use correct type for partial rule data
   */
  private calculateRuleMatch(
    rule: PartialRuleForMatching,
    userChoices: {
      stacks: string[];
      languages: string[];
      tools: string[];
      environment: Record<string, any>;
    }
  ): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // Check if rule has always_apply flag (FIXED: Use snake_case field name)
    if (rule.always_apply) {
      score += 0.5;
      reasons.push('Always applicable rule');
    }

    // Match against rule tags (handle nullable)
    const ruleTags = rule.tags || [];

    for (const tag of ruleTags) {
      const lowerTag = tag.toLowerCase();
      
      // Check stack matches with improved flexibility
      for (const stack of userChoices.stacks) {
        if (lowerTag.includes(stack.toLowerCase()) || 
            tag.toLowerCase().includes('react') ||
            tag.toLowerCase().includes('next')) {
          score += 1.0;
          reasons.push(`Matches stack: ${tag}`);
        }
      }
      
      // Check language matches with improved flexibility
      for (const lang of userChoices.languages) {
        if (lowerTag.includes(lang.toLowerCase()) ||
            tag.toLowerCase().includes('typescript') ||
            tag.toLowerCase().includes('ts')) {
          score += 1.0;
          reasons.push(`Matches language: ${tag}`);
        }
      }
      
      // Check tool matches
      for (const tool of userChoices.tools) {
        if (lowerTag.includes(tool.toLowerCase())) {
          score += 0.8;
          reasons.push(`Matches tool: ${tag}`);
        }
      }
    }

    // Match against compatibility object (handle nullable and type properly)
    const compatibility = rule.compatibility as Record<string, any> | null;
    
    if (compatibility?.frameworks) {
      for (const framework of compatibility.frameworks) {
        for (const stack of userChoices.stacks) {
          if (stack.toLowerCase().includes(framework.toLowerCase()) ||
              framework.toLowerCase().includes(stack.toLowerCase()) ||
              framework.toLowerCase().includes('react') ||
              framework.toLowerCase().includes('next')) {
            score += 1.2;
            reasons.push(`Compatible framework: ${framework}`);
          }
        }
      }
    }

    if (compatibility?.aiAssistants) {
      // Always include if it supports vibecoding or cascade
      if (compatibility.aiAssistants.includes('vibecoding') || 
          compatibility.aiAssistants.includes('cascade')) {
        score += 0.3;
        reasons.push('Compatible with AI assistant');
      }
    }

    return { score, reasons };
  }

  /**
   * Determine the rule level based on its content and match reasons
   * FIXED: Use correct type for partial rule data
   */
  private determineRuleLevel(rule: PartialRuleForMatching, matchReasons: string[]): 'general' | 'stack' | 'language' | 'environment' {
    const content = (rule.title + ' ' + rule.content + ' ' + (rule.tags || []).join(' ')).toLowerCase();
    
    // Check for environment-specific keywords
    if (content.includes('node') || content.includes('npm') || content.includes('docker') || 
        content.includes('env') || content.includes('config')) {
      return 'environment';
    }
    
    // Check for language-specific keywords
    if (content.includes('typescript') || content.includes('javascript') || 
        content.includes('python') || content.includes('java')) {
      return 'language';
    }
    
    // Check for stack-specific keywords
    if (content.includes('react') || content.includes('vue') || content.includes('angular') ||
        content.includes('next') || content.includes('nuxt')) {
      return 'stack';
    }
    
    // Default to general
    return 'general';
  }

  /**
   * Resolve rule dependencies and conflicts
   */
  private async resolveDependencies(rules: MatchedRule[]): Promise<MatchedRule[]> {
    // Get rule dependencies
    const ruleIds = rules.map(r => r.id);
    const { data: dependencies, error } = await this.supabase
      .from('rule_dependencies')
      .select('*')
      .in('rule_id', ruleIds);

    if (error) {
      console.warn('Error fetching dependencies:', error);
      return rules; // Continue without dependency resolution
    }

    const resolvedRules = [...rules];
    const conflictedRules = new Set<string>();

    // Handle conflicts
    for (const dep of dependencies || []) {
      if (dep.dependency_type === 'conflicts') {
        const hasConflictingRule = rules.some(r => r.id === dep.depends_on_rule_id);
        if (hasConflictingRule) {
          // Remove lower-scored rule in conflict
          const rule1 = rules.find(r => r.id === dep.rule_id);
          const rule2 = rules.find(r => r.id === dep.depends_on_rule_id);
          
          if (rule1 && rule2) {
            const toRemove = rule1.matchScore < rule2.matchScore ? rule1.id : rule2.id;
            conflictedRules.add(toRemove);
          }
        }
      }
    }

    // Remove conflicted rules
    return resolvedRules.filter(rule => !conflictedRules.has(rule.id));
  }

  /**
   * Generate package content based on format and target IDE/AI assistant
   */
  private async generatePackageContent(
    rules: MatchedRule[],
    config: WizardConfigurationInput
  ): Promise<Buffer | string> {
    const targetIde = config.environmentDetails.targetIde || 'general';
    const targetAI = config.environmentDetails.targetAI || 'general';

    switch (config.outputFormat) {
      case 'bash':
        return this.generateBashScript(rules, config, targetIde);
      case 'zip':
        return this.generateZipArchive(rules, config, targetIde, targetAI);
      case 'config':
        return this.generateConfigFiles(rules, config, targetIde);
      default:
        throw new Error(`Unsupported output format: ${config.outputFormat}`);
    }
  }

  /**
   * Generate bash script with IDE-specific setup
   */
  private generateBashScript(rules: MatchedRule[], config: WizardConfigurationInput, targetIde: string): string {
    let script = `#!/bin/bash
# Generated by Vibe Coding Rules Hub
# Target IDE: ${targetIde}
# Configuration: ${JSON.stringify(config.stackChoices, null, 2)}
# Generated: ${new Date().toISOString()}

set -e

echo "🚀 Vibe Coding Rules Setup Script"
echo "=============================="
echo "Target IDE: ${targetIde}"

`;

    // IDE-specific directory setup
    const rulesDirSetup = this.getIDESpecificSetup(targetIde);
    script += rulesDirSetup;

    // Group rules by level
    const rulesByLevel = this.groupRulesByLevel(rules);

    for (const [level, levelRules] of Object.entries(rulesByLevel)) {
      script += `\n# ${level.toUpperCase()} RULES\n`;
      script += `echo "📋 Applying ${level} rules..."\n\n`;

      for (const rule of levelRules) {
        script += `# Rule: ${rule.title}\n`;
        script += `echo "  - ${rule.title}"\n`;
        
        // Generate IDE-specific rule file
        const ruleContent = this.convertRuleForIDE(rule, targetIde);
        const { fileName, filePath } = this.getIDESpecificPaths(rule, targetIde);
        
        script += `# Create rule file: ${fileName}\n`;
        script += `cat > ${filePath} << 'EOF'\n`;
        script += ruleContent;
        script += `\nEOF\n\n`;
        
        // Extract and execute actionable commands from rule content
        const commands = this.extractBashCommands(rule.content);
        if (commands.length > 0) {
          script += `# Execute commands from rule\n`;
          for (const command of commands) {
            script += `${command}\n`;
          }
        }
        
        script += '\n';
      }
    }

    script += `\necho "✅ Setup completed successfully!"\n`;
    script += `echo "📝 Applied ${rules.length} rules for ${targetIde}"\n`;

    return script;
  }

  /**
   * Get IDE-specific directory setup commands
   */
  private getIDESpecificSetup(targetIde: string): string {
    switch (targetIde.toLowerCase()) {
      case 'cursor':
        return `
# Create Cursor-specific directories
RULES_DIR=".ai/rules"
mkdir -p "$RULES_DIR"/{assistants,languages,stacks,tasks,technologies,tools}
echo "📁 Setting up Cursor .ai/rules directory structure..."

`;
      
      case 'vscode':
        return `
# Create VS Code-specific directories
RULES_DIR=".vscode/ai-rules"
mkdir -p "$RULES_DIR"/{assistants,languages,stacks,tasks,technologies,tools}
echo "📁 Setting up VS Code .vscode/ai-rules directory structure..."

`;
      
      case 'webstorm':
      case 'intellij':
        return `
# Create JetBrains IDE-specific directories
RULES_DIR=".idea/ai-rules"
mkdir -p "$RULES_DIR"/{assistants,languages,stacks,tasks,technologies,tools}
echo "📁 Setting up JetBrains .idea/ai-rules directory structure..."

`;
      
      default:
        return `
# Create general coding rules directory
RULES_DIR="docs/coding-rules"
mkdir -p "$RULES_DIR"/{assistants,languages,stacks,tasks,technologies,tools}
echo "📁 Setting up general docs/coding-rules directory structure..."

`;
    }
  }

  /**
   * Convert rule content for specific IDE format
   */
  private convertRuleForIDE(rule: MatchedRule, targetIde: string): string {
    const metadata = this.extractRuleMetadata(rule);
    
    switch (targetIde.toLowerCase()) {
      case 'cursor':
        // Convert to .mdc format for Cursor
        return `---
description: "${metadata.description}"
globs: ${JSON.stringify(metadata.globs || [])}
alwaysApply: ${metadata.alwaysApply || false}
version: "${metadata.version || '1.0.0'}"
lastUpdated: "${new Date().toISOString()}"
compatibleWith: ${JSON.stringify(metadata.frameworks || [])}
---

${rule.content}`;
      
      case 'vscode':
        // Standard markdown with VS Code specific instructions
        return `---
title: "${rule.title}"
description: "${metadata.description}"
tags: ${JSON.stringify(rule.tags || [])}
compatibility:
  ides: ["vscode"]
  frameworks: ${JSON.stringify(metadata.frameworks || [])}
version: "${metadata.version || '1.0.0'}"
---

# ${rule.title}

> **VS Code Integration**: This rule can be applied using GitHub Copilot, Codewhisperer, or other VS Code AI extensions.

${rule.content}

## VS Code Setup

1. FloppyDisk this file in \`.vscode/ai-rules/\`
2. Reference in your AI prompts or workspace settings
3. Use with VS Code AI extensions for consistent code generation`;
      
      default:
        // Standard markdown format
        return `---
title: "${rule.title}"
description: "${metadata.description}"
tags: ${JSON.stringify(rule.tags || [])}
compatibility: ${JSON.stringify(rule.compatibility || {})}
version: "${metadata.version || '1.0.0'}"
---

# ${rule.title}

${rule.content}`;
    }
  }

  /**
   * Get IDE-specific file paths and names
   */
  private getIDESpecificPaths(rule: MatchedRule, targetIde: string): { fileName: string; filePath: string } {
    const category = this.extractRuleCategoryFromTags(rule.tags);
    const baseFileName = this.generateBeautifulFileName(rule);
    
    switch (targetIde.toLowerCase()) {
      case 'cursor':
        const mdcFileName = `${baseFileName}.mdc`;
        const mdcPath = category ? `"$RULES_DIR/${category}/${mdcFileName}"` : `"$RULES_DIR/${mdcFileName}"`;
        return { fileName: mdcFileName, filePath: mdcPath };
      
      case 'vscode':
        const vscodeFileName = `${baseFileName}.md`;
        const vscodePath = category ? `"$RULES_DIR/${category}/${vscodeFileName}"` : `"$RULES_DIR/${vscodeFileName}"`;
        return { fileName: vscodeFileName, filePath: vscodePath };
      
      default:
        const defaultFileName = `${baseFileName}.md`;
        const defaultPath = category ? `"$RULES_DIR/${category}/${defaultFileName}"` : `"$RULES_DIR/${defaultFileName}"`;
        return { fileName: defaultFileName, filePath: defaultPath };
    }
  }

  /**
   * Extract metadata from rule for format conversion
   */
  private extractRuleMetadata(rule: MatchedRule): any {
    return {
      description: rule.title,
      globs: rule.compatibility?.globs || [],
      alwaysApply: rule.always_apply || false,
      version: "1.0.0",
      frameworks: rule.compatibility?.frameworks || [],
      ides: rule.compatibility?.ides || [],
      aiAssistants: rule.compatibility?.aiAssistants || []
    };
  }

  /**
   * Generate zip archive from rules with actual file structure
   */
  private async generateZipArchive(rules: MatchedRule[], config: WizardConfigurationInput, targetIde: string, targetAI: string): Promise<Buffer> {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Create directory structure
    const rulesFolder = zip.folder('.ai/rules');
    const assistantsFolder = rulesFolder?.folder('assistants');
    const languagesFolder = rulesFolder?.folder('languages');
    const stacksFolder = rulesFolder?.folder('stacks');
    const tasksFolder = rulesFolder?.folder('tasks');
    const technologiesFolder = rulesFolder?.folder('technologies');
    const toolsFolder = rulesFolder?.folder('tools');

    // Add configuration file
            zip.file('vibe-coding-rules-config.json', JSON.stringify({
      configuration: config,
      generatedAt: new Date().toISOString(),
      rulesIncluded: rules.map(r => r.id),
      instructions: `
# Vibe Coding Rules Setup

This package contains ${rules.length} rules customized for your project.

## Installation

1. Extract this archive to your project root
2. The rules will be available in .ai/rules/
3. Configuration files are in the root directory
4. Follow the setup instructions in SETUP.md

## Usage

The rules are organized by category:
- assistants/ - AI assistant optimization rules
- languages/ - Programming language specific rules  
- stacks/ - Technology stack rules
- tasks/ - Development task rules
- technologies/ - Framework and technology rules
- tools/ - Development tool rules
      `.trim()
    }, null, 2));

    // Add setup instructions
    zip.file('SETUP.md', this.generateSetupInstructions(rules, config));

    // Group rules by category and add them to appropriate folders
    for (const rule of rules) {
      const category = this.extractRuleCategoryFromTags(rule.tags);
      const fileName = `${this.generateBeautifulFileName(rule)}.mdc`;
      
      const ruleContent = `# ${rule.title}

${rule.content}

## Metadata
- Category: ${category || 'general'}
- Tags: ${rule.tags ? rule.tags.join(', ') : 'none'}
- Always Apply: ${rule.always_apply ? 'Yes' : 'No'}
- Match Score: ${rule.matchScore.toFixed(2)}
`;

      switch (category) {
        case 'assistants':
          assistantsFolder?.file(fileName, ruleContent);
          break;
        case 'languages':
          languagesFolder?.file(fileName, ruleContent);
          break;
        case 'stacks':
          stacksFolder?.file(fileName, ruleContent);
          break;
        case 'tasks':
          tasksFolder?.file(fileName, ruleContent);
          break;
        case 'technologies':
          technologiesFolder?.file(fileName, ruleContent);
          break;
        case 'tools':
          toolsFolder?.file(fileName, ruleContent);
          break;
        default:
          rulesFolder?.file(fileName, ruleContent);
      }
    }

    // Extract and add configuration files to root
    const allConfigFiles = new Map<string, string>();
    for (const rule of rules) {
      const configFiles = this.extractConfigurationFiles(rule.content);
      for (const [fileName, content] of Object.entries(configFiles)) {
        if (allConfigFiles.has(fileName)) {
          // Merge configs if same filename
          allConfigFiles.set(fileName, this.mergeConfigurationFiles(allConfigFiles.get(fileName)!, content, fileName));
        } else {
          allConfigFiles.set(fileName, content);
        }
      }
    }

    // Add merged configuration files to ZIP root
    for (const [fileName, content] of Array.from(allConfigFiles.entries())) {
      zip.file(fileName, content);
    }

    return await zip.generateAsync({ type: 'nodebuffer' });
  }

  /**
   * Generate configuration files from rules
   */
  private generateConfigFiles(rules: MatchedRule[], config: WizardConfigurationInput, targetIde: string): string {
    const configFiles: Record<string, any> = {};

    // Extract configuration from rules
    for (const rule of rules) {
      if (rule.content.includes('package.json')) {
        configFiles.packageJson = this.extractPackageJsonConfig(rule.content);
      }
      if (rule.content.includes('tsconfig.json')) {
        configFiles.tsConfig = this.extractTsConfig(rule.content);
      }
      if (rule.content.includes('.eslintrc')) {
        configFiles.eslintConfig = this.extractEslintConfig(rule.content);
      }
    }

    return JSON.stringify({
      configuration: config,
      configFiles,
      generatedAt: new Date().toISOString(),
      appliedRules: rules.map(r => ({ 
        id: r.id, 
        title: r.title, 
        level: r.level,
        alwaysApply: r.always_apply // FIXED: Use correct field name
      })),
      targetIde
    }, null, 2);
  }

  /**
   * Store generated package in database
   * FIXED: Use correct database field names and handle nullable fields
   * NOW: Actually uploads files to storage
   */
  private async storeGeneratedPackage(
    configurationId: string,
    packageType: string,
    content: Buffer | string,
    rules: MatchedRule[]
  ): Promise<GeneratedPackageOutput> {
    const contentBuffer = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf-8');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expire in 7 days

    // Generate a unique package ID
    const packageId = crypto.randomUUID();

    // Upload the file to storage
    let downloadUrl: string | null = null;
    try {
      // Import storage service
      const { createStorageService } = await import('./storage/supabase-storage-provider');
      const storageService = await createStorageService();
      
      // Upload the package file
      const uploadResult = await storageService.uploadPackage(packageId, contentBuffer, packageType);
      downloadUrl = uploadResult.publicUrl;
    } catch (storageError) {
      console.error('Error uploading to storage:', storageError);
      // Continue without storage URL - package can still be generated inline
    }

    // Use correct database field names (snake_case) with proper typing
    const { data, error } = await this.supabase
      .from('generated_packages')
      .insert({
        id: packageId, // Use our generated ID
        configuration_id: configurationId,
        package_type: packageType,
        download_url: downloadUrl,
        file_size: contentBuffer.length,
        rule_count: rules.length,
        expires_at: expiresAt.toISOString(),
        download_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing package:', error);
      throw new Error('Failed to store package');
    }

    // Convert database record to application output using helper function
    return mapGeneratedPackageToOutput(data as GeneratedPackage);
  }

  /**
   * Helper methods for content extraction
   */
  private groupRulesByLevel(rules: MatchedRule[]): Record<string, MatchedRule[]> {
    return rules.reduce((acc, rule) => {
      if (!acc[rule.level]) acc[rule.level] = [];
      acc[rule.level].push(rule);
      return acc;
    }, {} as Record<string, MatchedRule[]>);
  }

  private extractBashCommands(content: string): string[] {
    const commands: string[] = [];
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBlockType = '';
    
    for (const line of lines) {
      // Check for code block start/end
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          // Starting a code block
          inCodeBlock = true;
          codeBlockType = line.trim().substring(3).toLowerCase();
        } else {
          // Ending a code block
          inCodeBlock = false;
          codeBlockType = '';
        }
        continue;
      }
      
      // If we're in a bash/shell code block, extract commands
      if (inCodeBlock && (codeBlockType === 'bash' || codeBlockType === 'shell' || codeBlockType === 'sh')) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          commands.push(trimmedLine);
        }
        continue;
      }
      
      // Look for direct command lines outside code blocks
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('npm ') || 
          trimmedLine.startsWith('yarn ') ||
          trimmedLine.startsWith('pnpm ') ||
          trimmedLine.startsWith('mkdir ') ||
          trimmedLine.startsWith('touch ') ||
          trimmedLine.startsWith('echo ')) {
        commands.push(trimmedLine);
      }
    }
    
    return commands;
  }

  private extractPackageJsonConfig(content: string): any {
    // Extract package.json configuration from rule content
    try {
      const match = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) {
        return JSON.parse(match[1]);
      }
    } catch (error) {
      console.warn('Error extracting package.json config:', error);
    }
    return {};
  }

  private extractTsConfig(content: string): any {
    // Extract TypeScript configuration from rule content
    try {
      const match = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (match && match[1].includes('compilerOptions')) {
        return JSON.parse(match[1]);
      }
    } catch (error) {
      console.warn('Error extracting tsconfig:', error);
    }
    return {};
  }

  private extractEslintConfig(content: string): any {
    // Extract ESLint configuration from rule content
    try {
      const match = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (match && match[1].includes('rules')) {
        return JSON.parse(match[1]);
      }
    } catch (error) {
      console.warn('Error extracting eslint config:', error);
    }
    return {};
  }

  private extractRuleCategoryFromTags(tags: string[] | null): string | null {
    if (!tags || tags.length === 0) return null;
    const lowerTags = tags.map(tag => tag.toLowerCase());
    if (lowerTags.includes('ai assistant') || lowerTags.includes('ai-assistant')) return 'assistants';
    if (lowerTags.includes('language') || lowerTags.includes('languages')) return 'languages';
    if (lowerTags.includes('stack') || lowerTags.includes('stacks')) return 'stacks';
    if (lowerTags.includes('task') || lowerTags.includes('tasks')) return 'tasks';
    if (lowerTags.includes('technology') || lowerTags.includes('technologies')) return 'technologies';
    if (lowerTags.includes('tool') || lowerTags.includes('tools')) return 'tools';
    return null;
  }

  private extractConfigurationFiles(content: string): Record<string, string> {
    const configFiles: Record<string, string> = {};
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBlockType = '';
    let currentFileName = '';
    let currentFileContent: string[] = [];
    
    for (const line of lines) {
      // Check for code block start/end
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          // Starting a code block
          inCodeBlock = true;
          const blockInfo = line.trim().substring(3);
          
          // Check if this is a file (has extension or known config file name)
          if (blockInfo.includes('.') || 
              ['package.json', 'tsconfig.json', '.eslintrc', '.prettierrc', 'Dockerfile', 'docker-compose.yml'].includes(blockInfo)) {
            codeBlockType = 'file';
            currentFileName = blockInfo;
            currentFileContent = [];
          } else {
            codeBlockType = blockInfo.toLowerCase();
          }
        } else {
          // Ending a code block
          if (codeBlockType === 'file' && currentFileName && currentFileContent.length > 0) {
            configFiles[currentFileName] = currentFileContent.join('\n');
          }
          inCodeBlock = false;
          codeBlockType = '';
          currentFileName = '';
          currentFileContent = [];
        }
        continue;
      }
      
      // If we're in a file code block, collect content
      if (inCodeBlock && codeBlockType === 'file') {
        currentFileContent.push(line);
      }
    }
    
    return configFiles;
  }

  private generateSetupInstructions(rules: MatchedRule[], config: WizardConfigurationInput): string {
    return `
# Vibe Coding Rules Setup

This package contains ${rules.length} rules customized for your project.

## Installation

1. Extract this archive to your project root
2. The rules will be available in .ai/rules/
3. Configuration files are in the root directory
4. Follow the setup instructions in SETUP.md

## Usage

The rules are organized by category:
- assistants/ - AI assistant optimization rules
- languages/ - Programming language specific rules  
- stacks/ - Technology stack rules
- tasks/ - Development task rules
- technologies/ - Framework and technology rules
- tools/ - Development tool rules
    `.trim();
  }

  private mergeConfigurationFiles(existing: string, newContent: string, fileName: string): string {
    const existingConfig = JSON.parse(existing);
    const newConfig = JSON.parse(newContent);
    return JSON.stringify({
      ...existingConfig,
      ...newConfig
    }, null, 2);
  }

  /**
   * Generate a beautiful, human-readable filename from rule data
   * Prioritizes slug, falls back to title-based generation, includes ID as suffix for uniqueness
   */
  private generateBeautifulFileName(rule: MatchedRule): string {
    // First try to use the slug if it's available and meaningful
    if (rule.slug && rule.slug !== rule.id && rule.slug.length > 0) {
      return rule.slug;
    }
    
    // Fall back to generating from title
    let fileName = rule.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .slice(0, 50); // Limit length
    
    // If the generated name is too short or empty, use a fallback
    if (fileName.length < 3) {
      fileName = 'rule';
    }
    
    // Add a short suffix of the ID to ensure uniqueness
    const idSuffix = rule.id.toString().slice(-6); // Last 6 characters of ID
    fileName = `${fileName}-${idSuffix}`;
    
    return fileName;
  }
}

export default RuleGenerationEngine;