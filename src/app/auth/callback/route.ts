import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createDatabaseSupabaseClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';

// This route handles the OAuth callback from providers like GitHub
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // If there's no code, something went wrong with the OAuth flow
  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/error?error=No authorization code found`
    );
  }

  // Exchange the code for a session
  try {
    const supabase = await createDatabaseSupabaseClient();

    // Exchange the auth code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/error?error=${encodeURIComponent(error.message)}`
      );
    }

    // If successful, redirect to the previously requested page or the dashboard
    const cookieStore = await cookies();
    const redirectTo = cookieStore.get('auth-redirect')?.value || '/';
    cookieStore.delete('auth-redirect');

    return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/error?error=${encodeURIComponent('An unexpected error occurred')}`
    );
  }
}
