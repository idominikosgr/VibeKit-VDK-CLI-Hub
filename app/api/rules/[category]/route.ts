import { NextRequest, NextResponse } from 'next/server';
import { getCategory, getRulesByCategory } from '@/lib/services/supabase-rule-service';

/**
 * Helper to ensure objects are serializable
 */
function ensureSerializable(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * API route for rules in a specific category
 * GET /api/rules/[category]
 * 
 * Query parameters:
 * - q: Search query
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    // Ensure params are properly awaited (for Next.js 15+)
    const awaitedParams = await Promise.resolve(params);
    const category_idOrSlug = awaitedParams.category;
    
    if (!category_idOrSlug) {
      return NextResponse.json(
        { error: 'Category identifier is required' },
        { status: 400 }
      );
    }
    
    console.log(`[API] Getting rules for category: ${category_idOrSlug}`);
    
    // First get the category to validate it exists
    const category = await getCategory(category_idOrSlug);
    
    if (!category) {
      return NextResponse.json(
        { error: `Category not found: ${category_idOrSlug}` },
        { status: 404 }
      );
    }
    
    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const query = searchParams.get('q');
    
    // Fetch rules for the category with pagination
    const rules = await getRulesByCategory(category.id, page, limit, query || undefined);
    
    return NextResponse.json({
      category: ensureSerializable(category),
      data: ensureSerializable(rules.data),
      pagination: rules.pagination
    });
  } catch (error) {
    console.error('[API] Error processing category rules request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch category rules',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 