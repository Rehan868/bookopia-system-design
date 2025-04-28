
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CleaningTask {
  id: string;
  room_number: string;
  property: string;
  status: string;
  assigned_to?: string;
  date?: string;
}

export function useCleaningTasks() {
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        
        // Fetch rooms from supabase
        const { data, error } = await supabase
          .from('rooms')
          .select('id, number, property_name, status');
        
        if (error) throw error;
        
        // Map the data to our tasks format
        const cleaningTasks = data.map(room => ({
          id: room.id,
          room_number: room.number,
          property: room.property_name,
          status: room.status,
          assigned_to: 'Staff Member', // This would come from a join table in a real implementation
          date: new Date().toISOString().split('T')[0] // Today's date
        }));
        
        setTasks(cleaningTasks);
      } catch (err) {
        console.error('Error fetching cleaning tasks:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const updateStatus = async (taskId: string, newStatus: string) => {
    try {
      // Map cleaning status to room status
      let roomStatus = newStatus;
      if (newStatus === 'completed') roomStatus = 'available';
      else if (newStatus === 'in_progress') roomStatus = 'occupied';
      else if (newStatus === 'scheduled') roomStatus = 'booked';
      else if (newStatus === 'delayed') roomStatus = 'maintenance';
      
      // Update the room status in Supabase
      const { data: updatedRoom, error } = await supabase
        .from('rooms')
        .update({ status: roomStatus })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the task in the local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { 
            ...task, 
            status: newStatus 
          } : task
        )
      );
      
      return {
        id: updatedRoom.id,
        room_number: updatedRoom.number,
        property: updatedRoom.property_name,
        status: updatedRoom.status
      };
    } catch (err) {
      console.error('Error updating cleaning task status:', err);
      throw err;
    }
  };

  return { 
    tasks, 
    isLoading, 
    error,
    updateStatus
  };
}
