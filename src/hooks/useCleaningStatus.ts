
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define our CleaningStatus type
export interface CleaningStatus {
  id: string;
  roomId: string;
  roomNumber: string;
  property: string;
  status: 'Clean' | 'Dirty' | 'In Progress';
  lastCleaned: string | null;
  nextCheckIn: string | null;
}

// Function to fetch cleaning statuses from Supabase
const fetchCleaningStatuses = async (): Promise<CleaningStatus[]> => {
  const { data, error } = await supabase
    .from('rooms')
    .select(`
      id,
      number,
      property_name,
      status
    `);

  if (error) {
    console.error("Error fetching cleaning statuses:", error);
    throw error;
  }
  
  // Map to the expected format
  return data.map(room => ({
    id: room.id,
    roomId: room.id,
    roomNumber: room.number,
    property: room.property_name,
    status: mapRoomStatusToCleaningStatus(room.status),
    lastCleaned: null, // This would come from a join if we had that table
    nextCheckIn: null   // This would come from bookings if we had that relationship
  }));
};

// Function to map room status to cleaning status
const mapRoomStatusToCleaningStatus = (status: string): 'Clean' | 'Dirty' | 'In Progress' => {
  switch (status) {
    case 'available':
      return 'Clean';
    case 'maintenance':
      return 'Dirty';
    case 'occupied':
      return 'In Progress';
    default:
      return 'Dirty';
  }
};

// Function to update cleaning status in Supabase
const updateCleaningStatus = async (id: string, status: string): Promise<CleaningStatus> => {
  // Convert cleaning status to room status
  const roomStatus = mapCleaningStatusToRoomStatus(status);
  
  const { data, error } = await supabase
    .from('rooms')
    .update({ status: roomStatus })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating cleaning status:", error);
    throw error;
  }

  // Return the updated record in our expected format
  return {
    id: data.id,
    roomId: data.id,
    roomNumber: data.number,
    property: data.property_name,
    status: mapRoomStatusToCleaningStatus(data.status),
    lastCleaned: null,
    nextCheckIn: null
  };
};

// Function to map cleaning status to room status
const mapCleaningStatusToRoomStatus = (status: string): string => {
  switch (status) {
    case 'Clean':
      return 'available';
    case 'Dirty':
      return 'maintenance';
    case 'In Progress':
      return 'occupied';
    default:
      return 'maintenance';
  }
};

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
      if (!allStatuses) {
        throw new Error("No cleaning statuses available");
      }
      
      // Find the status for this specific room
      const status = allStatuses.find(s => s.roomId === roomId);
      
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
