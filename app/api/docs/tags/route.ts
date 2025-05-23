import { NextRequest, NextResponse } from 'next/server';
import { documentationServiceServer } from '@/lib/services/documentation-service-server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

// Simple admin check - you can replace this with your actual admin logic
async function isAdmin(email: string): Promise<boolean> {
  const adminEmails = ['dominikos@myroomieapp.com'];
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

export async function GET() {
  try {
    const tags = await documentationServiceServer.getTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userEmail = await getCurrentUserEmail();
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userIsAdmin = await isAdmin(userEmail);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { name, description, color } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    const tag = await documentationServiceServer.createTag(name, description, color);
    return NextResponse.json(tag, { status: 201 });

  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create tag' },
      { status: 500 }
    );
  }
} 