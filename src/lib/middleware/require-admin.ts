import { NextResponse } from 'next/server';
import { createDatabaseSupabaseClient } from '../supabase/server-client';

/**
 * Simple admin middleware that returns NextResponse for unauthorized access
 * Returns null if user is authorized, or NextResponse with error if not
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  try {
    const supabase = await createDatabaseSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { success: false, error: 'User email not found' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admins')
      .select('email')
      .eq('email', user.email)
      .single();
    
    if (!adminData) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // User is authorized
    return null;
  } catch (error) {
    console.error('Error in admin middleware:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication error' },
      { status: 500 }
    );
  }
} 