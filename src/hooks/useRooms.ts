
import { useState, useEffect } from 'react';
import { Room } from '@/services/supabase-types';
import { fetchRooms, fetchRoomById } from '@/services/api';

export function useRooms() {
  const [data, setData] = useState<Room[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getRooms = async () => {
      try {
        setIsLoading(true);
        const rooms = await fetchRooms();
        // Convert to Room[] type as defined in supabase-types
        setData(rooms as unknown as Room[]);
      } catch (err) {
        console.error('Error in useRooms:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getRooms();
  }, []);

  return { data, isLoading, error };
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
        // Convert to Room type as defined in supabase-types
        setData(room as unknown as Room);
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
