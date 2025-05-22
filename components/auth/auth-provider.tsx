'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { getCurrentUser, signInWithEmail, signInWithGitHub, signOut, signUpWithEmail, updateUserProfile } from '@/lib/services/auth-service';
import { toast } from 'sonner';

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

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user, error } = await signInWithEmail(email, password);
      if (error || !user) {
        toast.error(error || 'Failed to log in');
        return false;
      }
      setUser(user);
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register with email and password
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { user, error } = await signUpWithEmail(email, password, name);
      if (error || !user) {
        toast.error(error || 'Failed to register');
        return false;
      }
      setUser(user);
      toast.success('Registration successful');
      return true;
    } catch (error) {
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with GitHub
  const loginWithGitHub = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGitHub();
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast.error(error);
        return;
      }
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updatedUser: Partial<User>) => {
    if (!user) {
      toast.error('Not logged in');
      return false;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
