
import { owners } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  properties: number;
  revenue: number;
  occupancy: number;
  avatar?: string;
  paymentDetails: {
    bank: string;
    accountNumber: string;
    routingNumber: string;
  };
  joinedDate: string;
}

export const useOwners = () => {
  return useQuery({
    queryKey: ["owners"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return owners;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOwner = (id: string) => {
  return useQuery({
    queryKey: ["owner", id],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const owner = owners.find(o => o.id === id);
      
      if (!owner) {
        throw new Error(`Owner with ID ${id} not found`);
      }
      
      return owner;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
