import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from "@/services/api";

export const useExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: ["expense", id],
    queryFn: async () => {
      const expenses = await fetchExpenses();
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

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};
