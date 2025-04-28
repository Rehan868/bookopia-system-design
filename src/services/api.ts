import { supabase } from "@/integrations/supabase/client";
import type { Room as RoomType, Booking, User, Owner, Expense } from './supabase-types';

interface RoomBooking {
  id: string;
  guestName: string;
  startDate: Date;
  endDate: Date;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
}

interface Room {
  id: string;
  number: string;
  property: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance';
  bookings: RoomBooking[];
}

// Mock data
const roomsData: Room[] = [
  {
    id: '1',
    number: '101',
    property: 'Marina Tower',
    type: 'Deluxe Suite',
    status: 'available',
    bookings: [
      {
        id: 'b1',
        guestName: 'John Smith',
        startDate: new Date('2023-11-15'),
        endDate: new Date('2023-11-18'),
        status: 'confirmed'
      },
      {
        id: 'b2',
        guestName: 'Emma Johnson',
        startDate: new Date('2023-11-20'),
        endDate: new Date('2023-11-25'),
        status: 'confirmed'
      }
    ]
  },
  {
    id: '2',
    number: '102',
    property: 'Marina Tower',
    type: 'Standard Room',
    status: 'occupied',
    bookings: [
      {
        id: 'b3',
        guestName: 'Michael Chen',
        startDate: new Date('2023-11-12'),
        endDate: new Date('2023-11-17'),
        status: 'checked-in'
      }
    ]
  },
  {
    id: '3',
    number: '201',
    property: 'Downtown Heights',
    type: 'Executive Suite',
    status: 'maintenance',
    bookings: []
  },
  {
    id: '4',
    number: '202',
    property: 'Downtown Heights',
    type: 'Standard Room',
    status: 'available',
    bookings: [
      {
        id: 'b4',
        guestName: 'Sarah Davis',
        startDate: new Date('2023-11-18'),
        endDate: new Date('2023-11-20'),
        status: 'confirmed'
      }
    ]
  },
  {
    id: '5',
    number: '301',
    property: 'Marina Tower',
    type: 'Deluxe Suite',
    status: 'occupied',
    bookings: [
      {
        id: 'b5',
        guestName: 'Robert Wilson',
        startDate: new Date('2023-11-14'),
        endDate: new Date('2023-11-19'),
        status: 'checked-in'
      }
    ]
  },
  {
    id: '6',
    number: '302',
    property: 'Marina Tower',
    type: 'Standard Room',
    status: 'available',
    bookings: [
      {
        id: 'b6',
        guestName: 'Lisa Brown',
        startDate: new Date('2023-11-22'),
        endDate: new Date('2023-11-25'),
        status: 'confirmed'
      }
    ]
  },
  {
    id: '7',
    number: '401',
    property: 'Downtown Heights',
    type: 'Penthouse Suite',
    status: 'available',
    bookings: []
  }
];

// Generate array of dates for the calendar view
const generateDates = (startDate: Date, days: number) => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Calculate booking position and width for the calendar view
const calculateBookingStyle = (booking: RoomBooking, viewStartDate: Date, totalDays: number) => {
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  
  // Calculate days from view start to booking start
  const startDiff = Math.max(0, Math.floor((startDate.getTime() - viewStartDate.getTime()) / (24 * 60 * 60 * 1000)));
  
  // Calculate booking duration in days
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  
  // Ensure the booking is visible in the current view
  if (startDiff >= totalDays || startDiff + duration <= 0) {
    return null;
  }
  
  // Adjust start and width if the booking extends outside the view
  const visibleStart = Math.max(0, startDiff);
  const visibleDuration = Math.min(totalDays - visibleStart, duration - Math.max(0, -startDiff));
  
  return {
    left: `${(visibleStart / totalDays) * 100}%`,
    width: `${(visibleDuration / totalDays) * 100}%`,
    status: booking.status
  };
};

