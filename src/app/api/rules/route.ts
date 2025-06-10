import { NextRequest, NextResponse } from 'next/server';
import { 
  getRuleCategories, 
  getRulesByCategory, 
  searchRules 
} from '@/lib/services/supabase-rule-service';

/**
 * Helper to ensure objects are serializable
 */
function ensureSerializable(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * API route for rules
 * GET /api/rules
 * 
 * Query parameters:
 * - q: Search query
 * - category: Category ID or slug
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    // Get search parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const category_id = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    console.log(`[API] Rules request: query=${query}, category=${category_id}, page=${page}, limit=${limit}`);
    
    // If there's a search query, perform a search
    if (query && query.trim() !== '') {
      const results = await searchRules(query, page, limit);
      return NextResponse.json({
        data: ensureSerializable(results.data),
        pagination: results.pagination
      });
    }
    
    // If there's a category ID, get rules for that category
    if (category_id) {
      const rules = await getRulesByCategory(category_id, page, limit);
      return NextResponse.json({
        data: ensureSerializable(rules.data),
        pagination: rules.pagination
      });
    }
    
    // Otherwise, get all categories with their rule counts
    const categories = await getRuleCategories();
    
    return NextResponse.json({
      categories: ensureSerializable(categories)
    });
  } catch (error) {
    console.error('[API] Error processing rules request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch rules data',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 