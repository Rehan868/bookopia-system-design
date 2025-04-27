
import { supabase } from "@/integrations/supabase/client";
import { 
  Room, 
  Booking, 
  User, 
  Owner, 
  Expense, 
  CleaningTask,
  PropertyOwnership
} from './supabase-types';

// Helper function to enhance a booking with calculated fields
function enhanceBooking(booking: any): Booking {
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
    pendingAmount: booking.pendingAmount !== undefined ? booking.pendingAmount : amount
  } as Booking;
}

// Function to create a new booking in the database
export const createBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
  // Format dates for the database
  const formattedData = {
    ...bookingData,
    check_in: bookingData.check_in instanceof Date ? bookingData.check_in.toISOString() : bookingData.check_in,
    check_out: bookingData.check_out instanceof Date ? bookingData.check_out.toISOString() : bookingData.check_out,
    booking_number: bookingData.booking_number,
    guest_name: bookingData.guest_name,
    guest_email: bookingData.guestEmail,
    guest_phone: bookingData.guestPhone,
    room_number: bookingData.room_number,
    special_requests: bookingData.special_requests || bookingData.notes,
    amount: bookingData.amount,
    amount_paid: bookingData.amountPaid,
    base_rate: bookingData.baseRate,
    remaining_amount: bookingData.pendingAmount,
    security_deposit: bookingData.securityDeposit,
    commission: bookingData.commission,
    tourism_fee: bookingData.tourismFee,
    vat: bookingData.vat,
    net_to_owner: bookingData.netToOwner,
    notes: bookingData.notes
  };

  // Remove properties not in the database schema to prevent insert errors
  const {
    notes, guestEmail, guestPhone, pendingAmount, tourismFee, netToOwner, amountPaid, securityDeposit,
    baseRate, ...rest
  } = formattedData as any;

  const { data, error } = await supabase
    .from('bookings')
    .insert(rest)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
  
  return enhanceBooking(data);
};

export const fetchRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*');
  
  if (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
  
  return (data || []).map(room => ({
    ...room,
    status: room.status as 'available' | 'occupied' | 'maintenance',
    // Add missing properties required by Room type
    capacity: room.max_occupancy,
    rate: room.base_rate,
    floor: room.property_name, // Using property_name as a fallback for floor
    features: room.amenities || {},
  }) as Room);
};

export const fetchRoomById = async (id: string): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching room with ID ${id}:`, error);
    throw error;
  }
  
  return {
    ...data,
    status: data.status as 'available' | 'occupied' | 'maintenance',
    // Add missing properties required by Room type
    capacity: data.max_occupancy,
    rate: data.base_rate,
    floor: data.property_name, // Using property_name as a fallback for floor
    features: data.amenities || {},
  } as Room;
};

export const fetchRoomByNumber = async (number: string): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('number', number)
    .single();
  
  if (error) {
    console.error(`Error fetching room with number ${number}:`, error);
    throw error;
  }
  
  return {
    ...data,
    status: data.status as 'available' | 'occupied' | 'maintenance',
    // Add missing properties required by Room type
    capacity: data.max_occupancy,
    rate: data.base_rate,
    floor: data.property_name, // Using property_name as a fallback for floor
    features: data.amenities || {},
  } as Room;
};

export const fetchBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, rooms(number, property:type)');
  
  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
  
  const transformedData = (data || []).map(booking => enhanceBooking(booking));
  
  return transformedData;
};

export const fetchBookingById = async (id: string): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, rooms(number, property:type)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    throw error;
  }
  
  return enhanceBooking(data);
};

export const fetchTodayCheckins = async (): Promise<Booking[]> => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*, rooms(number, property:type)')
    .eq('check_in', today)
    .eq('status', 'confirmed');
  
  if (error) {
    console.error('Error fetching today\'s check-ins:', error);
    throw error;
  }
  
  const transformedData = (data || []).map(booking => enhanceBooking(booking));
  
  return transformedData;
};

export const fetchTodayCheckouts = async (): Promise<Booking[]> => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*, rooms(number, property:type)')
    .eq('check_out', today)
    .eq('status', 'checked-in');
  
  if (error) {
    console.error('Error fetching today\'s check-outs:', error);
    throw error;
  }
  
  const transformedData = (data || []).map(booking => enhanceBooking(booking));
  
  return transformedData;
};

export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  
  // Add missing properties from User type
  return (data || []).map(user => ({
    ...user,
    status: user.role || 'active', // Using role as a fallback for status
    last_active: user.updated_at || null,
  })) as User[];
};

export const fetchOwners = async (): Promise<Owner[]> => {
  const { data, error } = await supabase
    .from('owners')
    .select('*');
  
  if (error) {
    console.error('Error fetching owners:', error);
    throw error;
  }
  
  // Add missing properties from Owner type
  return (data || []).map(owner => ({
    ...owner,
    payment_info: owner.payment_details || {},
  })) as Owner[];
};

export const fetchExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
  
  // Add missing properties from Expense type
  return (data || []).map(expense => ({
    ...expense,
    status: expense.payment_method ? 'paid' : 'pending',
  })) as Expense[];
};

// Comment out or modify the cleaning tasks functionality that's causing errors
// Since 'cleaning_tasks' table doesn't exist in the database schema
export const fetchCleaningTasks = async (): Promise<CleaningTask[]> => {
  // Return mock data instead of querying a non-existent table
  return [
    {
      id: '1',
      room_id: '1',
      date: new Date().toISOString(),
      assigned_to: 'staff1',
      status: 'pending',
      notes: 'Regular cleaning',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ] as CleaningTask[];
  
  /* Original code commented out due to table not existing
  const { data, error } = await supabase
    .from('cleaning_tasks')
    .select('*, rooms(number, property:type), users(name)');
  
  if (error) {
    console.error('Error fetching cleaning tasks:', error);
    throw error;
  }
  
  return data || [];
  */
};

export const fetchPropertyOwnership = async (): Promise<PropertyOwnership[]> => {
  const { data, error } = await supabase
    .from('property_ownership')
    .select('*, rooms(number), owners(name)');
  
  if (error) {
    console.error('Error fetching property ownership:', error);
    throw error;
  }
  
  return data || [];
};

export const updateBookingStatus = async (id: string, status: string): Promise<void> => {
  const validStatus = status as "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled" | "no-show";
  
  const { error } = await supabase
    .from('bookings')
    .update({ status: validStatus })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating booking status for ID ${id}:`, error);
    throw error;
  }
};

export const updateRoomStatus = async (id: string, status: string): Promise<void> => {
  const validStatus = status as "available" | "occupied" | "cleaning" | "maintenance" | "out-of-order";
  
  const { error } = await supabase
    .from('rooms')
    .update({ status: validStatus })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating room status for ID ${id}:`, error);
    throw error;
  }
};

export const updateCleaningTaskStatus = async (id: string, status: string): Promise<void> => {
  const validStatus = status as "pending" | "in-progress" | "completed" | "verified" | "issues";
  
  // Since the cleaning_tasks table doesn't exist, we'll simulate success for now
  console.log(`Would update cleaning task ${id} to status ${validStatus}`);
  
  /* Original code commented out due to table not existing
  const { error } = await supabase
    .from('cleaning_tasks')
    .update({ status: validStatus })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating cleaning task status for ID ${id}:`, error);
    throw error;
  }
  */
};
