import { supabase } from "@/integrations/supabase/client";
import { Room, Booking, User, Owner, Expense } from './supabase-types';

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
      property: room.property_name,
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
      // Include both room_number and property check to ensure the booking is truly for this specific room
      const roomBookings = bookings?.filter(booking => 
        booking.room_number === room.number && 
        (!booking.property || booking.property === room.property)
      ) || [];
      
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
      rate: Math.floor(Math.random() * 150) + 100,
      capacity: Math.floor(Math.random() * 4) + 1
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
      created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
      notes: `Mock booking ${i + 1}`
    }));

    return mockBookings;
  }
};

export const fetchTodayCheckins = async (): Promise<Booking[]> => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('check_in', today);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching today check-ins:', error);

    // Fallback to mock data in case of an error
    const mockCheckins: Booking[] = Array.from({ length: 5 }, (_, i) => ({
      id: `checkin-${i + 1}`,
      booking_number: `CHK${i + 1}`,
      guest_name: `Guest ${i + 1}`,
      guest_email: `guest${i + 1}@example.com`,
      guest_phone: `+1234567890${i}`,
      check_in: today,
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
      created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
      notes: `Mock check-in ${i + 1}`
    }));

    return mockCheckins;
  }
};

export const fetchTodayCheckouts = async (): Promise<Booking[]> => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('check_out', today);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching today check-outs:', error);

    // Fallback to mock data in case of an error
    const mockCheckouts: Booking[] = Array.from({ length: 5 }, (_, i) => ({
      id: `checkout-${i + 1}`,
      booking_number: `CHKOUT${i + 1}`,
      guest_name: `Guest ${i + 1}`,
      guest_email: `guest${i + 1}@example.com`,
      guest_phone: `+1234567890${i}`,
      check_in: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      check_out: today,
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
      created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
      notes: `Mock recent booking ${i + 1}`
    }));

    return mockRecentBookings;
  }
};

export const fetchDashboardStats = async () => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Fetch total bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*');

    if (bookingsError) throw bookingsError;

    // Fetch rooms data
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*');

    if (roomsError) throw roomsError;

    // Count available rooms
    const availableRooms = rooms.filter(room => room.status === 'available').length;

    // Count today's check-ins
    const todayCheckIns = bookings.filter(booking => booking.check_in === today).length;

    // Count today's check-outs
    const todayCheckOuts = bookings.filter(booking => booking.check_out === today).length;

    // Calculate total revenue
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.amount_paid || 0), 0);

    // Calculate current occupancy rate
    const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
    const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;
    
    // Calculate weekly occupancy trend
    // Get data from 7 days ago
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastWeekDate = lastWeek.toISOString().split('T')[0];
    
    // Fetch bookings that were active last week
    const { data: lastWeekBookings, error: lastWeekError } = await supabase
      .from('bookings')
      .select('*')
      .lt('check_in', lastWeekDate)
      .gt('check_out', lastWeekDate);
    
    if (lastWeekError) throw lastWeekError;
    
    // Calculate last week's occupancy
    const lastWeekOccupancy = rooms.length > 0 ? Math.round((lastWeekBookings.length / rooms.length) * 100) : 0;
    
    // Calculate trend (difference between current and last week)
    const weeklyOccupancyTrend = occupancyRate - lastWeekOccupancy;
    const weeklyOccupancyTrendFormatted = weeklyOccupancyTrend >= 0 ? `+${weeklyOccupancyTrend}%` : `${weeklyOccupancyTrend}%`;

    return {
      totalBookings: bookings.length,
      totalRooms: rooms.length,
      availableRooms,
      todayCheckIns,
      todayCheckOuts,
      totalRevenue,
      occupancyRate,
      weeklyOccupancyTrend: weeklyOccupancyTrendFormatted
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);

    // Fallback to mock data in case of an error
    return {
      totalBookings: 0,
      totalRooms: 0,
      availableRooms: 0,
      todayCheckIns: 0,
      todayCheckOuts: 0,
      totalRevenue: 0,
      occupancyRate: 0,
      weeklyOccupancyTrend: "+0%"
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

export const deleteBooking = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting booking with ID ${id}:`, error);
    throw error;
  }
};

export const updateBookingStatus = async (id: string, status: string): Promise<Booking> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating booking status for ID ${id}:`, error);
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
    // Query the rooms table and join with properties to get the property name
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select(`
        id,
        number,
        name,
        property_id,
        properties(name),
        status,
        updated_at
      `)
      .not('property_id', 'is', null);

    if (roomsError) {
      console.error('Error fetching rooms for cleaning status:', roomsError);
      throw roomsError;
    }

    // Format to match the expected structure in the component
    return rooms.map(room => ({
      id: room.id,
      roomId: room.id,
      roomNumber: room.number,
      property: room.properties?.name || 'Main Property', // Use property name instead of ID
      status: mapRoomStatusToCleaningStatus(room.status),
      // Use updated_at as lastCleaned if status is 'available'
      lastCleaned: room.status === 'available' ? room.updated_at : null,
      // We don't have next_check_in in rooms table, but we can populate it from bookings later if needed
      nextCheckIn: null
    }));
  } catch (error) {
    console.error('Error fetching cleaning statuses:', error);
    throw error;
  }
};

