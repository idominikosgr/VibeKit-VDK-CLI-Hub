import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testSchemaCompatibility() {
  console.log('Testing Supabase Schema compatibility...');
  console.log('------------------------------------------------');

  try {
    // Test 1: Insert a test category
    console.log('Test 1: Inserting a test category');
    const testCatSlug = `test-${randomUUID().slice(0, 8)}`;
    
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .insert({
        name: 'Test Category',
        slug: testCatSlug,
        description: 'A temporary test category',
        icon: 'test'
      })
      .select()
      .single();
    
    if (categoryError) {
      console.error('❌ Category insert failed:', categoryError.message);
      return;
    }
    
    console.log('✅ Category insert successful:', category.id);

    // Test 2: Insert a test rule using the category
    console.log('\nTest 2: Inserting a test rule');
    const testRuleId = `test_rule_${randomUUID().slice(0, 8)}`;
    
    const { data: rule, error: ruleError } = await supabase
      .from('rules')
      .insert({
        id: testRuleId,
        title: 'Test Rule',
        slug: `test-rule-${randomUUID().slice(0, 8)}`,
        description: 'A temporary test rule',
        content: '# Test Rule\n\nThis is a test.',
        path: `/.ai/rules/test/${testRuleId}.mdc`,
        category_id: category.id,
        tags: ['test'],
        compatibility: { frameworks: ['test'] },
        version: '1.0.0',
        always_apply: false
      })
      .select()
      .single();
    
    if (ruleError) {
      console.error('❌ Rule insert failed:', ruleError.message);
      return;
    }
    
    console.log('✅ Rule insert successful:', rule.id);

    // Test 3: Insert a rule version
    console.log('\nTest 3: Inserting a test rule version');
    
    const { data: version, error: versionError } = await supabase
      .from('rule_versions')
      .insert({
        rule_id: testRuleId,
        version: '1.0.0',
        content: '# Test Rule\n\nThis is a test.',
        changes: 'Initial version'
      })
      .select()
      .single();
    
    if (versionError) {
      console.error('❌ Rule version insert failed:', versionError.message);
      return;
    }
    
    console.log('✅ Rule version insert successful:', version.id);

    // Test 4: Clean up - Delete test data
    console.log('\nTest 4: Cleaning up test data');
    
    // Delete rule version
    const { error: deleteVersionError } = await supabase
      .from('rule_versions')
      .delete()
      .eq('rule_id', testRuleId);
    
    if (deleteVersionError) {
      console.warn('⚠️ Rule version deletion failed:', deleteVersionError.message);
    } else {
      console.log('✅ Rule version deleted successfully');
    }
    
    // Delete rule
    const { error: deleteRuleError } = await supabase
      .from('rules')
      .delete()
      .eq('id', testRuleId);
    
    if (deleteRuleError) {
      console.warn('⚠️ Rule deletion failed:', deleteRuleError.message);
    } else {
      console.log('✅ Rule deleted successfully');
    }
    
    // Delete category
    const { error: deleteCategoryError } = await supabase
      .from('categories')
      .delete()
      .eq('id', category.id);
    
    if (deleteCategoryError) {
      console.warn('⚠️ Category deletion failed:', deleteCategoryError.message);
    } else {
      console.log('✅ Category deleted successfully');
    }

    console.log('\n✅✅✅ All tests passed successfully! Your schema is compatible.');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testSchemaCompatibility();
