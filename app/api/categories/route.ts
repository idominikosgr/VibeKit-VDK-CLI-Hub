// API route for fetching categories
import { NextRequest, NextResponse } from 'next/server';
import { getRuleCategories } from '@/lib/services/supabase-rule-service';

/**
 * Helper to ensure objects are serializable
 */
function ensureSerializable(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export async function GET() {
  try {
    const categories = await getRuleCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('[API] Error fetching categories:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 