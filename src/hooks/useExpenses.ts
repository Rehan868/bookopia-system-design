
import { expenses } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";

export const useExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return expenses;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: ["expense", id],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const expense = expenses.find(e => e.id === id);
      
      if (!expense) {
        throw new Error(`Expense with ID ${id} not found`);
      }
      
      return expense;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
