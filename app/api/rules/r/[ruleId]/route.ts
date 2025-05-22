import { NextRequest, NextResponse } from 'next/server';
import { findRuleByIdentifier } from '@/lib/services/supabase-rule-service';
import { Rule } from '@/lib/types';

/**
 * GET handler for /api/rules/r/[ruleId]
 * Looks up a rule by ID without requiring a category
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { ruleId: string } }
) {
  try {
    // Get the rule ID from URL params - properly await params in Next.js 15
    const unwrappedParams = await Promise.resolve(params);
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

/**
 * POST handler for legacy compatibility
 * Handles direct POST requests to /api/rules/r/[ruleId]
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { ruleId: string } }
) {
  // Reuse the same logic as GET but log it as a POST request
  try {
    // Get the rule ID from the path parameter - properly await params in Next.js 15
    const unwrappedParams = await Promise.resolve(params);
    const ruleId = unwrappedParams.ruleId;
    
    if (!ruleId) {
      return NextResponse.json(
        { error: 'Rule ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`[API:rules/r/[ruleId]] Looking up rule via POST: ${ruleId}`);
    
    // Try to find the rule by ID
    const rule = await findRuleByIdentifier(ruleId);
    
    if (!rule) {
      console.log(`[API:rules/r/[ruleId]] Rule not found: ${ruleId}`);
      return NextResponse.json(
        { error: 'Rule not found', requestedId: ruleId },
        { status: 404 }
      );
    }
    
    // Get category ID from the rule
    const category_id = rule.category_id || 'unknown';
    
    // Return the redirect URL
    const redirectUrl = `/rules/${category_id}/${rule.id}`;
    console.log(`[API:rules/r/[ruleId]] Redirecting to: ${redirectUrl}`);
    
    return NextResponse.json({
      redirect: redirectUrl,
      rule: {
        id: rule.id,
        title: rule.title,
        category_id
      }
    });
  } catch (error) {
    console.error('[API:rules/r/[ruleId]] Error during rule lookup via POST:', error);
    return NextResponse.json(
      { error: 'Failed to process rule lookup' },
      { status: 500 }
    );
  }
} 