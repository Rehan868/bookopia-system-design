import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  ownerLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean; // Add loading state to prevent flashing login screen
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // First check if we have a session with Supabase
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        
        // Then check for stored user data
        const storedUser = localStorage.getItem('user');
        const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (session) {
          // We have an active session with Supabase
          if (storedUser && storedIsAuthenticated === 'true') {
            // We also have stored user data, so restore it
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // We have a session but no stored user, try to get user info
            // (this might happen if localStorage was cleared but session exists)
            // For now, just sign out to ensure clean state
            await supabase.auth.signOut();
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          // No Supabase session
          if (storedUser && storedIsAuthenticated === 'true') {
            // But we have stored user data for regular staff login (not using Supabase auth)
            // This is for your mock login that doesn't use Supabase auth
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // No session and no stored user
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        // We need to check if this is an owner or regular user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        // Only clear auth if we're not using the mock login
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // If this is a Supabase-authenticated user (owner), clear everything
          if (parsedUser.role === 'owner') {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('ownerId');
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // This is a mock login function for staff - in a real app, this would call your API
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just accept any credentials
      const mockUser = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin',
      };
      
      // Store in local storage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Update state
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  
  const ownerLogin = async (email: string, password: string) => {
    try {
      // First check if owner exists in the database
      const { data: owner, error: ownerError } = await supabase
        .from('owners')
        .select('id, firstName, lastName, email')
        .eq('email', email)
        .single();

      if (ownerError) {
        console.error("Owner not found:", ownerError);
        throw new Error("Invalid credentials");
      }

      // Sign in with Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Supabase auth error:", error);
        throw new Error("Invalid credentials");
      }

      // Create user object
      const ownerUser = {
        id: owner.id,
        name: `${owner.firstName} ${owner.lastName}`,
        email: owner.email,
        role: 'owner',
      };
      
      // Store in local storage
      localStorage.setItem('user', JSON.stringify(ownerUser));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('ownerId', owner.id);
      
      // Update state
      setUser(ownerUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Owner login error:", error);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      // Check if we're an owner (Supabase auth user)
      if (user?.role === 'owner') {
        // Sign out from Supabase
        await supabase.auth.signOut();
      }
      
      // Remove from local storage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('ownerId');
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, ownerLogin, isLoading }}>
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
