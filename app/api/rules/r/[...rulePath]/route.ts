import { NextRequest, NextResponse } from 'next/server';
import { findRuleByIdentifier } from '@/lib/services/supabase-rule-service';

/**
 * API endpoint for finding rules by any part of their path
 * Supports deep paths like /api/rules/r/languages/TypeScript5.mdc
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { rulePath: string[] } }
) {
  try {
    // Ensure params are properly awaited (for Next.js 15+)
    const unwrappedParams = await Promise.resolve(params);
    
    if (!unwrappedParams.rulePath || unwrappedParams.rulePath.length === 0) {
      return NextResponse.json(
        { error: 'Rule path is required' },
        { status: 400 }
      );
    }
    
    // Join the path segments to create a search path
    const rulePath = unwrappedParams.rulePath.join('/');
    console.log(`[API:rules/r/[...rulePath]] Looking up rule by path: ${rulePath}`);
    
    // Find the rule by the path
    const rule = await findRuleByIdentifier(rulePath);
    
    if (!rule) {
      console.log(`[API:rules/r/[...rulePath]] Rule not found with path: ${rulePath}`);
      return NextResponse.json(
        { error: 'Rule not found' },
        { status: 404 }
      );
    }
    
    // Get category ID from the rule - use a valid category ID or fallback
    const categoryId = rule.category_id || 'languages';
    
    // Return redirect info
    const redirectUrl = `/rules/${categoryId}/${rule.id}`;
    console.log(`[API:rules/r/[...rulePath]] Redirecting to: ${redirectUrl}`);
    
    return NextResponse.json({
      redirect: redirectUrl,
      rule: {
        id: rule.id,
        title: rule.title,
        categoryId: rule.category_id
      }
    });
  } catch (error) {
    console.error('[API:rules/r/[...rulePath]] Error during rule lookup:', error);
    return NextResponse.json(
      { error: 'Failed to process rule lookup' },
      { status: 500 }
    );
  }
} 