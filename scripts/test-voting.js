import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testVotingFunctions() {
  console.log('🔍 Testing voting functions...\n');

  try {
    // Test 1: Check if functions exist by querying the database schema
    console.log('1. Checking if RPC functions exist in database...');
    
    const { data: functions, error: funcError } = await supabase
      .from('pg_proc')
      .select('proname')
      .in('proname', ['vote_for_rule', 'remove_rule_vote']);
    
    if (funcError) {
      console.log('❌ Cannot query pg_proc (expected with RLS)');
    } else {
      console.log('✅ Functions found:', functions?.map(f => f.proname));
    }

    // Test 2: Get a real rule ID first
    console.log('\n2. Getting a real rule ID...');
    const { data: realRules, error: rulesError } = await supabase
      .from('rules')
      .select('id, title')
      .limit(1);
    
    if (rulesError || !realRules || realRules.length === 0) {
      console.log('❌ No rules found to test with');
      return;
    }
    
    const testRuleId = realRules[0].id;
    const testRuleTitle = realRules[0].title;
    console.log(`✅ Using rule: ${testRuleTitle} (${testRuleId})`);

    // Test 3: Try to call the functions with a real rule
    console.log('\n3. Testing vote_for_rule function...');
    
    const { error: voteError } = await supabase.rpc('vote_for_rule', {
      target_rule_id: testRuleId
    });
    
    if (voteError) {
      console.log('❌ vote_for_rule error:', {
        message: voteError.message,
        code: voteError.code,
        hint: voteError.hint,
        details: voteError.details
      });
    } else {
      console.log('✅ vote_for_rule executed successfully');
    }

    // Test 4: Try to call remove function
    console.log('\n4. Testing remove_rule_vote function...');
    
    const { error: removeError } = await supabase.rpc('remove_rule_vote', {
      target_rule_id: testRuleId
    });
    
    if (removeError) {
      console.log('❌ remove_rule_vote error:', {
        message: removeError.message,
        code: removeError.code,
        hint: removeError.hint,
        details: removeError.details
      });
    } else {
      console.log('✅ remove_rule_vote executed successfully');
    }

    // Test 5: Check user_votes table access
    console.log('\n5. Testing user_votes table access...');
    
    const { data: votes, error: votesError } = await supabase
      .from('user_votes')
      .select('*')
      .limit(5);
    
    if (votesError) {
      console.log('❌ user_votes table error:', {
        message: votesError.message,
        code: votesError.code,
        hint: votesError.hint
      });
    } else {
      console.log('✅ user_votes table accessible, rows:', votes?.length || 0);
    }

    // Test 6: Check rules table access
    console.log('\n6. Testing rules table access...');
    
    const { data: rules, error: rulesTableError } = await supabase
      .from('rules')
      .select('id, title, votes')
      .limit(3);
    
    if (rulesTableError) {
      console.log('❌ rules table error:', rulesTableError);
    } else {
      console.log('✅ rules table accessible, sample rules:');
      rules?.forEach(rule => {
        console.log(`  - ${rule.title}: ${rule.votes} votes`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testVotingFunctions()
  .then(() => {
    console.log('\n🏁 Testing completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Test script failed:', error);
    process.exit(1);
  }); 