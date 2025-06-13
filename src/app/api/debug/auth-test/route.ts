import { NextRequest, NextResponse } from 'next/server';
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createDatabaseSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    const result = {
      timestamp: new Date().toISOString(),
      auth: {
        hasUser: !!user,
        userId: user?.id || null,
        userEmail: user?.email || null,
        authError: authError?.message || null,
      },
      admin: {
        isAdmin: false,
        adminCheckError: null as string | null,
      },
      database: {
        connected: false,
        adminCount: 0,
        dbError: null as string | null,
      }
    };

    // Test database connection and admin count
    try {
      const { data: adminCount, error: countError } = await supabase
        .from('admins')
        .select('email', { count: 'exact' });
      
      if (countError) {
        result.database.dbError = countError.message;
      } else {
        result.database.connected = true;
        result.database.adminCount = adminCount?.length || 0;
      }
    } catch (dbError) {
      result.database.dbError = dbError instanceof Error ? dbError.message : 'Unknown database error';
    }

    // Check if current user is admin
    if (user?.email) {
      try {
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('email')
          .eq('email', user.email)
          .single();
        
        if (adminError && adminError.code !== 'PGRST116') {
          result.admin.adminCheckError = adminError.message;
        } else {
          result.admin.isAdmin = !!adminData;
        }
      } catch (adminCheckError) {
        result.admin.adminCheckError = adminCheckError instanceof Error ? adminCheckError.message : 'Unknown admin check error';
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 