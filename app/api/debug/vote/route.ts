import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

export async function POST(request: NextRequest) {
  try {
    const { ruleId, action } = await request.json();
    
    if (!ruleId || !action) {
      return NextResponse.json({ error: 'Missing ruleId or action' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      return NextResponse.json({ 
        error: 'Authentication error', 
        details: userError.message 
      }, { status: 401 });
    }
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    console.log(`Debug vote: User ${user.id} attempting to ${action} vote for rule ${ruleId}`);

    // Check if user already voted
    const { data: existingVote, error: checkError } = await supabase
      .from('user_votes')
      .select('id')
      .eq('rule_id', ruleId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing vote:', checkError);
      return NextResponse.json({ 
        error: 'Database error checking vote', 
        details: checkError.message 
      }, { status: 500 });
    }

    console.log('Existing vote:', existingVote);

    // Perform the action
    let result;
    if (action === 'add') {
      if (existingVote) {
        return NextResponse.json({ 
          error: 'User has already voted',
          hasVoted: true 
        }, { status: 400 });
      }
      
      const { error } = await supabase.rpc('vote_for_rule', { target_rule_id: ruleId });
      if (error) {
        console.error('RPC vote_for_rule error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to vote for rule',
          details: error
        }, { status: 500 });
      }
      
      result = { message: 'Vote added successfully' };
    } else if (action === 'remove') {
      if (!existingVote) {
        return NextResponse.json({ 
          error: 'No vote to remove',
          hasVoted: false 
        }, { status: 400 });
      }
      
      const { error } = await supabase.rpc('remove_rule_vote', { target_rule_id: ruleId });
      if (error) {
        console.error('RPC remove_rule_vote error:', error);
        return NextResponse.json({ 
          error: 'Failed to remove vote', 
          details: error.message 
        }, { status: 500 });
      }
      
      result = { message: 'Vote removed successfully' };
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get updated vote count
    const { data: updatedRule, error: ruleError } = await supabase
      .from('rules')
      .select('votes')
      .eq('id', ruleId)
      .single();

    if (ruleError) {
      console.error('Error fetching updated rule:', ruleError);
    }

    return NextResponse.json({
      ...result,
      voteCount: updatedRule?.votes || 0,
      userId: user.id,
      ruleId
    });

  } catch (error) {
    console.error('Debug vote error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 