
import { Owner } from '@/services/supabase-types';
import { fetchOwners } from '@/services/api';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOwners = () => {
  return useQuery({
    queryKey: ["owners"],
    queryFn: async () => {
      return await fetchOwners();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOwner = (id: string) => {
  return useQuery({
    queryKey: ["owner", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owners')
        .select('*, rooms(*)')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(`Owner with ID ${id} not found: ${error.message}`);
      }
      
      return data as Owner;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Add function to login owner
export const useOwnerLogin = () => {
  return async (email: string, password: string) => {
    // Check if owner exists and password matches
    const { data: owner, error: ownerError } = await supabase
      .from('owners')
      .select('id, email, name')
      .eq('email', email)
      .single();

    if (ownerError) {
      throw new Error("Invalid credentials");
    }

    // Sign in with Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error("Invalid credentials");
    }

    // Store owner ID in localStorage so we can use it to fetch owner-specific data
    localStorage.setItem('ownerId', owner.id);
    
    return {
      user: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        role: 'owner',
      },
      session: data.session,
    };
  };
};

// Add function to get owner-specific rooms
export const useOwnerRooms = (ownerId: string) => {
  return useQuery({
    queryKey: ["ownerRooms", ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('owner_id', ownerId);
      
      if (error) {
        throw new Error(`Failed to fetch owner rooms: ${error.message}`);
      }
      
      return data;
    },
    enabled: !!ownerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
