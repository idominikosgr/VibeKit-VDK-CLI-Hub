import { NextRequest, NextResponse } from 'next/server';
import { findRuleByIdentifier } from '@/lib/services/supabase-rule-service';
import { Rule } from '@/lib/types';

/**
 * GET handler for /api/rules/r/[ruleId]
 * Looks up a rule by ID without requiring a category
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ruleId: string }> }
) {
  try {
    // Get the rule ID from URL params - properly await params in Next.js 15
    const unwrappedParams = await params;
    const ruleId = unwrappedParams.ruleId;
    
    if (!ruleId) {
      return NextResponse.json({ error: 'Rule ID is required' }, { status: 400 });
    }
    
    console.log(`[API:rules/r/[ruleId]] Looking up rule by ID: ${ruleId}`);
    
    // Find the rule by ID without restricting to a category
    const rule = await findRuleByIdentifier(ruleId);
    
    if (!rule) {
      console.log(`[API:rules/r/[ruleId]] Rule not found directly: ${ruleId}`);
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }
    
    // Construct a redirect URL to the canonical rule path
    const redirectUrl = `/rules/${rule.category_id}/${rule.id}`;
    console.log(`[API:rules/r/[ruleId]] Found rule. Redirecting to: ${redirectUrl}`);
    
    return NextResponse.json({
      redirect: redirectUrl,
      rule: {
        id: rule.id,
        title: rule.title,
        category_id: rule.category_id
      }
    });
  } catch (error) {
    console.error('Error fetching rule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rule' },
      { status: 500 }
    );
  }
} 