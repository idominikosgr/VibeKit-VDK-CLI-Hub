import { NextRequest, NextResponse } from 'next/server';
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client';
import { requireAdmin } from '@/lib/middleware/admin-auth';

// Force dynamic rendering to prevent build-time cookie errors
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const supabase = await createDatabaseSupabaseClient();
    
    // Get all admins
    const { data: admins, error } = await supabase
      .from('admins')
      .select('*')
      .order('added_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      admins: admins || []
    });

  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch admins',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createDatabaseSupabaseClient();
    
    // Check if already admin
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'User is already an admin' },
        { status: 400 }
      );
    }

    // Add admin
    const { error } = await supabase
      .from('admins')
      .insert({ email: email.toLowerCase() });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Admin added successfully'
    });

  } catch (error) {
    console.error('Error adding admin:', error);
    return NextResponse.json(
      { 
        error: 'Failed to add admin',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Prevent self-removal
    if (authResult.user?.email === email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Cannot remove your own admin access' },
        { status: 400 }
      );
    }

    const supabase = await createDatabaseSupabaseClient();
    
    // Remove admin
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('email', email.toLowerCase());

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Admin removed successfully'
    });

  } catch (error) {
    console.error('Error removing admin:', error);
    return NextResponse.json(
      { 
        error: 'Failed to remove admin',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 