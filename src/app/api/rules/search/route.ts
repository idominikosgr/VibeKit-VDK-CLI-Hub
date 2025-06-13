// API route for searching rules - handles proper serialization
import { NextRequest, NextResponse } from 'next/server';
import { searchRules } from '@/lib/services/supabase-rule-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        data: [],
        pagination: {
          page: 1,
          pageSize,
          totalCount: 0,
          totalPages: 0
        }
      });
    }

    const results = await searchRules(query, page, pageSize);
    
    // Ensure proper serialization by converting to plain objects
    const serializedResults = {
      data: results.data.map(rule => ({
        ...rule,
        // Ensure all fields are properly serialized
        created_at: rule.created_at ? String(rule.created_at) : null,
        updated_at: rule.updated_at ? String(rule.updated_at) : null,
        last_updated: rule.last_updated ? String(rule.last_updated) : null,
      })),
      pagination: results.pagination
    };

    return NextResponse.json(serializedResults);
  } catch (error) {
    console.error('MagnifyingGlass API error:', error);
    return NextResponse.json(
      { error: 'Failed to search rules' },
      { status: 500 }
    );
  }
} 