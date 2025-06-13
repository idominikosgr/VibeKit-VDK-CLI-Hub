import { NextRequest, NextResponse } from 'next/server';
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createDatabaseSupabaseClient();
    
    // Test database connection
    const { data: testQuery, error: testError } = await supabase
      .from('rules')
      .select('id')
      .limit(1);
    
    if (testError) {
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: testError 
      }, { status: 500 });
    }

    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ 
        error: 'User not authenticated', 
        details: userError 
      }, { status: 401 });
    }

    // Test if RPC functions exist by calling them with invalid data
    // This should fail but tell us if the function exists
    const results: {
      databaseConnection: string;
      userAuthenticated: boolean;
      userId: string;
      testResults: {
        vote_for_rule?: any;
        remove_rule_vote?: any;
        user_votes_table?: any;
      };
    } = {
      databaseConnection: 'OK',
      userAuthenticated: true,
      userId: user.id,
      testResults: {}
    };

    // Test vote_for_rule function
    try {
      const { error: voteError } = await supabase.rpc('vote_for_rule', { 
        target_rule_id: 'non-existent-rule-test' 
      });
      
      results.testResults.vote_for_rule = {
        exists: true,
        error: voteError ? {
          message: voteError.message,
          code: voteError.code,
          hint: voteError.hint,
          details: voteError.details
        } : null
      };
    } catch (error) {
      results.testResults.vote_for_rule = {
        exists: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }

    // Test remove_rule_vote function
    try {
      const { error: removeError } = await supabase.rpc('remove_rule_vote', { 
        target_rule_id: 'non-existent-rule-test' 
      });
      
      results.testResults.remove_rule_vote = {
        exists: true,
        error: removeError ? {
          message: removeError.message,
          code: removeError.code,
          hint: removeError.hint,
          details: removeError.details
        } : null
      };
    } catch (error) {
      results.testResults.remove_rule_vote = {
        exists: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }

    // Test if we can read user_votes table
    try {
      const { data: votesData, error: votesError } = await supabase
        .from('user_votes')
        .select('id')
        .limit(1);
      
      results.testResults.user_votes_table = {
        accessible: !votesError,
        error: votesError ? {
          message: votesError.message,
          code: votesError.code,
          hint: votesError.hint,
          details: votesError.details
        } : null
      };
    } catch (error) {
      results.testResults.user_votes_table = {
        accessible: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('RPC test error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 