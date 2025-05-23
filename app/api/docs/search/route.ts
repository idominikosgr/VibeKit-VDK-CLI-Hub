import { NextRequest, NextResponse } from 'next/server';
import { documentationServiceServer } from '@/lib/services/documentation-service-server';
import type { DocumentationSearchParams } from '@/types/documentation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params: DocumentationSearchParams = {
      query: searchParams.get('q') || searchParams.get('query') || undefined,
      tag: searchParams.get('tag') || undefined,
      author: searchParams.get('author') || undefined,
      status: (searchParams.get('status') as any) || 'published',
      visibility: (searchParams.get('visibility') as any) || 'public',
      content_type: (searchParams.get('content_type') as any) || undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
      sort_by: (searchParams.get('sort_by') as any) || 'updated_at',
      sort_order: (searchParams.get('sort_order') as any) || 'desc'
    };

    const result = await documentationServiceServer.searchPages(params);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error searching documentation pages:', error);
    return NextResponse.json(
      { error: 'Failed to search documentation pages' },
      { status: 500 }
    );
  }
} 