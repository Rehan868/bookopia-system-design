import { useQuery } from "@tanstack/react-query";
import { fetchOccupancyData } from "@/services/api";

export const useOccupancyData = () => {
  return useQuery({
    queryKey: ["occupancyData"],
    queryFn: fetchOccupancyData,
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
};