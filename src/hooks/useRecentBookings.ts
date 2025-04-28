import { useQuery } from "@tanstack/react-query";
import { fetchRecentBookings as fetchRecentBookingsAPI } from "@/services/api";

export const useRecentBookings = (limit = 5) => {
  return useQuery({
    queryKey: ["recentBookings", limit],
    queryFn: () => fetchRecentBookingsAPI(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};