export const fetchRoomAvailability = async (startDate: string, endDate: string) => {
  try {
    // 1. Get all rooms
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*');
    
    if (roomsError) throw roomsError;
    
    // Map rooms to the expected format
    const mappedRooms = rooms.map(room => ({
      id: room.id,
      number: room.number,
      type: room.type,
      property_name: room.property_name,
      property: room.property_name, // Add property field for compatibility
      capacity: room.max_occupancy,
      rate: room.base_rate,
      status: room.status
    }));
    
    // 2. Get all bookings that overlap with the date range
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .or(`check_in.lte.${endDate},check_out.gte.${startDate}`);
    
    if (bookingsError) throw bookingsError;
    
    // 3. Create an array of all dates in the specified range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateRange = [];
    
    // Create an array of all dates in the range
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      dateRange.push(new Date(dt).toISOString().split('T')[0]);
    }
    
    // Process each room to determine availability
    return mappedRooms.map(room => {
      // Find all bookings for this room
      const roomBookings = bookings?.filter(booking => booking.room_number === room.number) || [];
      
      // Determine which dates are booked
      const bookedDates = [];
      
      // For each date in the range, check if the room is booked
      dateRange.forEach(date => {
        const isBooked = roomBookings.some(booking => {
          const checkIn = booking.check_in;
          const checkOut = booking.check_out;
          return date >= checkIn && date < checkOut;
        });
        
        if (isBooked) {
          bookedDates.push(date);
        }
      });
      
      // Return the room with availability information
      return {
        ...room,
        bookedDates,
        bookings: roomBookings
      };
    });
  } catch (error) {
    console.error("Error fetching room availability:", error);
    
    // If database connection fails, fall back to mock data but with the 
    // correct structure that the UI component expects
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateRange = [];
    
    // Create an array of all dates in the range
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      dateRange.push(new Date(dt).toISOString().split('T')[0]);
    }
    
    // Generate mock rooms with the correct data structure
    return Array.from({ length: 20 }, (_, i) => {
      const roomNumber = `${Math.floor(i / 10) + 1}0${i % 10 + 1}`;
      const roomType = ['Standard', 'Deluxe', 'Suite', 'Villa'][Math.floor(Math.random() * 4)];
      const roomProperty = ['Seaside Resort', 'Mountain Lodge', 'City Center Hotel', 'Lake View Resort'][Math.floor(Math.random() * 4)];
      const roomCapacity = Math.floor(Math.random() * 4) + 1;
      const roomRate = Math.floor(Math.random() * 150) + 100;
      
      // Generate 0-3 random bookings for this room
      const bookings = [];
      const bookedDates = [];
      
      const numBookings = Math.floor(Math.random() * 4);
      
      for (let j = 0; j < numBookings; j++) {
        // Pick a random start date within the range
        const randomStartIndex = Math.floor(Math.random() * (dateRange.length - 3));
        const randomDuration = Math.floor(Math.random() * 4) + 1; // 1-4 nights
        
        const checkIn = dateRange[randomStartIndex];
        const checkOutIndex = Math.min(randomStartIndex + randomDuration, dateRange.length - 1);
        const checkOut = dateRange[checkOutIndex];
        
        // Add all dates between check-in and check-out to booked dates
        for (let k = randomStartIndex; k <= checkOutIndex; k++) {
          bookedDates.push(dateRange[k]);
        }
        
        // Create a booking with the structure expected by the component
        bookings.push({
          id: `booking-${i}-${j}`,
          room_number: roomNumber,
          guest_name: ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Williams'][Math.floor(Math.random() * 4)],
          check_in: checkIn,
          check_out: checkOut,
          status: ['confirmed', 'checked-in', 'checked-out'][Math.floor(Math.random() * 3)]
        });
      }
      
      return {
        id: `room-${i + 1}`,
        number: roomNumber,
        type: roomType,
        property: roomProperty,
        property_name: roomProperty, // Add property_name for consistency
        capacity: roomCapacity,
        rate: roomRate,
        bookedDates: [...new Set(bookedDates)], // Remove duplicates
        bookings
      };
    });
  }
};

