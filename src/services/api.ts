
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
  return data;
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
    .select('*');
  
  if (error) throw error;
  return data;
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
  return data;
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
  return data;
};

export const fetchRoomById = async (id: string): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
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
    .insert(expenseData)
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

// Add functions to handle settings
export const updateSystemSetting = async (key: string, value: any) => {
  const { error } = await supabase
    .from('system_settings')
    .upsert({ key, value })
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

