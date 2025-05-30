import { NextRequest, NextResponse } from 'next/server';
import { getCategory, getRulesByCategory } from '@/lib/services/supabase-rule-service';

/**
 * Helper function to deeply ensure the object is serializable
 */
function ensureSerializable<T>(obj: T): T {
  try {
    // Deep clone to remove any non-serializable properties
    const serialized = JSON.parse(JSON.stringify(obj));
    
    // Ensure dates are properly formatted as ISO strings
    if (serialized && typeof serialized === 'object') {
      // Handle arrays
      if (Array.isArray(serialized)) {
        return serialized.map(item => ensureSerializable(item)) as T;
      }
      
      // Handle objects
      Object.keys(serialized).forEach(key => {
        const value = serialized[key];
        
        // Handle date strings
        if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              serialized[key] = date.toISOString();
            }
          } catch (e) {
            // If it fails, keep the original value
          }
        }
        
        // Recursively handle nested objects
        if (value && typeof value === 'object') {
          serialized[key] = ensureSerializable(value);
        }
        
        // Ensure null values are preserved (not undefined)
        if (value === undefined) {
          serialized[key] = null;
        }
      });
    }
    
    return serialized;
  } catch (error) {
    console.error('Failed to serialize object:', error);
    throw new Error('Data serialization error');
  }
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
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    // Ensure params are properly awaited (for Next.js 15+)
    const awaitedParams = await params;
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
    
    // Ensure all data is properly serialized
    const serializedCategory = ensureSerializable(category);
    const serializedRules = ensureSerializable(rules.data);
    const serializedPagination = ensureSerializable(rules.pagination);
    
    return NextResponse.json({
      category: serializedCategory,
      data: serializedRules,
      pagination: serializedPagination
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