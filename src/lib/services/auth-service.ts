'use client';

import { User as SupabaseUser } from '@supabase/supabase-js';
import { createBrowserSupabaseClient } from '../supabase/client';
import { User } from '../types';

// Convert Supabase user to app user
const mapSupabaseUser = async (user: SupabaseUser): Promise<User> => {
  const supabase = createBrowserSupabaseClient();

  try {
    // Get profile information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // If profile doesn't exist, create it
    if (profileError && profileError.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          github_username: user.user_metadata?.user_name || null
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        // If profile creation fails, return user with basic info
        return {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || null,
          github_username: user.user_metadata?.user_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          preferred_language: null,
          preferred_theme: null,
          created_at: null,
          updated_at: null
        };
      }

      return {
        id: newProfile.id,
        email: newProfile.email,
        name: newProfile.name,
        github_username: newProfile.github_username,
        avatar_url: newProfile.avatar_url,
        preferred_language: newProfile.preferred_language,
        preferred_theme: newProfile.preferred_theme,
        created_at: newProfile.created_at,
        updated_at: newProfile.updated_at
      };
    }

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      // Return user with basic info if profile fetch fails
      return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || null,
        github_username: user.user_metadata?.user_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        preferred_language: null,
        preferred_theme: null,
        created_at: null,
        updated_at: null
      };
    }

    return {
      id: user.id,
      email: user.email || '',
      name: profile?.name || null,
      github_username: profile?.github_username || null,
      avatar_url: profile?.avatar_url || null,
      preferred_language: profile?.preferred_language || null,
      preferred_theme: profile?.preferred_theme || null,
      created_at: profile?.created_at || null,
      updated_at: profile?.updated_at || null
    };
  } catch (err) {
    console.error('Error in mapSupabaseUser:', err);
    // Return user with basic info if anything fails
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || null,
      github_username: user.user_metadata?.user_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      preferred_language: null,
      preferred_theme: null,
      created_at: null,
      updated_at: null
    };
  }
};

// Sign in with email and password
export async function signInWithEmail(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const supabase = createBrowserSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'No user returned from authentication' };
    }

    const user = await mapSupabaseUser(data.user);
    return { user, error: null };
  } catch (err) {
    console.error('Unexpected error during sign in:', err);
    return { user: null, error: 'An unexpected error occurred during sign in' };
  }
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const supabase = createBrowserSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'No user returned from registration' };
    }

    // Profile will be created automatically by mapSupabaseUser if it doesn't exist
    // No need to create it here to avoid conflicts
    const user = await mapSupabaseUser(data.user);
    return { user, error: null };
  } catch (err) {
    console.error('Unexpected error during sign up:', err);
    return { user: null, error: 'An unexpected error occurred during registration' };
  }
}

// Sign in with GitHub
export async function signInWithGitHub(): Promise<{ user: User | null; error: string | null }> {
  try {
    const supabase = createBrowserSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: null, error: null }; // User will be handled by the callback
  } catch (err) {
    console.error('Unexpected error during GitHub sign in:', err);
    return { user: null, error: 'An unexpected error occurred during GitHub sign in' };
  }
}

// Sign out
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const supabase = createBrowserSupabaseClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    console.error('Unexpected error during sign out:', err);
    return { error: 'An unexpected error occurred during sign out' };
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = createBrowserSupabaseClient();

    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return null;
    }

    return await mapSupabaseUser(data.user);
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(user: User): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createBrowserSupabaseClient();

    const { error } = await supabase
      .from('profiles')
      .update({
        name: user.name,
        github_username: user.github_username,
        preferred_language: user.preferred_language,
        avatar_url: user.avatar_url,
        preferred_theme: user.preferred_theme
      })
      .eq('id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Error updating profile:', err);
    return { success: false, error: 'An unexpected error occurred while updating your profile' };
  }
}
