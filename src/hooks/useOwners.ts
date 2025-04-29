
import { useEffect, useState } from 'react';
import { Owner, Room } from '@/services/supabase-types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

// Hook to fetch all owners
export const useOwners = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('owners')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Map Supabase response to match our Owner type
        const mappedOwners: Owner[] = data.map(owner => ({
          id: owner.id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone || null,
          address: owner.address || null,
          city: owner.city || null,
          country: owner.country || null,
          birthdate: owner.birthdate || null,
          commission_rate: owner.commission_rate,
          payment_details: owner.payment_details,
          created_at: owner.created_at,
          updated_at: owner.updated_at,
          // Optional fields from the frontend usage
          properties: 0,
          revenue: 0,
          occupancy: 0,
          avatar: undefined,
          joinedDate: owner.created_at
        }));
        
        setOwners(mappedOwners);
      } catch (err: any) {
        console.error('Error fetching owners:', err);
        setError(err.message || 'Failed to fetch owners');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOwners();
  }, []);
  
  return { owners, isLoading, error };
};

// Hook to fetch an owner by ID
export const useOwner = (id: string) => {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOwner = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('owners')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        // Map Supabase response to match our Owner type
        const mappedOwner: Owner = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          address: data.address || null,
          city: data.city || null,
          country: data.country || null,
          birthdate: data.birthdate || null,
          commission_rate: data.commission_rate,
          payment_details: data.payment_details,
          created_at: data.created_at,
          updated_at: data.updated_at,
          // Optional fields from the frontend usage
          properties: 0,
          revenue: 0,
          occupancy: 0,
          avatar: undefined,
          joinedDate: data.created_at
        };
        
        setOwner(mappedOwner);
      } catch (err: any) {
        console.error('Error fetching owner:', err);
        setError(err.message || 'Failed to fetch owner');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOwner();
  }, [id]);
  
  return { owner, isLoading, error };
};

// Hook for owner login
export const useOwnerLogin = () => {
  const { login } = useAuth();
  
  const ownerLogin = async (email: string, password: string) => {
    try {
      // First, attempt to log in with Supabase auth
      await login(email, password);
      
      // After successful login, check if the user is an owner
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      if (profile?.role !== 'owner') {
        // If not an owner, sign out and throw an error
        await supabase.auth.signOut();
        throw new Error('Access denied. Only owners can access the owner portal.');
      }
      
      // Successfully logged in as an owner
      return true;
    } catch (error) {
      // Re-throw any errors
      throw error;
    }
  };
  
  return ownerLogin;
};

// Hook to fetch owner's properties
export const useOwnerProperties = (ownerId?: string) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchOwnerProperties = async () => {
      // Use authenticated user's ID if no ownerId is provided
      const ownerToFetch = ownerId || (user?.role === 'owner' ? user.id : null);
      
      if (!ownerToFetch) {
        setIsLoading(false);
        setError('No owner ID provided');
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch properties belonging to the owner
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', ownerToFetch);
        
        if (error) {
          throw error;
        }
        
        setProperties(data || []);
      } catch (err: any) {
        console.error('Error fetching owner properties:', err);
        setError(err.message || 'Failed to fetch properties');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOwnerProperties();
  }, [ownerId, user]);
  
  return { properties, isLoading, error };
};

// Hook to fetch owner's rooms
export const useOwnerRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchOwnerRooms = async () => {
      if (!user || user.role !== 'owner') {
        setIsLoading(false);
        setError('User is not authenticated as an owner');
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch rooms belonging to the authenticated owner
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('owner_id', user.id);
        
        if (error) {
          throw error;
        }
        
        // Map the data to match our Room type
        const mappedRooms = data.map((room: any) => ({
          id: room.id,
          number: room.number,
          owner_id: room.owner_id,
          type: room.type,
          property: room.property_name || '',
          status: room.status,
          // Add additional fields needed for the Room type
          property_name: room.property_name,
          max_occupancy: room.max_occupancy,
          base_rate: room.base_rate,
          description: room.description,
          amenities: room.amenities || [],
          image: room.image,
          created_at: room.created_at,
          updated_at: room.updated_at,
          property_id: room.property_id,
          // Optional UI-specific fields
          capacity: room.max_occupancy,
          rate: room.base_rate,
          floor: ''
        }));
        
        setRooms(mappedRooms);
      } catch (err: any) {
        console.error('Error fetching owner rooms:', err);
        setError(err.message || 'Failed to fetch rooms');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOwnerRooms();
  }, [user]);
  
  return { rooms, isLoading, error };
};
