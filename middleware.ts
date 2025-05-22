import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Initialize response to be modified later
  const response = NextResponse.next();

  // Create Supabase client using cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // This conditional is the key to avoiding the server/client mismatch errors
          if (request.headers.get('cookie')?.includes(name)) {
            // If cookie exists, update it
            response.cookies.set({
              name,
              value,
              ...options,
            });
          }
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    // Get session without causing side effects that trigger cookies issues
    const { data } = await supabase.auth.getSession();

    // Now handle protected routes
    if ((request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/profile'))) {
      if (!data.session) {
        // Redirect to login if attempting to access protected route without session
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }
  } catch (error) {
    console.error('Middleware auth error:', error);
    // Continue with the request even if auth check fails
    // This prevents blocking the site on auth errors
  }

  return response;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/* (image files stored in the public directory)
     * - public/* (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|public).*)',
  ],
};
