import { useState, useEffect, useCallback } from 'react';
import { Booking } from '@/services/supabase-types';
import { 
  fetchBookings, 
  fetchBookingById, 
  fetchTodayCheckouts, 
  fetchTodayCheckins, 
  deleteBooking, 
  updateBookingStatus,
  updateBookingPayment
} from '@/services/api';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from '@/hooks/use-toast';

export function useBookings() {
  const [data, setData] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const bookings = await fetchBookings();
      setData(bookings);
      setError(null);
    } catch (err) {
      console.error('Error in useBookings:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const removeBooking = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await deleteBooking(id);
      await fetchData(); // Refetch the data after deletion
      toast({
        title: "Booking Deleted",
        description: "The booking has been successfully deleted.",
      });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['todayCheckins'] });
      queryClient.invalidateQueries({ queryKey: ['todayCheckouts'] });
      queryClient.invalidateQueries({ queryKey: ['recentBookings'] });
      return true;
    } catch (err) {
      console.error(`Error deleting booking ${id}:`, err);
      setError(err);
      toast({
        title: "Error",
        description: "There was an error deleting the booking. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, toast, queryClient]);

  const changeBookingStatus = useCallback(async (id: string, status: string) => {
    try {
      setIsLoading(true);
      await updateBookingStatus(id, status);
      await fetchData(); // Refetch the data after status update
      toast({
        title: "Booking Updated",
        description: `The booking has been marked as ${status}.`,
      });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['todayCheckins'] });
      queryClient.invalidateQueries({ queryKey: ['todayCheckouts'] });
      queryClient.invalidateQueries({ queryKey: ['recentBookings'] });
      return true;
    } catch (err) {
      console.error(`Error updating booking status ${id}:`, err);
      setError(err);
      toast({
        title: "Error",
        description: "There was an error updating the booking status. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, toast, queryClient]);

  const updatePayment = async (bookingId: string, amountPaid: number) => {
    try {
      const updatedBooking = await updateBookingPayment(bookingId, amountPaid);
      return updatedBooking;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  };

  return { 
    data, 
    isLoading, 
    error, 
    refetch: fetchData, 
    removeBooking,
    changeBookingStatus,
    updatePayment
  };
}

export function useBooking(id: string) {
  const [data, setData] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getBooking = async () => {
      if (!id) {
        setIsLoading(false);
        setError(new Error('No booking ID provided'));
        return;
      }
      
      try {
        setIsLoading(true);
        const booking = await fetchBookingById(id);
        setData(booking);
      } catch (err) {
        console.error(`Error in useBooking for ID ${id}:`, err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getBooking();
  }, [id]);

  return { data, isLoading, error };
}

export const useTodayCheckins = () => {
  return useQuery({
    queryKey: ["todayCheckins"],
    queryFn: fetchTodayCheckins,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export function useTodayCheckouts() {
  return useQuery({
    queryKey: ["todayCheckouts"],
    queryFn: fetchTodayCheckouts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
