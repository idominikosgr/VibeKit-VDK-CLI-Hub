#!/usr/bin/env node

/**
 * This script tests the Supabase connection and basic operations
 */

// Set environment variables directly
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://izdtuhiciejisavhpqey.supabase.co';
process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6ZHR1aGljaWVqaXNhdmhwcWV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzc0OTM3MSwiZXhwIjoyMDYzMzI1MzcxfQ.5GLsldY_6yW35to3NowChJqoof-09jUoB8n_lx8Hujw';

import { createClient } from '@supabase/supabase-js';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  console.log(`URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  console.log(`Key: ${process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY ? 'Set (hidden)' : 'Not Set'}`);
  
  try {
    // Create Supabase Admin client
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase URL or Service Role Key not set');
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Test a simple query to check connection
    console.log('Testing database connection...');
    const { data: categories, error: categoriesError } = await supabaseAdmin
      .from('categories')
      .select('id, name, slug')
      .limit(5);

    if (categoriesError) {
      throw categoriesError;
    }

    console.log('Database connection successful!');
    console.log(`Found ${categories?.length || 0} categories`);
    console.log(categories);

    // Try to get existing rules
    const { data: rules, error: rulesError } = await supabaseAdmin
      .from('rules')
      .select('id, title, slug')
      .limit(5);

    if (rulesError) {
      throw rulesError;
    }

    console.log(`Found ${rules?.length || 0} rules`);
    console.log(rules);

    // Try to insert a test category
    const testCategorySlug = `test-category-${Date.now()}`;
    console.log(`Trying to insert a test category: ${testCategorySlug}...`);
    
    const { data: insertedCategory, error: insertError } = await supabaseAdmin
      .from('categories')
      .insert({
        name: `Test Category ${Date.now()}`,
        slug: testCategorySlug,
        description: 'This is a test category'
      })
      .select('id, name, slug')
      .single();

    if (insertError) {
      throw insertError;
    }

    console.log('Test category inserted successfully!');
    console.log(insertedCategory);

    // Clean up the test category
    console.log(`Cleaning up test category...`);
    const { error: deleteError } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('slug', testCategorySlug);

    if (deleteError) {
      throw deleteError;
    }

    console.log('Test category deleted successfully!');

    console.log('\nAll Supabase tests passed! ✅');
    return true;
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return false;
  }
}

// Run the test
testSupabaseConnection()
  .then(success => {
    if (success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Fatal error during test:', error);
    process.exit(1);
  });
