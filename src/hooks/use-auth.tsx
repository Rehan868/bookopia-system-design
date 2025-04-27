
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (storedUser && storedIsAuthenticated === 'true') {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    // Set up auth state listener
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
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('ownerId');
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // We have a session, but we need to verify if we have user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
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
        .select('id, name, email')
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
        name: owner.name,
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
      // Sign out from Supabase
      await supabase.auth.signOut();
      
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
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, ownerLogin }}>
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
