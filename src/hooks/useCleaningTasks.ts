
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCleaningTasks, updateCleaningTaskStatus } from '@/services/api';
import { useToast } from './use-toast';

export const useCleaningTasks = () => {
  return useQuery({
    queryKey: ['cleaning-tasks'],
    queryFn: fetchCleaningTasks
  });
};

export const useUpdateCleaningTaskStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => {
      return updateCleaningTaskStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cleaning-tasks'] });
      toast({
        title: 'Cleaning task updated',
        description: 'The cleaning task status has been updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update cleaning task',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};
