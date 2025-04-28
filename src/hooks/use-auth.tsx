
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { User } from '@/services/supabase-types';

interface UserDetails extends User {
  role: string;
}

interface OwnerDetails {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserDetails | null;
  owner: OwnerDetails | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signInAsOwner: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<void>;
  ownerLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [owner, setOwner] = useState<OwnerDetails | null>(null);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }
        
        // Get the user from the session
        const currentUser = sessionData.session.user;
        
        if (currentUser) {
          // Check if the user is a staff member (stored in users table)
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          if (userData) {
            setUser(userData as UserDetails);
            setIsAuthenticated(true);
            setOwner(null);
            return;
          }
          
          // Check if the user is an owner
          const { data: ownerData, error: ownerError } = await supabase
            .from('owners')
            .select('id, name, email')
            .eq('id', currentUser.id)
            .single();
          
          if (ownerData) {
            setOwner({
              id: ownerData.id,
              name: ownerData.name,
              email: ownerData.email
            });
            setIsAuthenticated(true);
            setUser(null);
            return;
          }
          
          // If we reach here, the user is authenticated but doesn't have a record in users or owners
          setIsAuthenticated(false);
          setUser(null);
          setOwner(null);
          
          // Log out the user as they aren't properly set up in our system
          await supabase.auth.signOut();
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setOwner(null);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        setIsAuthenticated(false);
        setUser(null);
        setOwner(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
        setOwner(null);
      } else if (event === 'SIGNED_IN' && session) {
        // Re-run our auth check when the user signs in
        checkAuth();
      }
    });
    
    // Clean up the subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) return { success: false, error: error.message };
      
      if (data.user) {
        // Check if the user exists in the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (userData) {
          setUser(userData as UserDetails);
          setIsAuthenticated(true);
          setOwner(null);
          return { success: true };
        } else {
          // User doesn't exist in our users table, sign them out
          await supabase.auth.signOut();
          return { success: false, error: 'User not found in the system' };
        }
      }
      
      return { success: false, error: 'An unexpected error occurred' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };
  
  const signInAsOwner = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) return { success: false, error: error.message };
      
      if (data.user) {
        // Check if the user exists in the owners table
        const { data: ownerData, error: ownerError } = await supabase
          .from('owners')
          .select('id, name, email')
          .eq('id', data.user.id)
          .single();
          
        if (ownerData) {
          setOwner({
            id: ownerData.id,
            name: ownerData.name,
            email: ownerData.email
          });
          setIsAuthenticated(true);
          setUser(null);
          return { success: true };
        } else {
          // User doesn't exist in our owners table, sign them out
          await supabase.auth.signOut();
          return { success: false, error: 'Owner not found in the system' };
        }
      }
      
      return { success: false, error: 'An unexpected error occurred' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setOwner(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Additional wrapper functions for compatibility with existing code
  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const ownerLogin = async (email: string, password: string) => {
    const result = await signInAsOwner(email, password);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const logout = async () => {
    await signOut();
  };
  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        owner,
        signIn,
        signOut,
        signInAsOwner,
        login,
        ownerLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
