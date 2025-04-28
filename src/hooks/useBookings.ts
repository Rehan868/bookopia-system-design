import { useState, useEffect } from 'react';
import { Booking } from '@/services/supabase-types';
import { fetchBookings, fetchBookingById, fetchTodayCheckouts } from '@/services/api';
import { fetchTodayCheckins } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useBookings() {
  const [data, setData] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getBookings = async () => {
      try {
        setIsLoading(true);
        const bookings = await fetchBookings();
        setData(bookings);
      } catch (err) {
        console.error('Error in useBookings:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getBookings();
  }, []);

  return { data, isLoading, error };
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
