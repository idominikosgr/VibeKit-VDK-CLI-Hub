import { NextRequest, NextResponse } from 'next/server';
import { findRuleByIdentifier } from '@/lib/services/supabase-rule-service';

/**
 * API endpoint that handles looking up rules by ID and returning redirect info
 * Used by the client-side redirect page
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the rule ID
    const body = await request.json();
    const { ruleId } = body;
    
    if (!ruleId) {
      return NextResponse.json(
        { error: 'Rule ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`[API:rules/r] Looking up rule: ${ruleId}`);
    
    // Find the rule by identifier (id, slug, or path)
    const rule = await findRuleByIdentifier(ruleId);
    
    if (!rule) {
      console.log(`[API:rules/r] Rule not found: ${ruleId}`);
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      );
    }
    
    // Get category ID from the rule - use a valid category ID or fallback
    const category_id = rule.category_id || 'languages'; // Fallback to a default category if missing
    
    // Return the redirect URL - ensure we use the rule.id for the final URL
    const redirectUrl = `/rules/${category_id}/${rule.id}`;
    console.log(`[API:rules/r] Redirecting to: ${redirectUrl}`);
    
    return NextResponse.json({
      redirect: redirectUrl,
      rule: {
        id: rule.id,
        title: rule.title,
        category_id: rule.category_id
      }
    });
  } catch (error) {
    console.error('[API:rules/r] Error during rule lookup:', error);
    return NextResponse.json(
      { error: 'Failed to process rule lookup' },
      { status: 500 }
    );
  }
}

/**
 * GET handler that supports the same functionality as POST but works
 * with ruleId passed in URL query parameter
 */
export async function GET(request: NextRequest) {
  try {
    // Get the rule ID from the URL query parameter
    const url = new URL(request.url);
    const ruleId = url.searchParams.get('ruleId');
    
    if (!ruleId) {
      return NextResponse.json(
        { error: 'Rule ID is required as query parameter' },
        { status: 400 }
      );
    }
    
    console.log(`[API:rules/r] Looking up rule via GET: ${ruleId}`);
    
    // Find the rule by identifier (id, slug, or path)
    const rule = await findRuleByIdentifier(ruleId);
    
    if (!rule) {
      console.log(`[API:rules/r] Rule not found: ${ruleId}`);
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      );
    }
    
    // Get category ID from the rule - use a valid category ID or fallback
    const category_id = rule.category_id || 'languages'; // Fallback to a default category if missing
    
    // Return the redirect URL - ensure we use the rule.id for the final URL
    const redirectUrl = `/rules/${category_id}/${rule.id}`;
    console.log(`[API:rules/r] Redirecting to: ${redirectUrl}`);
    
    return NextResponse.json({
      redirect: redirectUrl,
      rule: {
        id: rule.id,
        title: rule.title,
        category_id: rule.category_id
      }
    });
  } catch (error) {
    console.error('[API:rules/r] Error during rule lookup:', error);
    return NextResponse.json(
      { error: 'Failed to process rule lookup' },
      { status: 500 }
    );
  }
} 