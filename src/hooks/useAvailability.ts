import { useQuery } from "@tanstack/react-query";
import { fetchRoomAvailability, fetchSingleRoomAvailability } from "@/services/api";
import { addMonths, format } from "date-fns";

// Hook for fetching availability data for all rooms within a date range
export function useAvailability(startDate = new Date(), endDateOrRange?: Date | number) {
  // If endDateOrRange is a number, treat it as the number of months to display
  const endDate = endDateOrRange instanceof Date 
    ? endDateOrRange 
    : addMonths(startDate, typeof endDateOrRange === 'number' ? endDateOrRange : 3);
  
  // Format dates for the API
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  
  return useQuery({
    queryKey: ['availability', formattedStartDate, formattedEndDate],
    queryFn: () => fetchRoomAvailability(formattedStartDate, formattedEndDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for fetching availability data for a single room
export function useSingleRoomAvailability(roomId: string, startDate = new Date(), endDateOrRange?: Date | number) {
  // If endDateOrRange is a number, treat it as the number of months to display
  const endDate = endDateOrRange instanceof Date 
    ? endDateOrRange 
    : addMonths(startDate, typeof endDateOrRange === 'number' ? endDateOrRange : 3);
  
  // Format dates for the API
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  
  return useQuery({
    queryKey: ['roomAvailability', roomId, formattedStartDate, formattedEndDate],
    queryFn: () => fetchSingleRoomAvailability(roomId, formattedStartDate, formattedEndDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!roomId, // Only run query if roomId is provided
  });
}