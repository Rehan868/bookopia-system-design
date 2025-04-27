
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  }, []);

  const login = async (email: string, password: string) => {
    // This is a mock login function - in a real app, this would call your API
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
  };
  
  const ownerLogin = async (email: string, password: string) => {
    // This is a mock login function for owners
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: '2',
      name: 'Owner User',
      email: email,
      role: 'owner',
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('isAuthenticated', 'true');
    
    setUser(mockUser);
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    // Remove from local storage
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
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
