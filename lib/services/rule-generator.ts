/**
 * Rule Generation Engine - FIXED SCHEMA ALIGNMENT
 * Core business logic for matching rules based on wizard configuration
 * and generating tailored packages from general to specific rules
 */

import { createServerSupabaseClient } from '../supabase/server-client';
import { Database } from '../supabase/database.types';
import { WizardConfiguration, GeneratedPackage } from '../types';
import crypto from 'crypto';

type SupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;
type Tables = Database['public']['Tables'];
type DbRule = Tables['rules']['Row'];
type DbWizardConfig = Tables['wizard_configurations']['Row'];
type DbGeneratedPackage = Tables['generated_packages']['Row'];

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

// Database-aligned configuration (snake_case fields)
export interface WizardConfigurationDb {
  id?: string;
  user_id?: string | null;
  session_id?: string | null;
  stack_choices: Record<string, any>;
  language_choices: Record<string, any>;
  tool_preferences: Record<string, any>;
  environment_details: Record<string, any>;
  output_format: string | null;
  custom_requirements?: string | null;
  generated_rules?: string[] | null;
  generation_timestamp?: string | null;
  created_at?: string | null;
}

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

export interface MatchedRule {
  id: string;
  title: string;
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
      // 1. Save wizard configuration
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
   * Save wizard configuration to database
   * FIXED: Use correct database field names (snake_case)
   */
  private async saveWizardConfiguration(config: WizardConfigurationInput): Promise<string> {
    const { data, error } = await this.supabase
      .from('wizard_configurations')
      .insert({
        user_id: config.userId || null,
        session_id: config.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        stack_choices: config.stackChoices,
        language_choices: config.languageChoices,
        tool_preferences: config.toolPreferences,
        environment_details: config.environmentDetails,
        output_format: config.outputFormat,
        custom_requirements: config.customRequirements || null,
        generation_timestamp: new Date().toISOString(),
      })
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
   * FIXED: Use correct field name and handle nullable types
   */
  private calculateRuleMatch(
    rule: DbRule,
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
      
      // Check stack matches
      if (userChoices.stacks.some(stack => lowerTag.includes(stack.toLowerCase()))) {
        score += 1.0;
        reasons.push(`Matches stack: ${tag}`);
      }
      
      // Check language matches
      if (userChoices.languages.some(lang => lowerTag.includes(lang.toLowerCase()))) {
        score += 1.0;
        reasons.push(`Matches language: ${tag}`);
      }
      
      // Check tool matches
      if (userChoices.tools.some(tool => lowerTag.includes(tool.toLowerCase()))) {
        score += 0.8;
        reasons.push(`Matches tool: ${tag}`);
      }
    }

    // Match against compatibility object (handle nullable and type properly)
    const compatibility = rule.compatibility as Record<string, any> | null;
    
    if (compatibility?.frameworks) {
      for (const framework of compatibility.frameworks) {
        if (userChoices.stacks.some(stack => 
          stack.toLowerCase().includes(framework.toLowerCase()) ||
          framework.toLowerCase().includes(stack.toLowerCase())
        )) {
          score += 1.2;
          reasons.push(`Compatible framework: ${framework}`);
        }
      }
    }

    if (compatibility?.aiAssistants) {
      // Always include if it supports codepilot or cascade
      if (compatibility.aiAssistants.includes('codepilot') || 
          compatibility.aiAssistants.includes('cascade')) {
        score += 0.3;
        reasons.push('Compatible with AI assistant');
      }
    }

    return { score, reasons };
  }

