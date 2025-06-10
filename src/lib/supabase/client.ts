import { createBrowserClient } from '@supabase/ssr'
import { Database } from './database.types'

// Client-side Supabase client using the modern @supabase/ssr pattern
// This follows the latest Supabase best practices for Next.js applications

/**
 * Creates a Supabase client for use in browser contexts (client components)
 * Uses the modern @supabase/ssr package which replaces older patterns
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