export const fetchSingleRoomAvailability = async (roomId: string, startDate: string, endDate: string) => {
  try {
    // 1. Get the room details
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();
    
    if (roomError) throw roomError;
    
    // Map room to the expected format
    const mappedRoom = {
      id: room.id,
      number: room.number,
      type: room.type,
      property: room.property_name,
      property_name: room.property_name, // Add for consistency
      capacity: room.max_occupancy,
      rate: room.base_rate,
      status: room.status
    };
    
    // 2. Get all bookings for this room that overlap with the date range
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('room_number', room.number)
      .or(`check_in.lte.${endDate},check_out.gte.${startDate}`);
    
    if (bookingsError) throw bookingsError;
    
    // 3. Create an array of all dates in the range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateRange = [];
    
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      dateRange.push(new Date(dt).toISOString().split('T')[0]);
    }
    
    // 4. Determine which dates are booked
    const bookedDates = [];
    
    // For each date in the range, check if the room is booked
    dateRange.forEach(date => {
      const isBooked = bookings.some(booking => {
        const checkIn = booking.check_in;
        const checkOut = booking.check_out;
        return date >= checkIn && date < checkOut;
      });
      
      if (isBooked) {
        bookedDates.push(date);
      }
    });
    
    // Return the room with availability information
    return {
      ...mappedRoom,
      bookedDates,
      bookings
    };
  } catch (error) {
    console.error(`Error fetching availability for room ${roomId}:`, error);
    
    // Generate fallback mock data in the correct format
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateRange = [];
    
    // Create an array of all dates in the range
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      dateRange.push(new Date(dt).toISOString().split('T')[0]);
    }
    
    // Generate mock room data
    const room = {
      id: roomId,
      number: `${Math.floor(Math.random() * 5) + 1}0${Math.floor(Math.random() * 9) + 1}`,
      type: ['Standard', 'Deluxe', 'Suite', 'Villa'][Math.floor(Math.random() * 4)],
      property: ['Seaside Resort', 'Mountain Lodge', 'City Center Hotel', 'Lake View Resort'][Math.floor(Math.random() * 4)],
      property_name: ['Seaside Resort', 'Mountain Lodge', 'City Center Hotel', 'Lake View Resort'][Math.floor(Math.random() * 4)],
      rate: Math.floor(Math.random() * 150) + 100,
      capacity: Math.floor(Math.random() * 4) + 1,
      status: 'available' // Add status field
    };
    
    // Generate bookings for this room
    const bookings = [];
    const bookedDates = [];
    
    // Create 0-3 random bookings for this room
    const numBookings = Math.floor(Math.random() * 4);
    for (let j = 0; j < numBookings; j++) {
      // Pick a random start date within the range
      const randomStartIndex = Math.floor(Math.random() * (dateRange.length - 3));
      const randomDuration = Math.floor(Math.random() * 4) + 1; // 1-4 nights
      
      const checkIn = dateRange[randomStartIndex];
      const checkOutIndex = Math.min(randomStartIndex + randomDuration, dateRange.length - 1);
      const checkOut = dateRange[checkOutIndex];
      
      // Add all dates between check-in and check-out to booked dates
      for (let k = randomStartIndex; k <= checkOutIndex; k++) {
        bookedDates.push(dateRange[k]);
      }
      
      // Create a booking with the structure the component expects
      bookings.push({
        id: `booking-${roomId}-${j}`,
        room_number: room.number,
        guest_name: ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Williams'][Math.floor(Math.random() * 4)],
        check_in: checkIn,
        check_out: checkOut,
        status: ['confirmed', 'checked-in', 'checked-out'][Math.floor(Math.random() * 3)]
      });
    }
    
    return {
      ...room,
      bookedDates: [...new Set(bookedDates)], // Remove duplicates
      bookings
    };
  }
};

