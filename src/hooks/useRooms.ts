import { useState, useEffect, useCallback } from 'react';
import { Room } from '@/services/supabase-types';
import { fetchRooms, fetchRoomById, createRoom, updateRoom, deleteRoom, updateRoomStatus } from '@/services/api';

export function useRooms() {
  const [data, setData] = useState<Room[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchRoomsData = useCallback(async () => {
    try {
      setIsLoading(true);
      const rooms = await fetchRooms();
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
      const newRoom = await createRoom(roomData);
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
      const updatedRoom = await updateRoom(id, roomData);
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
      const updatedRoom = await updateRoomStatus(id, status);
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
        const room = await fetchRoomById(id);
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
