// API route for fetching all rules with pagination
import { NextRequest, NextResponse } from 'next/server';
import { getAllRules } from '@/lib/services/supabase-rule-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const results = await getAllRules(page, limit);
    
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
    console.error('All rules API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch all rules' },
      { status: 500 }
    );
  }
} 