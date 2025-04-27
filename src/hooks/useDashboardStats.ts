
import { dashboardStats } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return dashboardStats;
    },
    staleTime: 1000 * 60, // 1 minute
  });
};