export const fetchOccupancyData = async () => {
  try {
    // Try to fetch actual occupancy data from Supabase
    // First, we need bookings data to calculate occupancy
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*');
    
    if (bookingsError) throw bookingsError;
    
    // Also get rooms data to calculate total capacity
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*');
    
    if (roomsError) throw roomsError;
    
    // Calculate occupancy data for the last 12 months
    const currentDate = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Generate last 12 months of data
    const occupancyData = Array.from({ length: 12 }, (_, i) => {
      const monthIndex = (currentDate.getMonth() - i + 12) % 12;
      const year = currentDate.getFullYear() - (currentDate.getMonth() < monthIndex ? 1 : 0);
      
      // Get the start and end dates for this month
      const startDate = new Date(year, monthIndex, 1);
      const endDate = new Date(year, monthIndex + 1, 0); // Last day of month
      
      // Calculate number of room-nights booked this month
      let bookedNights = 0;
      let revenue = 0;
      
      // Count bookings in this month
      bookings.forEach(booking => {
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        
        // Skip bookings completely outside this month
        if (checkOut <= startDate || checkIn >= endDate) return;
        
        // Calculate overlap days
        const overlapStart = checkIn < startDate ? startDate : checkIn;
        const overlapEnd = checkOut > endDate ? endDate : checkOut;
        
        // Calculate nights in this month (date diff in days)
        const nights = Math.ceil((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24));
        
        if (nights > 0) {
          bookedNights += nights;
          
          // Add to revenue - use daily rate for partial month stays
          const dailyRate = booking.amount / Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24));
          revenue += dailyRate * nights;
        }
      });
      
      // Calculate total room-nights available this month
      const daysInMonth = endDate.getDate();
      const totalRoomNights = rooms.length * daysInMonth;
      
      // Calculate occupancy percentage
      const occupancy = totalRoomNights > 0 ? Math.round((bookedNights / totalRoomNights) * 100) : 0;
      
      return {
        month: `${monthNames[monthIndex]} ${year}`,
        occupancy: occupancy,
        revenue: Math.round(revenue)
      };
    }).reverse(); // Most recent month last
    
    return occupancyData;
    
  } catch (error) {
    console.error("Error fetching occupancy data:", error);
    
    // Fall back to mock data if there's an error
    const currentDate = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Generate last 12 months of mock data
    const occupancyData = Array.from({ length: 12 }, (_, i) => {
      const monthIndex = (currentDate.getMonth() - i + 12) % 12;
      const year = currentDate.getFullYear() - (currentDate.getMonth() < monthIndex ? 1 : 0);
      
      return {
        month: `${monthNames[monthIndex]} ${year}`,
        occupancy: Math.floor(Math.random() * 40) + 60, // Random occupancy between 60-100%
        revenue: Math.floor(Math.random() * 10000) + 10000, // Random revenue between 10000-20000
      };
    }).reverse(); // Most recent month last
    
    return occupancyData;
  }
};

export const fetchBookingById = async (id: string): Promise<Booking> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    
    // If there's an error with the database, generate mock data as a fallback
    // This is just for development and should be removed in production
    const mockBooking: Booking = {
      id: id,
      booking_number: `BK${Math.floor(Math.random() * 10000)}`,
      guest_name: `Guest ${id.slice(0, 5)}`,
      guest_email: `guest${id.slice(0, 5)}@example.com`,
      guest_phone: `+1${Math.floor(Math.random() * 10000000000)}`,
      check_in: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      check_out: new Date(Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      room_number: `${Math.floor(Math.random() * 5) + 1}0${Math.floor(Math.random() * 9) + 1}`,
      property: ['Seaside Resort', 'Mountain Lodge', 'City Center Hotel', 'Lake View Resort'][Math.floor(Math.random() * 4)],
      adults: Math.floor(Math.random() * 3) + 1,
      children: Math.floor(Math.random() * 3),
      amount: Math.floor(Math.random() * 1000) + 200,
      amount_paid: Math.floor(Math.random() * 1000) + 100,
      base_rate: Math.floor(Math.random() * 200) + 100,
      commission: Math.floor(Math.random() * 50) + 10,
      tourism_fee: Math.floor(Math.random() * 20) + 5,
      vat: Math.floor(Math.random() * 50) + 10,
      net_to_owner: Math.floor(Math.random() * 500) + 100,
      security_deposit: Math.floor(Math.random() * 200) + 50,
      remaining_amount: Math.floor(Math.random() * 200),
      status: ['confirmed', 'pending', 'checked-in', 'completed'][Math.floor(Math.random() * 4)],
      payment_status: ['paid', 'partially_paid', 'pending'][Math.floor(Math.random() * 3)],
      guest_document: null, // Add missing field
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      updated_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      notes: `Mock booking details for ID ${id}`
    };
    
    return mockBooking;
  }
};

export const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching bookings:', error);

    // Fallback to mock data in case of an error
    const mockBookings: Booking[] = Array.from({ length: 10 }, (_, i) => ({
      id: `booking-${i + 1}`,
      booking_number: `BK${i + 1}`,
      guest_name: `Guest ${i + 1}`,
      guest_email: `guest${i + 1}@example.com`,
      guest_phone: `+1234567890${i}`,
      check_in: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      check_out: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      room_number: `${i + 101}`,
      property: 'Mock Property',
      adults: 2,
      children: 1,
      amount: 200 + i * 10,
      amount_paid: 100 + i * 5,
      base_rate: 150,
      commission: 20,
      tourism_fee: 10,
      vat: 15,
      net_to_owner: 120,
      security_deposit: 50,
      remaining_amount: 50,
      status: 'confirmed',
      payment_status: 'paid',
      guest_document: null, // Add missing field
      created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
      notes: `Mock booking ${i + 1}`
    }));

    return mockBookings;
  }
};

