
import { useState, useEffect } from 'react';
import { Booking } from '@/services/supabase-types';
import { fetchBookings, fetchBookingById, fetchTodayCheckouts } from '@/services/api';
import { fetchTodayCheckins } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => fetchBookingById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Only run query if id is provided
  });
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
