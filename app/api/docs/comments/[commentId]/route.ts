import { NextRequest, NextResponse } from 'next/server';
import { documentationServiceServer } from '@/lib/services/documentation-service-server';
import { getCurrentUser } from '@/lib/services/auth-service';
import type { UpdateDocumentationCommentRequest } from '@/types/documentation';

export async function GET(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const { commentId } = params;
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    const comment = await documentationServiceServer.getComment(commentId);
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(comment);

  } catch (error) {
    console.error('Error fetching comment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comment' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { commentId } = params;
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    const body: UpdateDocumentationCommentRequest = await request.json();

    // TODO: Add permission checking to ensure user can edit this comment
    // For now, assuming any authenticated user can edit any comment
    // In a real app, you'd check if user is the comment author or has admin rights

    const updatedComment = await documentationServiceServer.updateComment(commentId, body);
    return NextResponse.json(updatedComment);

  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { commentId } = params;
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    // TODO: Add permission checking to ensure user can delete this comment
    // For now, assuming any authenticated user can delete any comment
    // In a real app, you'd check if user is the comment author or has admin rights

    await documentationServiceServer.deleteComment(commentId);
    
    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete comment' },
      { status: 500 }
    );
  }
}

// Special endpoint for resolving comments
export async function PATCH(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { commentId } = params;
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    const { action } = await request.json();

    if (action === 'resolve') {
      await documentationServiceServer.resolveComment(commentId);
      return NextResponse.json(
        { message: 'Comment resolved successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported actions: resolve' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error processing comment action:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process comment action' },
      { status: 500 }
    );
  }
} 