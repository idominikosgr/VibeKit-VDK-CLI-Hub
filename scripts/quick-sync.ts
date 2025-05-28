#!/usr/bin/env node
/**
 * Quick sync script to load rules from the repository into Supabase
 * This ensures rule IDs and slugs are properly created from filenames
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../lib/supabase/database.types';
import dotenv from 'dotenv';
import { glob } from 'glob';

// Load env variables
dotenv.config({ path: '.env.local' });

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing required environment variables');
  console.error('Please make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Constants
const RULES_DIR = path.resolve(process.cwd(), '.ai/rules');

// Map of category names to IDs
const categoryMap: Record<string, string> = {};

// Helper function to slugify a string
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}

// Function to parse the MDC content
function parseMdcContent(content: string) {
  const lines = content.split('\n');
  const title = lines[0].replace(/^#\s+/, '').trim();
  
  let description = '';
  let inDescription = false;
  
  // Extract description - assuming it's after the first h2 ## Description
  for (const line of lines) {
    if (line.startsWith('## Description')) {
      inDescription = true;
      continue;
    }
    
    if (inDescription) {
      if (line.startsWith('##')) {
        // End of description section
        break;
      }
      description += line + ' ';
    }
  }
  
  // Extract tags if present with a simple regex
  const tagsMatch = content.match(/Tags:\s*\[(.*?)\]/);
  const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [];
  
  return {
    title,
    description: description.trim(),
    content,
    version: '1.0.0',
    tags
  };
}

// Function to find or create a category
async function findOrCreateCategory(categoryName: string): Promise<string> {
  // Check if we already have this category in our map
  if (categoryMap[categoryName]) {
    return categoryMap[categoryName];
  }
  
  // Try to find the category in the database
  const { data: existingCategory } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('slug', slugify(categoryName))
    .maybeSingle();
  
  if (existingCategory) {
    categoryMap[categoryName] = existingCategory.id;
    return existingCategory.id;
  }
  
  // Create new category
  const { data: newCategory, error } = await supabaseAdmin
    .from('categories')
    .insert({
      name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
      slug: slugify(categoryName),
      description: `Rules for ${categoryName}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('id')
    .single();
  
  if (error) {
    console.error(`Error creating category ${categoryName}:`, error);
    throw error;
  }
  
  categoryMap[categoryName] = newCategory.id;
  return newCategory.id;
}

// Main function to process all rule files
async function processRuleFiles() {
  try {
    // Get a list of all .mdc files in the rules directory
    const files = glob.sync(`${RULES_DIR}/**/*.mdc`);
    console.log(`Found ${files.length} rule files to process`);

    let processed = 0;
    let skipped = 0;

    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const { title, description, content: ruleContent, tags } = parseMdcContent(content);
        
        // Generate rule ID and slug from file path
        const relativePath = path.relative(RULES_DIR, filePath);
        const ruleId = relativePath.replace(/\.mdc$/, '').replace(/\//g, '_');
        const slug = slugify(title);
        
        // Determine category from directory structure
        const pathParts = relativePath.split('/');
        const categoryName = pathParts.length > 1 ? pathParts[0] : 'core';
        const categoryId = await findOrCreateCategory(categoryName);
        
        // Check if rule already exists
        const { data: existingRule } = await supabaseAdmin
          .from('rules')
          .select('id')
          .eq('id', ruleId)
          .maybeSingle();
        
        if (existingRule) {
          console.log(`Skipping existing rule: ${title}`);
          skipped++;
          continue;
        }
        
        // Insert new rule
        const { error } = await supabaseAdmin
          .from('rules')
          .insert({
            id: ruleId,
            title,
            slug,
            description,
            content: ruleContent,
            path: relativePath,
            category_id: categoryId,
            tags,
            version: '1.0.0',
            downloads: 0,
            votes: 0,
            always_apply: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_updated: new Date().toISOString()
          });
        
        if (error) {
          console.error(`Error inserting rule ${title}:`, error);
          continue;
        }
        
        console.log(`✅ Processed: ${title}`);
        processed++;
        
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }
    
    console.log(`\n📊 Quick sync results:`);
    console.log(`  Processed: ${processed}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`  Total files: ${files.length}`);
    
  } catch (error) {
    console.error('Error in processRuleFiles:', error);
    throw error;
  }
}

// Run the sync
processRuleFiles()
  .then(() => {
    console.log('✅ Quick sync completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Quick sync failed:', error);
    process.exit(1);
  });