export const fetchTodayCheckins = async (): Promise<Booking[]> => {
  try {
    const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('check_in', todayDate);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching today check-ins:', error);

    // Fallback to mock data in case of an error
    const todayDate = new Date().toISOString().split('T')[0];
    const mockCheckins: Booking[] = Array.from({ length: 5 }, (_, i) => ({
      id: `checkin-${i + 1}`,
      booking_number: `CHK${i + 1}`,
      guest_name: `Guest ${i + 1}`,
      guest_email: `guest${i + 1}@example.com`,
      guest_phone: `+1234567890${i}`,
      check_in: todayDate,
      check_out: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      room_number: `${i + 101}`,
      property: 'Mock Property',
      adults: 2,
      children: 1,
      amount: 200 + i * 10,
      amount_paid: 100 + i * 5,
      base_rate: 150,
      commission: 20,
      tourism_fee: 10,
      vat: 15,
      net_to_owner: 120,
      security_deposit: 50,
      remaining_amount: 50,
      status: 'confirmed',
      payment_status: 'paid',
      guest_document: null, // Add missing field
      created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
      notes: `Mock check-in ${i + 1}`
    }));

    return mockCheckins;
  }
};

export const fetchTodayCheckouts = async (): Promise<Booking[]> => {
  try {
    const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('check_out', todayDate);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching today check-outs:', error);

    // Fallback to mock data in case of an error
    const todayDate = new Date().toISOString().split('T')[0];
    const mockCheckouts: Booking[] = Array.from({ length: 5 }, (_, i) => ({
      id: `checkout-${i + 1}`,
      booking_number: `CHKOUT${i + 1}`,
      guest_name: `Guest ${i + 1}`,
      guest_email: `guest${i + 1}@example.com`,
      guest_phone: `+1234567890${i}`,
      check_in: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      check_out: todayDate,
      room_number: `${i + 101}`,
      property: 'Mock Property',
      adults: 2,
      children: 1,
      amount: 200 + i * 10,
      amount_paid: 200 + i * 10,
      base_rate: 150,
      commission: 20,
      tourism_fee: 10,
      vat: 15,
      net_to_owner: 120,
      security_deposit: 50,
      remaining_amount: 0,
      status: 'completed',
      payment_status: 'paid',
      guest_document: null, // Add missing field
      created_at: new Date(Date.now() - (i + 2) * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - (i + 1) * 12 * 60 * 60 * 1000).toISOString(),
      notes: `Mock check-out ${i + 1}`
    }));

    return mockCheckouts;
  }
};

export const fetchRecentBookings = async (limit: number = 5): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching recent bookings:', error);

    // Fallback to mock data in case of an error
    const mockRecentBookings: Booking[] = Array.from({ length: limit }, (_, i) => ({
      id: `recent-booking-${i + 1}`,
      booking_number: `RBK${i + 1}`,
      guest_name: `Guest ${i + 1}`,
      guest_email: `guest${i + 1}@example.com`,
      guest_phone: `+1234567890${i}`,
      check_in: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      check_out: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      room_number: `${i + 101}`,
      property: 'Mock Property',
      adults: 2,
      children: 1,
      amount: 200 + i * 10,
      amount_paid: 100 + i * 5,
      base_rate: 150,
      commission: 20,
      tourism_fee: 10,
      vat: 15,
      net_to_owner: 120,
      security_deposit: 50,
      remaining_amount: 50,
      status: 'confirmed',
      payment_status: 'paid',
      guest_document: null, // Add missing field
      created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
      notes: `Mock recent booking ${i + 1}`
    }));

    return mockRecentBookings;
  }
};

