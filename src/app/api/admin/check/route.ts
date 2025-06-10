import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || !user.email) {
      return NextResponse.json({ isAdmin: false }, { status: 200 });
    }

    // Check if user is in the admins table
    const { data: adminUser, error } = await supabase
      .from('admins')
      .select('email')
      .eq('email', user.email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking admin status:', error);
      return NextResponse.json({ isAdmin: false }, { status: 200 });
    }

    const isAdmin = !!adminUser;
    
    return NextResponse.json({ 
      isAdmin, 
      email: user.email,
      userId: user.id 
    }, { status: 200 });

  } catch (error) {
    console.error('Error in admin check:', error);
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }
} 