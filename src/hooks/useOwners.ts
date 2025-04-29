
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';

interface Owner {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  user: Owner;
  session: any;
}

export const useOwners = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [owners, setOwners] = useState<Owner[]>([]);
  const { toast } = useToast();

  const fetchOwners = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'owner');
        
      if (error) throw error;
      
      setOwners(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching owners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch owners",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    owners,
    isLoading,
    fetchOwners
  };
};

export const useOwnerLogin = () => {
  const { toast } = useToast();
  
  const ownerLogin = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (!data.session || !data.user) {
        throw new Error('No session or user returned');
      }
      
      // Fetch profile to confirm user is an owner
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) throw profileError;
      
      if (!profileData || profileData.role !== 'owner') {
        // Sign out if not an owner
        await supabase.auth.signOut();
        throw new Error('Access denied. Only owners can access the owner portal.');
      }
      
      const owner: Owner = {
        id: data.user.id,
        email: data.user.email || '',
        name: profileData.name || 'Owner',
        role: 'owner'
      };
      
      return {
        user: owner,
        session: data.session
      };
    } catch (error) {
      console.error('Owner login error:', error);
      if (error instanceof AuthError) {
        throw error;
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred during login');
      }
    }
  };
  
  return ownerLogin;
};
