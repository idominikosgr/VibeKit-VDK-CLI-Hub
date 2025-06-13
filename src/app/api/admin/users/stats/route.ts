import { NextRequest, NextResponse } from 'next/server';
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client';
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

    const supabase = await createDatabaseSupabaseClient();
    
    // Calculate date ranges
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get total users count
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    // Get new users this week
    const { count: newUsersThisWeek } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString());

    // Get active users today (users who have updated their profile or signed in)
    // Note: This is a simplified metric - in a real app you'd track user activity
    const { count: activeUsersToday } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('updated_at', dayAgo.toISOString());

    // Get total admins count
    const { count: totalAdmins } = await supabase
      .from('admins')
      .select('email', { count: 'exact', head: true });

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        newUsersThisWeek: newUsersThisWeek || 0,
        activeUsersToday: activeUsersToday || 0,
        totalAdmins: totalAdmins || 0
      }
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user statistics',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 