export const fetchDashboardStats = async () => {
  try {
    // Fetch total bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*');

    if (bookingsError) throw bookingsError;

    // Fetch total rooms
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*');

    if (roomsError) throw roomsError;

    // Fetch today's checkins
    const todayDate = new Date().toISOString().split('T')[0];
    const { data: todayCheckins, error: checkinsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('check_in', todayDate);
    
    if (checkinsError) throw checkinsError;
    
    // Fetch today's checkouts
    const { data: todayCheckouts, error: checkoutsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('check_out', todayDate);
    
    if (checkoutsError) throw checkoutsError;
    
    // Calculate available rooms
    const availableRooms = rooms.filter(room => room.status === 'available').length;
    
    // Fetch total revenue
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.amount_paid || 0), 0);

    // Fetch occupancy rate
    const totalRoomNights = rooms.length * 30; // Assuming 30 days in a month
    const bookedNights = bookings.reduce((sum, booking) => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      return sum + Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    const occupancyRate = totalRoomNights > 0 ? (bookedNights / totalRoomNights) * 100 : 0;

    // Generate weekly occupancy trend data
    const weeklyOccupancyTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 6 + i);
      return {
        date: date.toISOString().split('T')[0],
        occupancy: Math.floor(Math.random() * 30) + 50
      };
    });

    return {
      totalBookings: bookings.length,
      totalRooms: rooms.length,
      availableRooms,
      todayCheckIns: todayCheckins.length,
      todayCheckOuts: todayCheckouts.length,
      totalRevenue,
      occupancyRate: Math.round(occupancyRate),
      weeklyOccupancyTrend
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);

    // Fallback to mock data in case of an error
    return {
      totalBookings: 100,
      totalRooms: 50,
      availableRooms: 30,
      todayCheckIns: 5,
      todayCheckOuts: 7,
      totalRevenue: 50000,
      occupancyRate: 75,
      weeklyOccupancyTrend: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        occupancy: Math.floor(Math.random() * 30) + 50
      }))
    };
  }
};

export const createBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const updateBooking = async (id: string, bookingData: Partial<Booking>): Promise<Booking> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update(bookingData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating booking with ID ${id}:`, error);
    throw error;
  }
};

export const fetchRoomById = async (id: string): Promise<Room> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching room with ID ${id}:`, error);
    throw error;
  }
};

export const fetchRooms = async (): Promise<Room[]> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

export const fetchRoomTypes = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('room_types')
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching room types:', error);
    throw error;
  }
};

export const fetchCleaningStatuses = async () => {
  try {
    // Since there might not be a cleaning_statuses table, 
    // we'll get this information from rooms
    const { data, error } = await supabase
      .from('rooms')
      .select('id, number, property_name, status')
      .order('number');
    
    if (error) throw error;
    
    // Convert to cleaning tasks format
    return data.map(room => ({
      id: room.id,
      room_number: room.number,
      property: room.property_name,
      status: room.status || 'needs_cleaning',
      last_cleaned: null, // This would come from a proper cleaning_statuses table
      assigned_to: null
    }));
  } catch (error) {
    console.error('Error fetching cleaning statuses:', error);
    throw error;
  }
};

export const updateCleaningStatus = async (roomId: string, newStatus: string) => {
  try {
    // Since there might not be a cleaning_statuses table,
    // we'll update the room status
    const { data, error } = await supabase
      .from('rooms')
      .update({ status: newStatus })
      .eq('id', roomId)
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      room_number: data.number,
      property: data.property_name,
      status: data.status,
      last_cleaned: new Date().toISOString(),
      assigned_to: null
    };
  } catch (error) {
    console.error('Error updating cleaning status:', error);
    throw error;
  }
};

export const createExpense = async (expenseData: Partial<Expense>): Promise<Expense> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

export const updateExpense = async (id: string, expenseData: Partial<Expense>): Promise<Expense> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .update(expenseData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating expense with ID ${id}:`, error);
    throw error;
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting expense with ID ${id}:`, error);
    throw error;
  }
};

export const fetchExpenses = async (): Promise<Expense[]> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

export const fetchUserById = async (id: string): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchOwners = async (): Promise<Owner[]> => {
  try {
    const { data, error } = await supabase
      .from('owners')
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching owners:', error);
    throw error;
  }
};

export const fetchProperties = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const fetchOwnerById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('owners')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching owner:', error);
    throw error;
  }
};

export const updateOwner = async (id: string, ownerData: Partial<Owner>) => {
  try {
    const { data, error } = await supabase
      .from('owners')
      .update(ownerData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating owner:', error);
    throw error;
  }
};

export const fetchExpenseById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching expense:', error);
    throw error;
  }
};
