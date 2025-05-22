'use client';

import { User as SupabaseUser } from '@supabase/supabase-js';
import { createBrowserSupabaseClient } from '../supabase/client';
import { User } from '../types';

// Convert Supabase user to app user
const mapSupabaseUser = async (user: SupabaseUser): Promise<User> => {
  const supabase = createBrowserSupabaseClient();

  // Get profile information
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email || '',
    name: profile?.name,
    githubUsername: profile?.github_username,
    avatarUrl: profile?.avatar_url,
    preferredLanguage: profile?.preferred_language
  };
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

    // Profile will be created by database trigger or we create it here
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
        name
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
    }

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
        github_username: user.githubUsername,
        preferred_language: user.preferredLanguage
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
