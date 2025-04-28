
import { useState, useEffect } from 'react';
import { fetchCleaningStatuses, updateCleaningStatus } from '@/services/api';

export function useCleaningTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        setIsLoading(true);
        const cleaningTasks = await fetchCleaningStatuses();
        setTasks(cleaningTasks);
      } catch (err) {
        console.error('Error fetching cleaning tasks:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getTasks();
  }, []);

  const updateStatus = async (taskId: string, newStatus: string) => {
    try {
      const updatedTask = await updateCleaningStatus(taskId, newStatus);
      
      // Update the task in the local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      
      return updatedTask;
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
