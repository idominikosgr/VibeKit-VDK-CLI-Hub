import { NextRequest, NextResponse } from 'next/server';
import { documentationServiceServer } from '@/lib/services/documentation-service-server';
import { getCurrentUser } from '@/lib/services/auth-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const { tagId } = params;
    
    if (!tagId) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      );
    }

    const tag = await documentationServiceServer.getTag(tagId);
    
    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);

  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { tagId } = params;
    
    if (!tagId) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      );
    }

    const { name, description, color } = await request.json();

    // Validate that at least one field is being updated
    if (!name && !description && color === undefined) {
      return NextResponse.json(
        { error: 'At least one field (name, description, or color) must be provided' },
        { status: 400 }
      );
    }

    const updates: { name?: string; description?: string; color?: string } = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (color !== undefined) updates.color = color;

    const updatedTag = await documentationServiceServer.updateTag(tagId, updates);
    return NextResponse.json(updatedTag);

  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update tag' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { tagId } = params;
    
    if (!tagId) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      );
    }

    // Check if tag exists before trying to delete
    const existingTag = await documentationServiceServer.getTag(tagId);
    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    await documentationServiceServer.deleteTag(tagId);
    
    return NextResponse.json(
      { message: 'Tag deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete tag' },
      { status: 500 }
    );
  }
} 