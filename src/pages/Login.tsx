
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { AuthError } from '@supabase/supabase-js';
import { CreateDemoUsers } from '@/components/setup/CreateDemoUsers';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading, user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      if (user?.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, authLoading, navigate, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      
      toast({
        title: "Success!",
        description: "You have successfully logged in."
      });
      
      // Navigation happens in useEffect after auth state changes
    } catch (error: unknown) {
      console.error("Login error:", error);
      
      let errorMessage = "Invalid credentials. Please try again.";
      
      if (error instanceof AuthError) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please confirm your email address before logging in.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading indicator while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-md p-8 bg-background rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Hotel Manager</h1>
          <p className="text-muted-foreground mt-2">Staff Login Portal</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Property owner? {" "}
            <Link to="/owner/login" className="text-primary hover:underline">
              Login to Owner Portal
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-muted rounded-md">
          <h3 className="font-medium text-sm mb-2">Demo Accounts:</h3>
          <div className="grid gap-2 text-xs">
            <div>
              <p><strong>Admin:</strong> admin@example.com / password</p>
            </div>
            <div>
              <p><strong>Manager:</strong> manager@example.com / password</p>
            </div>
            <div>
              <p><strong>Staff:</strong> staff@example.com / password</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <CreateDemoUsers />
        </div>
      </div>
    </div>
  );
}
