
import { properties } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";

export const useProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return properties;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const property = properties.find(p => p.id === id);
      
      if (!property) {
        throw new Error(`Property with ID ${id} not found`);
      }
      
      return property;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
