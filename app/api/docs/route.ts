import { NextRequest, NextResponse } from 'next/server';
import { documentationServiceServer } from '@/lib/services/documentation-service-server';
import { getCurrentUser } from '@/lib/services/auth-service';
import type { DocumentationSearchParams, CreateDocumentationPageRequest } from '@/types/documentation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params: DocumentationSearchParams = {
      query: searchParams.get('query') || undefined,
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
    console.error('Error fetching documentation pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documentation pages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: CreateDocumentationPageRequest = await request.json();
    
    // Add author information
    const pageData = {
      ...body,
      author_id: user.id,
      last_edited_by: user.id
    };

    const page = await documentationServiceServer.createPage(pageData);
    return NextResponse.json(page, { status: 201 });

  } catch (error) {
    console.error('Error creating documentation page:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create page' },
      { status: 500 }
    );
  }
} 