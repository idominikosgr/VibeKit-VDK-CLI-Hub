'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { getCurrentUser, signInWithEmail, signInWithGitHub, signOut, signUpWithEmail, updateUserProfile } from '@/lib/services/auth-service';
import { toast } from 'sonner';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

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

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    
    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const currentUser = await mapSupabaseUserFromSession(session.user);
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      // Only process auth changes after initial setup
      if (!isInitialized) return;
      
      if (session?.user) {
        try {
          const currentUser = await mapSupabaseUserFromSession(session.user);
          setUser(currentUser);
        } catch (error) {
          console.error('Error mapping user from session:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isInitialized]);

  // Helper function to map user from session
  const mapSupabaseUserFromSession = async (user: any): Promise<User> => {
    const supabase = createBrowserSupabaseClient();
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

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
