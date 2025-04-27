
import { cleaningStatus } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";

export const useCleaningStatus = () => {
  return useQuery({
    queryKey: ["cleaningStatus"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return cleaningStatus;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useRoomCleaningStatus = (roomId: string) => {
  return useQuery({
    queryKey: ["cleaningStatus", roomId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const status = cleaningStatus.find(s => s.roomId === roomId);
      
      if (!status) {
        throw new Error(`Cleaning status for room ID ${roomId} not found`);
      }
      
      return status;
    },
    enabled: !!roomId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
