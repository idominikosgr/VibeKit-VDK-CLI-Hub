'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createDatabaseSupabaseClient } from '../supabase/server-client';
import { handleApiRequest } from '../error-handling';
import { getRule as getSupabaseRule } from '@/lib/services/supabase-rule-service';
import { Rule, RuleFormData, RuleInsertData } from '@/lib/types';

/**
 * Schema for rule form submission - FIXED TO HANDLE FORM DATA CORRECTLY
 */
const ruleFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  category_id: z.string().min(1, 'Category is required'), // Form uses camelCase
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  compatibility: z.object({
    ides: z.array(z.string()).optional(),
    aiAssistants: z.array(z.string()).optional(),
    frameworks: z.array(z.string()).optional(),
    mcpDatabases: z.array(z.string()).optional(),
  }).optional(),
  alwaysApply: z.boolean().optional(), // Form uses camelCase
});

/**
 * Transform form data (camelCase) to database data (snake_case)
 */
function transformFormDataToDbData(formData: RuleFormData, slug: string): RuleInsertData {
  return {
    id: `${Date.now()}-${slug}`,
    title: formData.title,
    slug,
    content: formData.content,
    description: formData.content.substring(0, 500), // Extract description from content
    path: `rules/${slug}`, // Required field
    category_id: formData.category_id, // Transform camelCase to snake_case
    version: '1.0.0',
    tags: formData.tags || null,
    globs: null,
    compatibility: formData.compatibility || null,
    examples: null,
    always_apply: formData.alwaysApply || null, // Transform camelCase to snake_case
  };
}

/**
 * Create or update a rule - ADMIN ONLY
 * FIXED: Proper field name handling and type safety
 */
export async function saveRule(formData: FormData) {
  const supabase = await createDatabaseSupabaseClient();

  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return { error: 'You must be logged in to create or update rules' };
  }

  // Check admin status using existing function
  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
  if (adminError || !isAdmin) {
    return { error: 'Admin access required for rule management' };
  }

  // Parse and validate form data
  const rawData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    category_id: formData.get('category_id') as string, // Form field is camelCase
    description: formData.get('description') as string || '',
    tags: JSON.parse(formData.get('tags') as string || '[]'),
    compatibility: JSON.parse(formData.get('compatibility') as string || '{}'),
    alwaysApply: formData.get('alwaysApply') === 'true', // Form field is camelCase
  };

  // Validate using schema
  const parsedData = ruleFormSchema.safeParse(rawData);
  if (!parsedData.success) {
    return {
      error: 'Validation failed',
      validationErrors: parsedData.error.flatten().fieldErrors
    };
  }

  const data = parsedData.data;
  const ruleId = formData.get('id') as string;

  // Generate a slug from title
  const slug = data.title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');

  try {
    // Transform to database format (snake_case fields)
    const dbData = transformFormDataToDbData(data, slug);

    // Check if we're updating or creating
    if (ruleId) {
      // Update existing rule - admin only, no ownership check needed
      const { error } = await supabase
        .from('rules')
        .update({
          title: dbData.title,
          content: dbData.content,
          description: dbData.description,
          category_id: dbData.category_id, // Use snake_case for DB
          tags: dbData.tags,
          compatibility: dbData.compatibility,
          always_apply: dbData.always_apply, // Use snake_case for DB
          slug: dbData.slug,
        })
        .eq('id', ruleId);

      if (error) throw error;

      revalidatePath(`/rules/${slug}`);
      redirect(`/rules/${slug}`);
    } else {
      // Create new rule
      const { error } = await supabase
        .from('rules')
        .insert(dbData);

      if (error) throw error;

      revalidatePath('/rules');
      redirect('/rules');
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving rule:', error);
    return { error: 'Failed to save rule. Please try again.' };
  }
}

/**
 * Delete a rule - ADMIN ONLY
 */
