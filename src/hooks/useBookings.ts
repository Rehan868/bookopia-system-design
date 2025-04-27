import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/services/supabase-types';

// Mock data for bookings
const mockBookings = [
  {
    id: '1',
    booking_number: 'BK-2023-0001',
    guest_name: 'John Smith',
    check_in: '2023-06-15',
    check_out: '2023-06-18',
    status: 'confirmed',
    amount: 450,
    rooms: { number: '101', property: 'Marina Tower' },
    commission: 45,
    tourismFee: 13.5,
    vat: 22.5,
    netToOwner: 369,
    securityDeposit: 100,
    baseRate: 150,
    adults: 2,
    children: 0,
    guestEmail: 'john.smith@example.com',
    guestPhone: '+1 (555) 123-4567',
    payment_status: 'paid',
    amountPaid: 450,
    pendingAmount: 0,
    guestDocument: 'passport-123.pdf'
  },
  {
    id: '2',
    booking_number: 'BK-2023-0002',
    guest_name: 'Emma Johnson',
    check_in: '2023-06-14',
    check_out: '2023-06-16',
    status: 'checked-in',
    amount: 350,
    rooms: { number: '205', property: 'Downtown Heights' },
    commission: 35,
    tourismFee: 10.5,
    vat: 18,
    netToOwner: 295,
    securityDeposit: 100,
    baseRate: 150,
    adults: 1,
    children: 1,
    guestEmail: 'emma.johnson@example.com',
    guestPhone: '+1 (555) 987-6543',
    payment_status: 'pending',
    amountPaid: 350,
    pendingAmount: 0
  },
  {
    id: '3',
    booking_number: 'BK-2023-0003',
    guest_name: 'Michael Chen',
    check_in: '2023-06-12',
    check_out: '2023-06-13',
    status: 'checked-out',
    amount: 175,
    rooms: { number: '304', property: 'Marina Tower' },
    commission: 17.5,
    tourismFee: 5.25,
    vat: 8.75,
    netToOwner: 142.5,
    securityDeposit: 100,
    baseRate: 150,
    adults: 1,
    children: 0,
    guestEmail: 'michael.chen@example.com',
    guestPhone: '+1 (555) 555-1234',
    payment_status: 'paid',
    amountPaid: 175,
    pendingAmount: 0
  },
  {
    id: '4',
    booking_number: 'BK-2023-0004',
    guest_name: 'Sarah Davis',
    check_in: '2023-06-18',
    check_out: '2023-06-20',
    status: 'confirmed',
    amount: 300,
    rooms: { number: '102', property: 'Downtown Heights' },
    commission: 30,
    tourismFee: 9,
    vat: 16.5,
    netToOwner: 253.5,
    securityDeposit: 100,
    baseRate: 150,
    adults: 2,
    children: 0,
    guestEmail: 'sarah.davis@example.com',
    guestPhone: '+1 (555) 321-6543',
    payment_status: 'pending',
    amountPaid: 300,
    pendingAmount: 0
  },
  {
    id: '5',
    booking_number: 'BK-2023-0005',
    guest_name: 'David Wilson',
    check_in: '2023-06-10',
    check_out: '2023-06-15',
    status: 'checked-out',
    amount: 625,
    rooms: { number: '401', property: 'Marina Tower' },
    commission: 62.5,
    tourismFee: 18.75,
    vat: 31.25,
    netToOwner: 521.25,
    securityDeposit: 100,
    baseRate: 150,
    adults: 2,
    children: 0,
    guestEmail: 'david.wilson@example.com',
    guestPhone: '+1 (555) 789-1234',
    payment_status: 'paid',
    amountPaid: 625,
    pendingAmount: 0
  },
];

// Define a more complete type for what we get from Supabase
interface BookingDataFromDB {
  id: string;
  booking_number: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  status: string;
  amount: number;
  adults?: number;
  children?: number;
  room_id?: string;
  property_id?: string;
  special_requests?: string | null;
  created_at?: string;
  created_by?: string;
  guest_id?: string;
  updated_at?: string;
  payment_status?: string;
  rooms?: { number: string; property: string };
  // These are the custom fields that we calculate or set defaults for
  commission?: number;
  tourismFee?: number;
  vat?: number;
  netToOwner?: number;
  securityDeposit?: number;
  baseRate?: number;
  guestEmail?: string;
  guestPhone?: string;
  guestDocument?: string;
  notes?: string;
  amountPaid?: number;
  pendingAmount?: number;
}

