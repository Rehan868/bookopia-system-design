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
        // Check for stored user data
        const storedUser = localStorage.getItem('user');
        const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (storedUser && storedIsAuthenticated === 'true') {
          // We have stored user data for regular staff login
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          // No stored user
          setIsAuthenticated(false);
          setUser(null);
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
  
  const logout = async () => {
    try {
      // Remove from local storage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
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
