'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { getCurrentUser, signInWithEmail, signInWithGitHub, signOut, signUpWithEmail, updateUserProfile } from '@/lib/services/auth-service';
import { toast } from 'sonner';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedUser: Partial<User>) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        if (mounted) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        try {
          if (!mounted) return;

          if (event === 'SIGNED_IN' && session?.user) {
            const mappedUser = await mapSupabaseUserSafe(session.user);
            setUser(mappedUser);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            const mappedUser = await mapSupabaseUserSafe(session.user);
            setUser(mappedUser);
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          // Don't set user to null on error, keep current state
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Safe user mapping function that handles errors gracefully
  const mapSupabaseUserSafe = async (user: SupabaseUser): Promise<User | null> => {
    try {
      // Get profile information with error handling
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
          // Return basic user info if profile creation fails
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
        // Return basic user info if profile fetch fails
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
    } catch (error) {
      console.error('Error mapping user:', error);
      // Return basic user info if anything fails
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

  // Login with email and password - NO loading state management here
  const login = async (email: string, password: string) => {
    try {
      const { user, error } = await signInWithEmail(email, password);
      if (error || !user) {
        toast.error(error || 'Failed to log in');
        return false;
      }
      // Don't set user here - let auth state change handle it
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  // Register with email and password - NO loading state management here
  const register = async (email: string, password: string, name: string) => {
    try {
      const { user, error } = await signUpWithEmail(email, password, name);
      if (error || !user) {
        toast.error(error || 'Failed to register');
        return false;
      }
      // Don't set user here - let auth state change handle it
      toast.success('Registration successful');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  // Login with GitHub - NO loading state management here
  const loginWithGitHub = async () => {
    try {
      const { error } = await signInWithGitHub();
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      console.error('GitHub login error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  // Logout - NO loading state management here
  const logout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error(error);
        return;
      }
      // Don't set user here - let auth state change handle it
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  // Update user profile
  const updateProfile = async (updatedUser: Partial<User>) => {
    if (!user) {
      toast.error('Not logged in');
      return false;
    }

    try {
      const mergedUser = { ...user, ...updatedUser };
      const { success, error } = await updateUserProfile(mergedUser);

      if (!success || error) {
        toast.error(error || 'Failed to update profile');
        return false;
      }

      setUser(mergedUser);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      loginWithGitHub,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
