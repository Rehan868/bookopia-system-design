
import { useQuery } from "@tanstack/react-query";
import { fetchBookings } from "@/services/api";

export const useRecentBookings = (limit: number = 5) => {
  return useQuery({
    queryKey: ["recentBookings", limit],
    queryFn: async () => {
      const bookings = await fetchBookings();
      return bookings.slice(0, limit);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