export const updateCleaningStatus = async (id: string, status: string) => {
  try {
    // Map cleaning status to room status
    const roomStatus = mapCleaningStatusToRoomStatus(status);
    
    // Update the status in the rooms table
    const { data, error } = await supabase
      .from('rooms')
      .update({ 
        status: roomStatus,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating room status:', error);
      throw error;
    }
    
    // Return the updated record in the format expected by the component
    return {
      id: data[0].id,
      roomId: data[0].id,
      roomNumber: data[0].number,
      property: data[0].property || 'Main Property',
      status: status,
      lastCleaned: status === 'Clean' ? new Date().toISOString() : null,
      nextCheckIn: null
    };
  } catch (error) {
    console.error('Error updating cleaning status:', error);
    throw error;
  }
};

// Helper function to map room status to cleaning status
const mapRoomStatusToCleaningStatus = (roomStatus) => {
  switch (roomStatus) {
    case 'available':
      return 'Clean';
    case 'occupied':
      return 'Dirty';
    case 'cleaning':
      return 'In Progress';
    case 'maintenance':
      return 'Dirty';
    default:
      return 'Dirty';
  }
};

// Helper function to map cleaning status to room status
const mapCleaningStatusToRoomStatus = (cleaningStatus) => {
  switch (cleaningStatus) {
    case 'Clean':
      return 'available';
    case 'Dirty':
      return 'maintenance';
    case 'In Progress':
      return 'cleaning';
    default:
      return 'maintenance';
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

export const fetchRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    
    // Fallback to mock data for development
    return [
      {
        id: '1',
        name: 'Administrator',
        description: 'Full access to all system features',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Manager',
        description: 'Can manage properties, bookings, and view reports',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Front Desk',
        description: 'Can manage bookings and check-ins/outs',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Cleaning Staff',
        description: 'Can update room cleaning status',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Owner',
        description: 'Property owner with access to their properties',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
};

export const fetchPermissions = async () => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    
    // Fallback to mock data that matches the database structure
    return [
      { id: '1', name: 'manage_users', description: 'Create, update, and delete users', category: 'users' },
      { id: '2', name: 'view_users', description: 'View user information', category: 'users' },
      { id: '3', name: 'manage_roles', description: 'Create, update, and delete roles', category: 'users' },
      { id: '4', name: 'manage_bookings', description: 'Create, update, and delete bookings', category: 'bookings' },
      { id: '5', name: 'view_bookings', description: 'View booking information', category: 'bookings' },
      { id: '6', name: 'manage_rooms', description: 'Create, update, and delete rooms', category: 'rooms' },
      { id: '7', name: 'view_rooms', description: 'View room information', category: 'rooms' },
      { id: '8', name: 'manage_properties', description: 'Create, update, and delete properties', category: 'properties' },
      { id: '9', name: 'view_properties', description: 'View property information', category: 'properties' },
      { id: '10', name: 'manage_expenses', description: 'Create, update, and delete expenses', category: 'finances' },
      { id: '11', name: 'view_expenses', description: 'View expense information', category: 'finances' },
      { id: '12', name: 'view_reports', description: 'View financial and occupancy reports', category: 'reports' },
      { id: '13', name: 'manage_settings', description: 'Update system settings', category: 'settings' },
      { id: '14', name: 'view_settings', description: 'View system settings', category: 'settings' },
      { id: '15', name: 'update_cleaning_status', description: 'Update room cleaning status', category: 'cleaning' },
      { id: '16', name: 'view_cleaning_status', description: 'View room cleaning status', category: 'cleaning' },
      { id: '17', name: 'manage_owners', description: 'Create, update, and delete owners', category: 'owners' },
      { id: '18', name: 'view_owners', description: 'View owner information', category: 'owners' },
      { id: '19', name: 'view_audit_logs', description: 'View system audit logs', category: 'security' },
      { id: '20', name: 'manage_staff', description: 'Manage staff members', category: 'users' }
    ];
  }
};

export const fetchRolePermissions = async (roleId: string) => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('*, permissions(*)')
      .eq('role_id', roleId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching permissions for role ${roleId}:`, error);
    
    // Return empty array as fallback
    return [];
  }
};

export const createRole = async (roleData: { name: string; description: string }) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .insert([roleData])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const updateRole = async (id: string, roleData: { name?: string; description?: string }) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .update(roleData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error(`Error updating role with ID ${id}:`, error);
    throw error;
  }
};

export const deleteRole = async (id: string) => {
  try {
    // First delete role permissions associations
    const { error: permissionsError } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', id);

    if (permissionsError) throw permissionsError;

    // Then delete role user associations
    const { error: userRolesError } = await supabase
      .from('user_roles')
      .delete()
      .eq('role_id', id);

    if (userRolesError) throw userRolesError;

    // Finally delete the role
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting role with ID ${id}:`, error);
    throw error;
  }
};

