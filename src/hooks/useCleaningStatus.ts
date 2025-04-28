
import { fetchCleaningStatuses, updateCleaningStatus } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCleaningStatus = () => {
  return useQuery({
    queryKey: ["cleaningStatus"],
    queryFn: fetchCleaningStatuses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useRoomCleaningStatus = (roomId: string) => {
  const { data: allStatuses } = useCleaningStatus();
  
  return useQuery({
    queryKey: ["cleaningStatus", roomId],
    queryFn: async () => {
      // Find the status for this specific room
      const status = allStatuses?.find(s => s.id === roomId || s.room_number === roomId);
      
      if (!status) {
        throw new Error(`Cleaning status for room ID ${roomId} not found`);
      }
      
      return status;
    },
    enabled: !!roomId && !!allStatuses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateCleaningStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      updateCleaningStatus(id, status),
    onSuccess: () => {
      // Invalidate the cleaning status queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["cleaningStatus"] });
    },
  });
};