export async function deleteRule(formData: FormData) {
  const supabase = await createDatabaseSupabaseClient();

  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return { error: 'You must be logged in to delete rules' };
  }

  // Check admin status using existing function
  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
  if (adminError || !isAdmin) {
    return { error: 'Admin access required for rule deletion' };
  }

  const ruleId = formData.get('id') as string;

  try {
    // Admin can delete any rule
    const { error } = await supabase
      .from('rules')
      .delete()
      .eq('id', ruleId);

    if (error) throw error;

    revalidatePath('/rules');
    return { success: true };
  } catch (error) {
    console.error('Error deleting rule:', error);
    return { error: 'Failed to delete rule. Please try again.' };
  }
}

/**
 * Vote for a rule (toggle vote)
 * FIXED: Use correct table and field names
 */
export async function voteForRule(formData: FormData) {
  const supabase = await createDatabaseSupabaseClient();

  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return { error: 'You must be logged in to vote' };
  }

  const ruleId = formData.get('ruleId') as string;

  return handleApiRequest(async () => {
    // Check if user has already voted (using correct table and field names)
    const { data: existingVote, error: checkError } = await supabase
      .from('user_votes')
      .select('id')
      .eq('rule_id', ruleId) // DB uses snake_case
      .eq('user_id', session.user.id) // DB uses snake_case
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    // Toggle vote: if exists, remove; if not, add
    if (existingVote) {
      // Remove existing vote using RPC function
      await supabase.rpc('remove_rule_vote', { target_rule_id: ruleId });
    } else {
      // Add new vote using RPC function
      await supabase.rpc('vote_for_rule', { target_rule_id: ruleId });
    }

    // Get updated vote count (using correct field name)
    const { data: updatedRule, error } = await supabase
      .from('rules')
      .select('votes, slug')
      .eq('id', ruleId)
      .single();

    if (error) throw error;

    revalidatePath(`/rules/${updatedRule.slug}`);
    return { 
      votesCount: updatedRule.votes || 0,
      hasVoted: !existingVote // New state after toggle
    };
  });
}

/**
 * Add comment to a rule
 * Note: Comments table may not exist yet - this is a placeholder
 */
export async function addComment(formData: FormData) {
  const supabase = await createDatabaseSupabaseClient();

  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return { error: 'You must be logged in to comment' };
  }

  const ruleId = formData.get('ruleId') as string;
  const content = formData.get('content') as string;

  if (!content || content.trim().length < 3) {
    return { error: 'Comment must be at least 3 characters long' };
  }

  try {
    // Note: Comments feature not yet implemented in database schema
    // This is a secondary feature - focus on core rule functionality first
    console.warn('Comments feature not implemented yet');
    return { error: 'Comments feature coming soon' };
    
    /*
    const { error } = await supabase
      .from('comments')
      .insert({
        rule_id: ruleId, // Use snake_case for DB
        user_id: session.user.id, // Use snake_case for DB
        content,
        is_published: true // Use snake_case for DB
      });

    if (error) {
      // If comments table doesn't exist, return graceful error
      console.warn('Comments feature not implemented yet:', error);
      return { error: 'Comments feature coming soon' };
    }

    // Get rule slug for revalidation
    const { data: rule } = await supabase
      .from('rules')
      .select('slug')
      .eq('id', ruleId)
      .single();

    if (rule) {
      revalidatePath(`/rules/${rule.slug}`);
    }
    
    return { success: true };
    */
  } catch (error) {
    console.error('Error adding comment:', error);
    return { error: 'Failed to add comment. Please try again.' };
  }
}

/**
 * Database action to get a rule by ID or slug
 */
