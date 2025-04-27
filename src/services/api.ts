import { supabase } from "@/integrations/supabase/client";
import { Room, Booking, User, Owner, Expense } from './supabase-types';

export const createBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      booking_number: bookingData.booking_number,
      guest_name: bookingData.guest_name,
      guest_email: bookingData.guest_email,
      guest_phone: bookingData.guest_phone,
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      room_number: bookingData.room_number,
      property: bookingData.property,
      adults: bookingData.adults || 1,
      children: bookingData.children || 0,
      amount: bookingData.amount,
      amount_paid: bookingData.amount_paid || 0,
      base_rate: bookingData.base_rate,
      commission: bookingData.commission,
      tourism_fee: bookingData.tourism_fee,
      vat: bookingData.vat,
      net_to_owner: bookingData.net_to_owner,
      security_deposit: bookingData.security_deposit || 0,
      remaining_amount: bookingData.remaining_amount,
      status: bookingData.status || 'pending',
      payment_status: bookingData.payment_status || 'pending',
      guest_document: bookingData.guest_document,
      notes: bookingData.notes
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const fetchRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*');
  
  if (error) throw error;
  
  // Map the DB fields to our component expected fields
  return data.map(room => ({
    ...room,
    property: room.property_name,
    rate: room.base_rate,
    capacity: room.max_occupancy,
    floor: room.number && room.number.length > 1 ? room.number.slice(0, -2) : '1'
  }));
};

export const fetchBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchOwners = async (): Promise<Owner[]> => {
  const { data, error } = await supabase
    .from('owners')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchUserById = async (id: string): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      position: userData.position,
      avatar_url: userData.avatar_url,
      notification_preferences: userData.notification_preferences || {},
      two_factor_enabled: userData.two_factor_enabled || false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      position: userData.position,
      avatar_url: userData.avatar_url,
      notification_preferences: userData.notification_preferences,
      two_factor_enabled: userData.two_factor_enabled,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const updateBooking = async (id: string, bookingData: Partial<Booking>): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      guest_name: bookingData.guest_name,
      guest_email: bookingData.guest_email,
      guest_phone: bookingData.guest_phone,
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      room_number: bookingData.room_number,
      property: bookingData.property,
      adults: bookingData.adults,
      children: bookingData.children,
      amount: bookingData.amount,
      amount_paid: bookingData.amount_paid,
      base_rate: bookingData.base_rate,
      commission: bookingData.commission,
      tourism_fee: bookingData.tourism_fee,
      vat: bookingData.vat,
      net_to_owner: bookingData.net_to_owner,
      security_deposit: bookingData.security_deposit,
      remaining_amount: bookingData.remaining_amount,
      status: bookingData.status,
      payment_status: bookingData.payment_status,
      notes: bookingData.notes
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createRoom = async (roomData: Partial<Room>): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .insert({
      number: roomData.number,
      type: roomData.type,
      property_name: roomData.property_name,
      max_occupancy: roomData.max_occupancy,
      base_rate: roomData.base_rate,
      status: roomData.status || 'available',
      property_id: roomData.property_id,
      owner_id: roomData.owner_id,
      description: roomData.description,
      amenities: roomData.amenities || [],
      image: roomData.image
    })
    .select()
    .single();

  if (error) throw error;
  return data as Room;
};

export const updateRoom = async (id: string, roomData: Partial<Room>): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .update({
      number: roomData.number,
      type: roomData.type,
      property_name: roomData.property_name,
      max_occupancy: roomData.max_occupancy,
      base_rate: roomData.base_rate,
      status: roomData.status,
      property_id: roomData.property_id,
      owner_id: roomData.owner_id,
      description: roomData.description,
      amenities: roomData.amenities,
      image: roomData.image
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Room;
};

export const fetchRoomById = async (id: string): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Map the DB fields to our component expected fields
  const room: Room = {
    ...data,
    // The rooms table uses property_name but some components expect property
    property: data.property_name,
    // Some components use rate instead of base_rate
    rate: data.base_rate,
    // Some components use capacity instead of max_occupancy
    capacity: data.max_occupancy,
    // Calculate floor from room number
    floor: data.number && data.number.length > 1 ? data.number.slice(0, -2) : '1'
  };
  
  return room;
};

export const fetchBookingById = async (id: string): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createExpense = async (expenseData: Partial<Expense>): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      description: expenseData.description!,
      amount: expenseData.amount!,
      category: expenseData.category!,
      date: expenseData.date!,
      property: expenseData.property!,
      vendor: expenseData.vendor,
      payment_method: expenseData.payment_method,
      notes: expenseData.notes,
      receipt_url: expenseData.receipt_url
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateExpense = async (id: string, expenseData: Partial<Expense>): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .update(expenseData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSystemSetting = async (key: string, value: any): Promise<void> => {
  const { error } = await supabase
    .from('system_settings')
    .upsert({ 
      key, 
      value: String(value), // Convert to string since the schema expects text
      category: 'general',
      type: typeof value
    })
    .select();

  if (error) throw error;
};

export const getSystemSettings = async () => {
  const { data, error } = await supabase
    .from('system_settings')
    .select('*');

  if (error) throw error;
  return data;
};

export const fetchTodayCheckins = async (): Promise<Booking[]> => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('check_in', today);
  
  if (error) throw error;
  return data;
};

export const fetchTodayCheckouts = async (): Promise<Booking[]> => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('check_out', today);
  
  if (error) throw error;
  return data;
};

export const fetchCleaningTasks = async () => {
  // Since we don't have a cleaning_tasks table in the schema, we'll derive this from bookings
  // Rooms that had checkouts today need cleaning
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*, rooms(*)')
    .eq('check_out', today);
  
  if (error) throw error;
  
  // Transform booking data into cleaning tasks
  return data.map(booking => ({
    id: booking.id,
    room_number: booking.room_number,
    property: booking.property,
    checkout_date: booking.check_out,
    status: 'pending',
    assigned_to: null,
    priority: 'high',
    notes: `Room needs cleaning after guest ${booking.guest_name} checkout`
  }));
};

export const updateCleaningTaskStatus = async (id: string, status: string) => {
  // In a real implementation, you would update a cleaning_tasks table
  // For now, we'll just return a mock success response
  return {
    id,
    status,
    updated_at: new Date().toISOString()
  };
};