  /**
   * Determine the rule level based on its content and match reasons
   * FIXED: Handle nullable tags properly
   */
  private determineRuleLevel(rule: DbRule, matchReasons: string[]): 'general' | 'stack' | 'language' | 'environment' {
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
   * Generate package content based on format
   */
  private async generatePackageContent(
    rules: MatchedRule[],
    config: WizardConfigurationInput
  ): Promise<Buffer | string> {
    switch (config.outputFormat) {
      case 'bash':
        return this.generateBashScript(rules, config);
      case 'zip':
        return this.generateZipArchive(rules, config);
      case 'config':
        return this.generateConfigFiles(rules, config);
      default:
        throw new Error(`Unsupported output format: ${config.outputFormat}`);
    }
  }

  /**
   * Generate bash script from rules
   */
  private generateBashScript(rules: MatchedRule[], config: WizardConfigurationInput): string {
    let script = `#!/bin/bash
# Generated by CodePilotRules Hub
# Configuration: ${JSON.stringify(config.stackChoices, null, 2)}
# Generated: ${new Date().toISOString()}

set -e

echo "🚀 CodePilotRules Setup Script"
echo "=============================="

# Create rules directory structure
RULES_DIR=".ai/rules"
mkdir -p "$RULES_DIR"/{assistants,languages,stacks,tasks,technologies,tools}

echo "📁 Setting up CodePilotRules directory structure..."

`;

    // Group rules by level
    const rulesByLevel = this.groupRulesByLevel(rules);

    for (const [level, levelRules] of Object.entries(rulesByLevel)) {
      script += `\n# ${level.toUpperCase()} RULES\n`;
      script += `echo "📋 Applying ${level} rules..."\n\n`;

      for (const rule of levelRules) {
        script += `# Rule: ${rule.title}\n`;
        script += `echo "  - ${rule.title}"\n`;
        
        // Download the rule file to appropriate directory
        const ruleCategory = this.extractRuleCategoryFromTags(rule.tags);
        const ruleFileName = `${rule.id}.mdc`;
        const rulePath = ruleCategory ? `"$RULES_DIR/${ruleCategory}/${ruleFileName}"` : `"$RULES_DIR/${ruleFileName}"`;
        
        script += `# Download rule: ${rule.title}\n`;
        script += `cat > ${rulePath} << 'EOF'\n`;
        script += `# ${rule.title}\n\n`;
        script += `${rule.content}\n`;
        script += `EOF\n\n`;
        
        // Extract and execute actionable commands from rule content
        const commands = this.extractBashCommands(rule.content);
        if (commands.length > 0) {
          script += `# Execute commands from rule\n`;
          for (const command of commands) {
            script += `${command}\n`;
          }
        }

        // Extract and create configuration files
        const configFiles = this.extractConfigurationFiles(rule.content);
        for (const [fileName, fileContent] of Object.entries(configFiles)) {
          script += `# Create configuration file: ${fileName}\n`;
          script += `cat > "${fileName}" << 'EOF'\n`;
          script += `${fileContent}\n`;
          script += `EOF\n\n`;
        }
        
        script += '\n';
      }
    }

    script += `\necho "✅ Setup completed successfully!"\n`;
    script += `echo "📝 Applied ${rules.length} rules"\n`;
    script += `echo "📁 Rules available in .ai/rules directory"\n`;
    script += `echo "🔧 Configuration files created in project root"\n`;

    return script;
  }

  /**
   * Generate zip archive from rules with actual file structure
   */
  private async generateZipArchive(rules: MatchedRule[], config: WizardConfigurationInput): Promise<Buffer> {
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
    zip.file('codepilotrules-config.json', JSON.stringify({
      configuration: config,
      generatedAt: new Date().toISOString(),
      rulesIncluded: rules.map(r => r.id),
      instructions: `
# CodePilotRules Setup

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
      const fileName = `${rule.id}.mdc`;
      
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
  private generateConfigFiles(rules: MatchedRule[], config: WizardConfigurationInput): string {
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
      }))
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

    // Use correct database field names (snake_case)
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

    // Return application-level interface (camelCase) while keeping DB consistency
    return {
      id: data.id,
      configurationId: data.configuration_id,
      packageType: data.package_type,
      downloadUrl: data.download_url,
      fileSize: data.file_size,
      ruleCount: data.rule_count,
      downloadCount: data.download_count,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
    };
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
# CodePilotRules Setup

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
}

export default RuleGenerationEngine;