export async function getRule(ruleIdOrSlug: string): Promise<{ 
  success: boolean; 
  data?: Rule | null; 
  error?: string;
}> {
  try {
    if (!ruleIdOrSlug) {
      return {
        success: false,
        error: 'Rule ID is required'
      };
    }

    const rule = await getSupabaseRule(ruleIdOrSlug);
    
    if (!rule) {
      return {
        success: false,
        error: 'Rule not found'
      };
    }

    return {
      success: true,
      data: rule
    };
  } catch (error) {
    console.error(`Error fetching rule ${ruleIdOrSlug}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred fetching the rule'
    };
  }
}

/**
 * Increment download count for a rule
 */
export async function incrementDownload(ruleId: string) {
  const supabase = await createDatabaseSupabaseClient();
  
  try {
    await supabase.rpc('increment_rule_downloads', { target_rule_id: ruleId });
    return { success: true };
  } catch (error) {
    console.error('Error incrementing downloads:', error);
    return { error: 'Failed to track download' };
  }
}

/**
 * Generate rule package based on wizard configuration
 * FIXED: Use correct database field names
 */
export async function generateRulePackage(formData: FormData) {
  const supabase = await createDatabaseSupabaseClient();
  
  try {
    // Parse wizard configuration from form data
    const wizardConfig = {
      stackChoices: JSON.parse(formData.get('stackChoices') as string || '{}'),
      languageChoices: JSON.parse(formData.get('languageChoices') as string || '{}'),
      toolPreferences: JSON.parse(formData.get('toolPreferences') as string || '{}'),
      environmentDetails: JSON.parse(formData.get('environmentDetails') as string || '{}'),
      outputFormat: (formData.get('outputFormat') as string) || 'zip',
      customRequirements: formData.get('customRequirements') as string || null
    };

    // FloppyDisk wizard configuration using snake_case field names
    const { data: configData, error: configError } = await supabase
      .from('wizard_configurations')
      .insert({
        session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        stack_choices: wizardConfig.stackChoices,
        language_choices: wizardConfig.languageChoices,
        tool_preferences: wizardConfig.toolPreferences,
        environment_details: wizardConfig.environmentDetails,
        output_format: wizardConfig.outputFormat,
        custom_requirements: wizardConfig.customRequirements,
      })
      .select()
      .single();

    if (configError) {
      console.error('Error saving wizard configuration:', configError);
      return { error: 'Failed to save configuration' };
    }

    // Get matching rules
    const { data: rules, error: rulesError } = await supabase
      .from('rules')
      .select('*');

    if (rulesError) {
      console.error('Error fetching rules:', rulesError);
      return { error: 'Failed to fetch rules' };
    }

    // Match rules based on configuration
    const matchedRules = rules?.filter(rule => {
      let score = 0;
      const selectedStacks = Object.keys(wizardConfig.stackChoices).filter(key => wizardConfig.stackChoices[key]);
      const selectedLanguages = Object.keys(wizardConfig.languageChoices).filter(key => wizardConfig.languageChoices[key]);
      
      // Check always apply rules (using snake_case field name)
      if (rule.always_apply) score += 0.5;
      
      // Check tag matches
      const ruleTags = rule.tags || [];
      for (const tag of ruleTags) {
        const lowerTag = tag.toLowerCase();
        if (selectedStacks.some(stack => lowerTag.includes(stack.toLowerCase()))) score += 1.0;
        if (selectedLanguages.some(lang => lowerTag.includes(lang.toLowerCase()))) score += 1.0;
      }
      
      // Check framework compatibility
      const compatibility = rule.compatibility || {};
      if (compatibility && typeof compatibility === 'object' && !Array.isArray(compatibility)) {
        const compatObj = compatibility as { frameworks?: string[]; [key: string]: any };
        if (compatObj.frameworks && Array.isArray(compatObj.frameworks)) {
          for (const framework of compatObj.frameworks) {
            if (typeof framework === 'string' && selectedStacks.some(stack => 
              stack.toLowerCase().includes(framework.toLowerCase()) ||
              framework.toLowerCase().includes(stack.toLowerCase())
            )) {
              score += 1.2;
            }
          }
        }
      }

      return score > 0;
    }) || [];

    // Generate package content based on format
    let packageContent: string;
    let fileSize: number;

    if (wizardConfig.outputFormat === 'bash') {
      packageContent = generateBashScript(matchedRules, wizardConfig);
    } else if (wizardConfig.outputFormat === 'config') {
      packageContent = generateConfigFiles(matchedRules, wizardConfig);
    } else {
      // Default to zip/json format
      packageContent = JSON.stringify({
        configuration: wizardConfig,
        rules: matchedRules.map(r => ({
          id: r.id,
          title: r.title,
          content: r.content,
          tags: r.tags
        })),
        generatedAt: new Date().toISOString(),
        instructions: 'Apply rules according to your project structure'
      }, null, 2);
    }

    fileSize = Buffer.byteLength(packageContent, 'utf8');

    // Store generated package using snake_case field names
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expire in 7 days

    const { data: packageData, error: packageError } = await supabase
      .from('generated_packages')
      .insert({
        configuration_id: configData.id,
        package_type: wizardConfig.outputFormat,
        file_size: fileSize,
        rule_count: matchedRules.length,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (packageError) {
      console.error('Error storing package:', packageError);
      return { error: 'Failed to store package' };
    }

    return {
      success: true,
      package: {
        id: packageData.id,
        content: packageContent,
        fileSize,
        ruleCount: matchedRules.length,
        expiresAt: expiresAt.toISOString()
      }
    };

  } catch (error) {
    console.error('Error generating package:', error);
    return { error: 'Failed to generate rule package' };
  }
}

/**
 * Download generated package
 * FIXED: Use correct database field names
 */
export async function downloadPackage(packageId: string) {
  const supabase = await createDatabaseSupabaseClient();
  
  try {
    // Get package data using snake_case field names
    const { data: packageData, error: packageError } = await supabase
      .from('generated_packages')
      .select('*, wizard_configurations(*)')
      .eq('id', packageId)
      .single();

    if (packageError || !packageData) {
      return { error: 'Package not found' };
    }

    // Check if package is expired (using snake_case field name)
    if (packageData.expires_at && new Date(packageData.expires_at) < new Date()) {
      return { error: 'Package has expired' };
    }

    // Increment download count (using snake_case field name)
    await supabase
      .from('generated_packages')
      .update({ download_count: (packageData.download_count || 0) + 1 })
      .eq('id', packageId);

    return {
      success: true,
      package: packageData
    };

  } catch (error) {
    console.error('Error downloading package:', error);
    return { error: 'Failed to download package' };
  }
}

// Helper functions for package generation
function generateBashScript(rules: any[], config: any): string {
  let script = `#!/bin/bash
# Generated by Vibe Coding Rules Hub
# Configuration: ${JSON.stringify(config.stackChoices, null, 2)}
# Generated: ${new Date().toISOString()}

set -e

echo "🚀 Vibe Coding Rules Setup Script"
echo "=============================="

`;

  for (const rule of rules) {
    script += `\n# Rule: ${rule.title}\n`;
    script += `echo "Applying: ${rule.title}"\n`;
    
    // Extract commands from rule content
    const lines = rule.content.split('\n');
    for (const line of lines) {
      if (line.trim().startsWith('npm ') || 
          line.trim().startsWith('yarn ') ||
          line.trim().startsWith('pnpm ') ||
          line.trim().startsWith('mkdir ') ||
          line.trim().startsWith('touch ')) {
        script += `${line.trim()}\n`;
      }
    }
    script += '\n';
  }

  script += `\necho "✅ Setup completed successfully!"\n`;
  script += `echo "📝 Applied ${rules.length} rules"\n`;

  return script;
}

function generateConfigFiles(rules: any[], config: any): string {
  const configFiles: Record<string, any> = {};

  // Extract configuration from rules
  for (const rule of rules) {
    if (rule.content.includes('package.json')) {
      const match = rule.content.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) {
        try {
          configFiles.packageJson = JSON.parse(match[1]);
        } catch (e) {
          // Ignore malformed JSON
        }
      }
    }
  }

  return JSON.stringify({
    configuration: config,
    configFiles,
    generatedAt: new Date().toISOString(),
    appliedRules: rules.map(r => ({ 
      id: r.id, 
      title: r.title
    }))
  }, null, 2);
}
