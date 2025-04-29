
import { useState, useEffect } from 'react';
import { Room } from '@/services/supabase-types';
import { supabase } from '@/integrations/supabase/client';

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Map the data to ensure it matches the Room type
        const mappedRooms: Room[] = data.map((room: any) => ({
          id: room.id,
          number: room.number,
          type: room.type,
          property_name: room.property_name,
          max_occupancy: room.max_occupancy,
          base_rate: room.base_rate,
          status: room.status,
          property_id: room.property_id,
          owner_id: room.owner_id,
          description: room.description,
          amenities: room.amenities || [],
          image: room.image,
          created_at: room.created_at,
          updated_at: room.updated_at,
          // Additional UI fields
          property: room.property_name,
          capacity: room.max_occupancy,
          rate: room.base_rate,
          floor: ''
        }));
        
        setRooms(mappedRooms);
      } catch (err: any) {
        console.error('Error fetching rooms:', err);
        setError(err.message || 'Failed to fetch rooms');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRooms();
  }, []);
  
  // Add a room
  const addRoom = async (roomData: Partial<Room>) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([roomData])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Map to ensure it matches Room type
      const newRoom: Room = {
        id: data[0].id,
        number: data[0].number,
        type: data[0].type,
        property_name: data[0].property_name,
        max_occupancy: data[0].max_occupancy,
        base_rate: data[0].base_rate,
        status: data[0].status,
        property_id: data[0].property_id,
        owner_id: data[0].owner_id,
        description: data[0].description,
        amenities: data[0].amenities || [],
        image: data[0].image,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at,
        // Additional UI fields
        property: data[0].property_name,
        capacity: data[0].max_occupancy,
        rate: data[0].base_rate,
        floor: ''
      };
      
      setRooms(prevData => [...prevData, newRoom]);
      return newRoom;
    } catch (err: any) {
      console.error('Error adding room:', err);
      throw err;
    }
  };
  
  // Update a room
  const updateRoom = async (id: string, roomData: Partial<Room>) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update(roomData)
        .eq('id', id)
        .select();
        
      if (error) {
        throw error;
      }
      
      // Map to ensure it matches Room type
      const updatedRoom: Room = {
        id: data[0].id,
        number: data[0].number,
        type: data[0].type,
        property_name: data[0].property_name,
        max_occupancy: data[0].max_occupancy,
        base_rate: data[0].base_rate,
        status: data[0].status,
        property_id: data[0].property_id,
        owner_id: data[0].owner_id,
        description: data[0].description,
        amenities: data[0].amenities || [],
        image: data[0].image,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at,
        // Additional UI fields
        property: data[0].property_name,
        capacity: data[0].max_occupancy,
        rate: data[0].base_rate,
        floor: ''
      };
      
      setRooms(prevData => prevData.map(room => room.id === id ? updatedRoom : room));
      return updatedRoom;
    } catch (err: any) {
      console.error('Error updating room:', err);
      throw err;
    }
  };
  
  // Delete a room
  const deleteRoom = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setRooms(prevData => prevData.filter(room => room.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting room:', err);
      throw err;
    }
  };
  
  // Get a single room by ID
  const getRoom = async (id: string): Promise<Room> => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      // Map to ensure it matches Room type
      const room: Room = {
        id: data.id,
        number: data.number,
        type: data.type,
        property_name: data.property_name,
        max_occupancy: data.max_occupancy,
        base_rate: data.base_rate,
        status: data.status,
        property_id: data.property_id,
        owner_id: data.owner_id,
        description: data.description,
        amenities: data.amenities || [],
        image: data.image,
        created_at: data.created_at,
        updated_at: data.updated_at,
        // Additional UI fields
        property: data.property_name,
        capacity: data.max_occupancy,
        rate: data.base_rate,
        floor: ''
      };
      
      return room;
    } catch (err: any) {
      console.error('Error fetching room:', err);
      throw err;
    }
  };
  
  return {
    rooms,
    isLoading,
    error,
    addRoom,
    updateRoom,
    deleteRoom,
    getRoom
  };
};