export const assignPermissionsToRole = async (roleId: string, permissionIds: string[]) => {
  try {
    // First remove existing permissions
    const { error: deleteError } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId);

    if (deleteError) throw deleteError;

    // Then add the new permissions
    const permissionsToInsert = permissionIds.map(permissionId => ({
      role_id: roleId,
      permission_id: permissionId
    }));

    const { data, error } = await supabase
      .from('role_permissions')
      .insert(permissionsToInsert)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error assigning permissions to role ${roleId}:`, error);
    throw error;
  }
};

export const assignRoleToUser = async (userId: string, roleId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .insert([{ user_id: userId, role_id: roleId }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error(`Error assigning role ${roleId} to user ${userId}:`, error);
    throw error;
  }
};

export const removeRoleFromUser = async (userId: string, roleId: string) => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error removing role ${roleId} from user ${userId}:`, error);
    throw error;
  }
};

export const fetchUserRoles = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*, roles(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching roles for user ${userId}:`, error);
    return [];
  }
};

export const fetchUsersWithRoles = async () => {
  try {
    // First get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) throw usersError;

    // Then get all user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*, roles(*)');

    if (rolesError) throw rolesError;

    // Combine the data
    const usersWithRoles = users.map(user => {
      const roles = userRoles
        .filter(ur => ur.user_id === user.id)
        .map(ur => ur.roles);
      
      return {
        ...user,
        roles
      };
    });

    return usersWithRoles;
  } catch (error) {
    console.error('Error fetching users with roles:', error);
    
    // Return empty array as fallback
    return [];
  }
};

/**
 * Updates the payment details for a booking.
 * @param bookingId - The ID of the booking to update.
 * @param amountPaid - The new amount paid.
 * @returns The updated booking.
 */
export async function updateBookingPayment(bookingId: string, amountPaid: number) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ amount_paid: amountPaid, payment_status: amountPaid > 0 ? 'partial' : 'pending' })
    .eq('id', bookingId)
    .select();

  if (error) {
    throw new Error(`Failed to update payment: ${error.message}`);
  }

  return data;
}

/**
 * Creates a new room.
 * @param roomData - The room data to create.
 * @returns The created room.
 */
export const createRoom = async (roomData: Partial<Room>): Promise<Room> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .insert([roomData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

/**
 * Updates an existing room.
 * @param id - The ID of the room to update.
 * @param roomData - The updated room data.
 * @returns The updated room.
 */
export const updateRoom = async (id: string, roomData: Partial<Room>): Promise<Room> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .update(roomData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating room with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a room.
 * @param id - The ID of the room to delete.
 */
export const deleteRoom = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting room with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Updates a room's status.
 * @param id - The ID of the room to update.
 * @param status - The new status.
 * @returns The updated room.
 */
export const updateRoomStatus = async (id: string, status: string): Promise<Room> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating room status for ID ${id}:`, error);
    throw error;
  }
};
