
import { useState, useEffect, useCallback } from 'react';
import { Room } from '@/types/room';
import { fetchRooms, fetchRoomById, createRoom, updateRoom, deleteRoom, updateRoomStatus } from '@/services/api';
import { Room as SupabaseRoom } from '@/services/supabase-types';

// Helper function to convert between types
function convertSupabaseRoomToRoom(room: SupabaseRoom): Room {
  return {
    id: room.id,
    number: room.number,
    type: room.type,
    property: room.property_name || '',
    property_name: room.property_name,
    property_id: room.property_id,
    max_occupancy: room.max_occupancy,
    base_rate: room.base_rate,
    status: room.status,
    owner_id: room.owner_id,
    description: room.description,
    amenities: room.amenities,
    image: room.image,
    created_at: room.created_at,
    updated_at: room.updated_at,
    // Add missing fields needed by components
    capacity: room.max_occupancy,
    rate: room.base_rate,
  };
}

export function useRooms() {
  const [data, setData] = useState<Room[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchRoomsData = useCallback(async () => {
    try {
      setIsLoading(true);
      const supabaseRooms = await fetchRooms();
      const rooms = supabaseRooms.map(convertSupabaseRoomToRoom);
      setData(rooms);
      return rooms;
    } catch (err) {
      console.error('Error in useRooms:', err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchRoomsData();
  }, [fetchRoomsData]);

  const addRoom = useCallback(async (roomData: Partial<Room>) => {
    try {
      const newSupabaseRoom = await createRoom(roomData);
      const newRoom = convertSupabaseRoomToRoom(newSupabaseRoom);
      setData(prevData => prevData ? [...prevData, newRoom] : [newRoom]);
      return newRoom;
    } catch (err) {
      console.error('Error adding room:', err);
      setError(err);
      return null;
    }
  }, []);

  const editRoom = useCallback(async (id: string, roomData: Partial<Room>) => {
    try {
      const updatedSupabaseRoom = await updateRoom(id, roomData);
      const updatedRoom = convertSupabaseRoomToRoom(updatedSupabaseRoom);
      setData(prevData => 
        prevData 
          ? prevData.map(room => room.id === id ? updatedRoom : room) 
          : prevData
      );
      return updatedRoom;
    } catch (err) {
      console.error(`Error updating room with ID ${id}:`, err);
      setError(err);
      return null;
    }
  }, []);

  const removeRoom = useCallback(async (id: string) => {
    try {
      await deleteRoom(id);
      setData(prevData => 
        prevData 
          ? prevData.filter(room => room.id !== id) 
          : prevData
      );
      return true;
    } catch (err) {
      console.error(`Error deleting room with ID ${id}:`, err);
      setError(err);
      return false;
    }
  }, []);

  const changeRoomStatus = useCallback(async (id: string, status: string) => {
    try {
      const updatedSupabaseRoom = await updateRoomStatus(id, status);
      const updatedRoom = convertSupabaseRoomToRoom(updatedSupabaseRoom);
      setData(prevData => 
        prevData 
          ? prevData.map(room => room.id === id ? { ...room, status } : room) 
          : prevData
      );
      return updatedRoom;
    } catch (err) {
      console.error(`Error updating room status for ID ${id}:`, err);
      setError(err);
      return null;
    }
  }, []);

  return { 
    data, 
    isLoading, 
    error, 
    addRoom, 
    editRoom, 
    removeRoom, 
    changeRoomStatus,
    refreshRooms: fetchRoomsData
  };
}

export function useRoom(id: string) {
  const [data, setData] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getRoom = async () => {
      if (!id) {
        setIsLoading(false);
        setError(new Error('No room ID provided'));
        return;
      }

      try {
        setIsLoading(true);
        const supabaseRoom = await fetchRoomById(id);
        const room = convertSupabaseRoomToRoom(supabaseRoom);
        setData(room);
      } catch (err) {
        console.error(`Error in useRoom for ID ${id}:`, err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getRoom();
  }, [id]);

  return { data, isLoading, error };
}
