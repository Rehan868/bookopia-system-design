
import { useState, useEffect } from 'react';
import { fetchCleaningStatuses, updateCleaningStatus } from '@/services/api';

export const useCleaningTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCleaningStatuses();
        setTasks(data);
      } catch (err: any) {
        console.error('Error fetching cleaning tasks:', err);
        setError(err.message || 'Failed to fetch cleaning tasks');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const updatedTask = await updateCleaningStatus(taskId, status);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status } : task
        )
      );
      
      return updatedTask;
    } catch (err: any) {
      console.error('Error updating task status:', err);
      throw err;
    }
  };
  
  return {
    tasks,
    isLoading,
    error,
    updateTaskStatus
  };
};
