
import { useState, useEffect } from 'react';
import { Booking } from '@/services/supabase-types';
import { fetchBookings, fetchBookingById, fetchTodayCheckins, fetchTodayCheckouts } from '@/services/api';

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

export function useTodayCheckins() {
  const [data, setData] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getCheckins = async () => {
      try {
        setIsLoading(true);
        const checkins = await fetchTodayCheckins();
        setData(checkins);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getCheckins();
  }, []);

  return { data, isLoading, error };
}

export function useTodayCheckouts() {
  const [data, setData] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getCheckouts = async () => {
      try {
        setIsLoading(true);
        const checkouts = await fetchTodayCheckouts();
        setData(checkouts);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getCheckouts();
  }, []);

  return { data, isLoading, error };
}
