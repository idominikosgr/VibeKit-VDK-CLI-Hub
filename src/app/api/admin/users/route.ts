import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { requireAdmin } from '@/lib/middleware/admin-auth';

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

    const supabase = await createServerSupabaseClient();
    
    // Get all users from profiles table
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      users: users || []
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 