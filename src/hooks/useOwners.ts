import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';

interface Owner {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  properties: number;
  revenue: number;
  occupancy: number;
  joinedDate?: string;
  paymentDetails?: {
    bank?: string;
    accountNumber?: string;
    routingNumber?: string;
  };
}

interface Room {
  id: string;
  number: string;
  owner_id: string;
  type: string;
  property: string;
  status: 'available' | 'booked' | 'maintenance' | 'cleaning';
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
      
      // Transform profiles data into the Owner format
      const ownersData = data.map(profile => ({
        id: profile.id,
        name: profile.name || 'Owner',
        email: profile.email || '',
        role: profile.role,
        phone: profile.phone || '',
        avatar: profile.avatar_url,
        properties: 0, // Default values, can be updated with actual data
        revenue: 0,
        occupancy: 0,
        joinedDate: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : undefined
      }));
      
      setOwners(ownersData);
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

// Add the missing useOwner hook to fetch a single owner by ID
export const useOwner = (id: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Owner | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchOwner = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .eq('role', 'owner')
          .single();
          
        if (profileError) throw profileError;
        
        if (!profileData) {
          throw new Error('Owner not found');
        }
        
        // Fetch additional owner data like rooms, revenue, etc.
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*')
          .eq('owner_id', id);
          
        if (roomsError) throw roomsError;
        
        // Calculate owner statistics
        const properties = roomsData?.length || 0;
        const revenue = Math.floor(Math.random() * 100000) + 10000; // Mock data
        const occupancy = Math.floor(Math.random() * 30) + 70; // Mock data between 70-100%
        
        const owner: Owner = {
          id: profileData.id,
          name: profileData.name || 'Owner',
          email: profileData.email || '',
          role: profileData.role,
          phone: profileData.phone || '',
          avatar: profileData.avatar_url,
          properties,
          revenue,
          occupancy,
          joinedDate: profileData.created_at ? new Date(profileData.created_at).toISOString().split('T')[0] : undefined,
          paymentDetails: {
            bank: 'Chase Bank', // Mock data
            accountNumber: '****4567',
            routingNumber: '****8901'
          }
        };
        
        setData(owner);
      } catch (error) {
        console.error('Error fetching owner:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch owner details'));
        toast({
          title: "Error",
          description: "Failed to fetch owner details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOwner();
  }, [id, toast]);
  
  return { data, isLoading, error };
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
        role: 'owner',
        properties: 0, // Default values
        revenue: 0,
        occupancy: 0
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

// Add the missing useOwnerRooms hook to fetch rooms for a specific owner
export const useOwnerRooms = (ownerId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Room[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchOwnerRooms = async () => {
      if (!ownerId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*')
          .eq('owner_id', ownerId);
          
        if (roomsError) throw roomsError;
        
        // Transform the data if needed
        const formattedRooms = roomsData.map(room => ({
          id: room.id,
          number: room.number,
          owner_id: room.owner_id,
          type: room.type || 'Standard',
          property: room.property || 'Main Property',
          status: room.status || 'available'
        }));
        
        setData(formattedRooms);
      } catch (error) {
        console.error('Error fetching owner rooms:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch owner rooms'));
        toast({
          title: "Error",
          description: "Failed to fetch owner's rooms",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOwnerRooms();
  }, [ownerId, toast]);
  
  return { data, isLoading, error };
};
