import { createDatabaseSupabaseClient } from '../supabase/server-client';
import { NextRequest } from 'next/server';

/**
 * Check if a user is an admin based on their email
 */
export async function isUserAdmin(email: string): Promise<boolean> {
  try {
    const supabase = await createDatabaseSupabaseClient();
    const { data } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    return !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Admin authentication middleware for API routes
 */
export async function requireAdmin(request: NextRequest): Promise<{ isAdmin: boolean; user?: any; error?: string }> {
  try {
    const supabase = await createDatabaseSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { isAdmin: false, error: 'Authentication required' };
    }

    if (!user.email) {
      return { isAdmin: false, error: 'User email not found' };
    }

    // Check if user is admin
    const isAdmin = await isUserAdmin(user.email);
    
    if (!isAdmin) {
      return { isAdmin: false, error: 'Admin access required' };
    }

    return { isAdmin: true, user };
  } catch (error) {
    console.error('Error in admin middleware:', error);
    return { isAdmin: false, error: 'Authentication error' };
  }
}

/**
 * Get current user's admin status
 */
export async function getCurrentUserAdminStatus(): Promise<{ isAdmin: boolean; user?: any; error?: string }> {
  try {
    const supabase = await createDatabaseSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { isAdmin: false };
    }

    if (!user.email) {
      return { isAdmin: false };
    }

    const isAdmin = await isUserAdmin(user.email);
    
    return { isAdmin, user };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false, error: 'Error checking admin status' };
  }
}

/**
 * Add a user as admin (must be called by existing admin)
 */
export async function addAdmin(email: string, requestingUserEmail: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if requesting user is admin
    const isRequestingUserAdmin = await isUserAdmin(requestingUserEmail);
    if (!isRequestingUserAdmin) {
      return { success: false, error: 'Only admins can add other admins' };
    }

    const supabase = await createDatabaseSupabaseClient();
    
    const { error } = await supabase
      .from('admins')
      .insert({ email: email.toLowerCase() });

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return { success: false, error: 'User is already an admin' };
      }
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding admin:', error);
    return { success: false, error: 'Failed to add admin' };
  }
}

/**
 * Remove admin access (must be called by existing admin)
 */
export async function removeAdmin(email: string, requestingUserEmail: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Prevent self-removal
    if (email.toLowerCase() === requestingUserEmail.toLowerCase()) {
      return { success: false, error: 'Cannot remove your own admin access' };
    }

    // Check if requesting user is admin
    const isRequestingUserAdmin = await isUserAdmin(requestingUserEmail);
    if (!isRequestingUserAdmin) {
      return { success: false, error: 'Only admins can remove other admins' };
    }

    const supabase = await createDatabaseSupabaseClient();
    
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('email', email.toLowerCase());

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error removing admin:', error);
    return { success: false, error: 'Failed to remove admin' };
  }
} 