// Helper function to properly enhance a booking with calculated fields
function enhanceBooking(booking: BookingDataFromDB): Booking {
  const amount = Number(booking.amount || 0);
  
  return {
    ...booking,
    commission: booking.commission !== undefined ? booking.commission : amount * 0.1,
    tourismFee: booking.tourismFee !== undefined ? booking.tourismFee : amount * 0.03,
    vat: booking.vat !== undefined ? booking.vat : amount * 0.05,
    netToOwner: booking.netToOwner !== undefined ? booking.netToOwner : amount * 0.82,
    securityDeposit: booking.securityDeposit !== undefined ? booking.securityDeposit : 100,
    baseRate: booking.baseRate !== undefined ? booking.baseRate : amount * 0.8,
    adults: booking.adults !== undefined ? booking.adults : 1,
    children: booking.children !== undefined ? booking.children : 0,
    guestEmail: booking.guestEmail || '',
    guestPhone: booking.guestPhone || '',
    guestDocument: booking.guestDocument || '',
    payment_status: booking.payment_status || 'pending',
    amountPaid: booking.amountPaid !== undefined ? booking.amountPaid : 0,
    pendingAmount: booking.pendingAmount !== undefined ? booking.pendingAmount : amount,
    // Ensure all required Booking type fields are present
    room_id: booking.room_id || '',
    special_requests: booking.special_requests || null,
    created_at: booking.created_at || new Date().toISOString(),
    updated_at: booking.updated_at || new Date().toISOString()
  } as Booking;
}

export function useBookings() {
  const [data, setData] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch from Supabase first
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*, rooms(number, property:type)');
          
        if (bookingsError) {
          console.warn('Error fetching from Supabase, using mock data:', bookingsError);
          // Fallback to mock data
          setData(mockBookings as unknown as Booking[]);
        } else if (bookingsData && bookingsData.length > 0) {
          // Transform the data to match our Booking type using the enhanceBooking function
          const transformedData = bookingsData.map((booking: BookingDataFromDB) => 
            enhanceBooking(booking)
          );
          
          setData(transformedData);
        } else {
          // If Supabase returns empty data, use mock data
          setData(mockBookings as unknown as Booking[]);
        }
      } catch (err) {
        console.error('Error in useBookings:', err);
        setError(err);
        setData(mockBookings as unknown as Booking[]); // Fallback to mock data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { data, isLoading, error };
}

// Hook for individual booking data
export function useBooking(id: string) {
  const [data, setData] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) {
        setIsLoading(false);
        setError(new Error('No booking ID provided'));
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Try to fetch from Supabase first
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*, rooms(number, property:type)')
          .eq('id', id)
          .single();
          
        if (bookingError) {
          console.warn(`Error fetching booking ${id} from Supabase, using mock data:`, bookingError);
          // Fallback to mock data
          const booking = mockBookings.find(booking => booking.id === id);
          
          if (booking) {
            setData(booking as unknown as Booking);
          } else {
            throw new Error('Booking not found');
          }
        } else if (bookingData) {
          // Use the enhanceBooking helper to properly format the data
          const enhancedBooking = enhanceBooking(bookingData as BookingDataFromDB);
          setData(enhancedBooking);
        } else {
          throw new Error('Booking not found');
        }
      } catch (err) {
        console.error(`Error in useBooking for ID ${id}:`, err);
        setError(err instanceof Error ? err : new Error('Failed to fetch booking'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  return { data, isLoading, error };
}

export function useTodayCheckins() {
  const [data, setData] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const today = new Date().toISOString().split('T')[0];
        const checkins = mockBookings.filter(
          booking => booking.check_in.split('T')[0] === today && booking.status === 'confirmed'
        );
        
        setData(checkins as unknown as Booking[]);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}

export function useTodayCheckouts() {
  const [data, setData] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const today = new Date().toISOString().split('T')[0];
        const checkouts = mockBookings.filter(
          booking => booking.check_out.split('T')[0] === today && booking.status === 'checked-in'
        );
        
        setData(checkouts as unknown as Booking[]);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}
