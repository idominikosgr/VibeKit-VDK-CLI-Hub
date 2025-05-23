import { NextRequest, NextResponse } from 'next/server';
import { documentationServiceServer } from '@/lib/services/documentation-service-server';
import { getCurrentUser } from '@/lib/services/auth-service';
import type { CreateDocumentationCommentRequest } from '@/types/documentation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    
    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    const comments = await documentationServiceServer.getPageComments(pageId);
    return NextResponse.json(comments);

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
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

    const body: CreateDocumentationCommentRequest = await request.json();
    
    // Add author information
    const commentData = {
      ...body,
      author_id: user.id
    };

    const comment = await documentationServiceServer.createComment(commentData);
    return NextResponse.json(comment, { status: 201 });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create comment' },
      { status: 500 }
    );
  }
} 