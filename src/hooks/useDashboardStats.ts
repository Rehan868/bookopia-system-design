import { fetchDashboardStats } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
