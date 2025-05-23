import { NextRequest, NextResponse } from 'next/server';
import { documentationServiceServer } from '@/lib/services/documentation-service-server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import type { UpdateDocumentationPageRequest } from '@/types/documentation';

// Simple admin check - you can replace this with your actual admin logic
async function isAdmin(email: string): Promise<boolean> {
  // For now, just check if it's a specific admin email
  // You should replace this with your actual admin checking logic
  const adminEmails = ['admin@example.com', 'dominik@example.com', 'dominikos@myroomieapp.com']; // Add your admin emails
  return adminEmails.includes(email);
}

async function getCurrentUserEmail(): Promise<string | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user || !user.email) {
      return null;
    }
    
    return user.email;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const page = await documentationServiceServer.getPage(params.id, true);
    
    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(page);

  } catch (error) {
    console.error('Error fetching documentation page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUserEmail();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userIsAdmin = await isAdmin(user);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body: UpdateDocumentationPageRequest = await request.json();
    
    // Add editor information
    const updateData = {
      ...body,
      last_edited_by: user,
    };

    const updatedPage = await documentationServiceServer.updatePage(params.id, updateData);
    return NextResponse.json(updatedPage);

  } catch (error) {
    console.error('Error updating documentation page:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update page' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUserEmail();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userIsAdmin = await isAdmin(user);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await documentationServiceServer.deletePage(params.id);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting documentation page:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete page' },
      { status: 500 }
    );
  }
} 