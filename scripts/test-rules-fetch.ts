import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testRulesFetch() {
  console.log('Testing Rules Fetching...');
  console.log('================================');

  try {
    // Test 1: Get raw rule count
    const { count, error: countError } = await supabase
      .from('rules')
      .select('id', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error getting rule count:', countError);
      return;
    }
    
    console.log(`✅ Total rules in database: ${count}`);

    // Test 2: Get first 5 rules with basic info
    const { data: basicRules, error: basicError } = await supabase
      .from('rules')
      .select('id, title, slug, category_id')
      .limit(5);
    
    if (basicError) {
      console.error('❌ Error fetching basic rules:', basicError);
      return;
    }
    
    console.log(`✅ Fetched ${basicRules?.length || 0} basic rules:`);
    basicRules?.forEach(rule => {
      console.log(`  - ${rule.title} (ID: ${rule.id}, Category: ${rule.category_id})`);
    });

    // Test 3: Get rules with category join
    const { data: joinedRules, error: joinError } = await supabase
      .from('rules')
      .select('id, title, slug, categories(name)')
      .limit(5);
    
    if (joinError) {
      console.error('❌ Error fetching joined rules:', joinError);
      return;
    }
    
    console.log(`✅ Fetched ${joinedRules?.length || 0} rules with category join:`);
    joinedRules?.forEach(rule => {
      console.log(`  - ${rule.title} (Category: ${(rule as any).categories?.name || 'Unknown'})`);
    });

    // Test 4: Test specific rule lookup
    if (basicRules && basicRules.length > 0) {
      const testRuleId = basicRules[0].id;
      console.log(`\nTesting specific rule lookup for ID: ${testRuleId}`);
      
      const { data: specificRule, error: specificError } = await supabase
        .from('rules')
        .select('*, categories(name, slug)')
        .eq('id', testRuleId)
        .maybeSingle();
      
      if (specificError) {
        console.error('❌ Error fetching specific rule:', specificError);
        return;
      }
      
      if (specificRule) {
        console.log('✅ Specific rule found:');
        console.log(`  Title: ${specificRule.title}`);
        console.log(`  Description: ${specificRule.description?.substring(0, 100)}...`);
        console.log(`  Category: ${(specificRule as any).categories?.name}`);
        console.log(`  Tags: ${JSON.stringify(specificRule.tags)}`);
      } else {
        console.log('❌ Specific rule not found');
      }
    }

    // Test 5: Get categories count
    const { count: categoryCount, error: categoryCountError } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true });
    
    if (categoryCountError) {
      console.error('❌ Error getting category count:', categoryCountError);
      return;
    }
    
    console.log(`\n✅ Total categories in database: ${categoryCount}`);

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testRulesFetch(); 