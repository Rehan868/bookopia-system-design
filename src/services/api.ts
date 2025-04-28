
import { supabase } from '@/services/supabase';

// Booking functions
export const fetchBookings = async () => {
  const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const fetchRecentBookings = fetchBookings; // Alias for compatibility

export const fetchBooking = async (id: string) => {
  const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

// Alias to maintain compatibility with existing imports
export const fetchBookingById = fetchBooking;

export const createBooking = async (booking: any) => {
  const { data, error } = await supabase.from('bookings').insert([booking]).select();
  if (error) throw error;
  return data[0];
};

export const updateBooking = async (id: string, booking: any) => {
  const { data, error } = await supabase.from('bookings').update(booking).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteBooking = async (id: string) => {
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) throw error;
  return true;
};

// Status and payment update specific functions
export const updateBookingStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
};

export const updateBookingPayment = async (id: string, amountPaid: number) => {
  const booking = await fetchBooking(id);
  const amount = booking.amount || 0;
  const remaining = Math.max(0, amount - amountPaid);
  const paymentStatus = remaining <= 0 ? 'paid' : 'partial';
  
  const { data, error } = await supabase
    .from('bookings')
    .update({
      amount_paid: amountPaid,
      remaining_amount: remaining,
      payment_status: paymentStatus
    })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Today's check-ins and check-outs
export const fetchTodayCheckins = async () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('check_in', today)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchTodayCheckouts = async () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('check_out', today)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Room functions
export const fetchRooms = async () => {
  const { data, error } = await supabase.from('rooms').select('*').order('property_name', { ascending: true });
  if (error) throw error;
  return data;
};

export const fetchRoom = async (id: string) => {
  const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

// Alias to maintain compatibility with existing imports
export const fetchRoomById = fetchRoom;

export const createRoom = async (room: any) => {
  const { data, error } = await supabase.from('rooms').insert([room]).select();
  if (error) throw error;
  return data[0];
};

export const updateRoom = async (id: string, room: any) => {
  const { data, error } = await supabase.from('rooms').update(room).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteRoom = async (id: string) => {
  const { error } = await supabase.from('rooms').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const updateRoomStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .update({ status })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
};

export const fetchRoomTypes = async () => {
  const { data, error } = await supabase.from('room_types').select('*');
  if (error) throw error;
  return data;
};

// Property functions
export const fetchProperties = async () => {
  const { data, error } = await supabase.from('properties').select('*');
  if (error) throw error;
  return data;
};

export const fetchProperty = async (id: string) => {
  const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

// User and Role functions
export const fetchUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
};

export const fetchUser = async (id: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

// Alias to maintain compatibility
export const fetchUserById = fetchUser;

export const createUser = async (user: any) => {
  const { data, error } = await supabase.from('users').insert([user]).select();
  if (error) throw error;
  return data[0];
};

export const updateUser = async (id: string, user: any) => {
  const { data, error } = await supabase.from('users').update(user).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const fetchRoles = async () => {
  const { data, error } = await supabase.from('roles').select('*');
  if (error) throw error;
  return data;
};

export const fetchPermissions = async () => {
  const { data, error } = await supabase.from('permissions').select('*');
  if (error) throw error;
  return data;
};

export const createRole = async (role: any) => {
  const { data, error } = await supabase.from('roles').insert([role]).select();
  if (error) throw error;
  return data[0];
};

export const updateRole = async (id: string, role: any) => {
  const { data, error } = await supabase.from('roles').update(role).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteRole = async (id: string) => {
  const { error } = await supabase.from('roles').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const fetchRolePermissions = async (roleId: string) => {
  const { data, error } = await supabase
    .from('role_permissions')
    .select('permission_id')
    .eq('role_id', roleId);
  if (error) throw error;
  return data.map(item => item.permission_id);
};

export const assignPermissionsToRole = async (roleId: string, permissionIds: string[]) => {
  // First remove all existing permissions for this role
  await supabase.from('role_permissions').delete().eq('role_id', roleId);
  
  // Then add the new permissions
  const permissionsToInsert = permissionIds.map(permissionId => ({
    role_id: roleId,
    permission_id: permissionId
  }));
  
  const { error } = await supabase.from('role_permissions').insert(permissionsToInsert);
  if (error) throw error;
  return true;
};

export const assignRoleToUser = async (userId: string, roleId: string) => {
  const { data, error } = await supabase.from('user_roles').insert([{ user_id: userId, role_id: roleId }]);
  if (error) throw error;
  return true;
};

export const removeRoleFromUser = async (userId: string, roleId: string) => {
  const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role_id', roleId);
  if (error) throw error;
  return true;
};

// Expense functions
export const fetchExpenses = async () => {
  const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data;
};

export const fetchExpense = async (id: string) => {
  const { data, error } = await supabase.from('expenses').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createExpense = async (expense: any) => {
  const { data, error } = await supabase.from('expenses').insert([expense]).select();
  if (error) throw error;
  return data[0];
};

export const updateExpense = async (id: string, expense: any) => {
  const { data, error } = await supabase.from('expenses').update(expense).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteExpense = async (id: string) => {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw error;
  return true;
};

// Cleaning functions
export const fetchCleaningTasks = async () => {
  // This is a mock function that should be updated when the actual endpoint is available
  const rooms = await fetchRooms();
  return rooms.map(room => ({
    id: room.id,
    room_number: room.number,
    property: room.property_name,
    status: ['clean', 'dirty', 'maintenance'][Math.floor(Math.random() * 3)],
    last_cleaned: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_to: ['John Doe', 'Jane Smith', 'Unassigned'][Math.floor(Math.random() * 3)]
  }));
};

export const updateCleaningTaskStatus = async (id: string, status: string) => {
  // This is a mock function that should be updated when the actual endpoint is available
  return { id, status };
};

// Availability and Occupancy functions
export const fetchRoomAvailability = async (startDate: string, endDate: string) => {
  // This would typically interact with an availability service or check bookings
  const rooms = await fetchRooms();
  const bookings = await fetchBookings();
  
  return rooms.map(room => {
    const roomBookings = bookings.filter(b => b.room_number === room.number);
    return {
      id: room.id,
      number: room.number,
      type: room.type,
      property: room.property_name,
      capacity: room.max_occupancy,
      rate: room.base_rate,
      status: room.status,
      bookedDates: calculateBookedDates(roomBookings, startDate, endDate),
      bookings: roomBookings
    };
  });
};

export const fetchSingleRoomAvailability = async (roomId: string, startDate: string, endDate: string) => {
  const room = await fetchRoom(roomId);
  const bookings = await fetchBookings();
  const roomBookings = bookings.filter(b => b.room_number === room.number);
  
  return {
    id: room.id,
    number: room.number,
    type: room.type,
    property: room.property_name,
    capacity: room.max_occupancy,
    rate: room.base_rate,
    status: room.status,
    bookedDates: calculateBookedDates(roomBookings, startDate, endDate),
    bookings: roomBookings
  };
};

export const fetchDashboardStats = async () => {
  // This is a mock function that should be updated when the actual endpoint is available
  const rooms = await fetchRooms();
  const bookings = await fetchBookings();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayCheckIns = bookings.filter(b => new Date(b.check_in).toDateString() === today.toDateString()).length;
  const todayCheckOuts = bookings.filter(b => new Date(b.check_out).toDateString() === today.toDateString()).length;
  
  // Calculate occupancy
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const totalRooms = rooms.length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  
  return {
    availableRooms: totalRooms - occupiedRooms,
    totalRooms,
    todayCheckIns,
    todayCheckOuts,
    occupancyRate,
    weeklyOccupancyTrend: generateMockWeeklyOccupancy()
  };
};

export const fetchOccupancyData = async () => {
  // This is a mock function that should return occupancy data for the past X days
  return generateMockOccupancyData();
};

// Owner functions
export const fetchOwners = async () => {
  const { data, error } = await supabase.from('owners').select('*');
  if (error) throw error;
  return data;
};

export const fetchOwner = async (id: string) => {
  const { data, error } = await supabase.from('owners').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

// Utility functions for the API
function calculateBookedDates(bookings: any[], startDateStr: string, endDateStr: string) {
  const bookedDates: string[] = [];
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  
  bookings.forEach(booking => {
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    
    let currentDate = new Date(Math.max(checkIn.getTime(), startDate.getTime()));
    const lastDate = new Date(Math.min(checkOut.getTime(), endDate.getTime()));
    
    while (currentDate < lastDate) {
      bookedDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
  
  return bookedDates;
}

function generateMockWeeklyOccupancy() {
  return Array(7).fill(0).map((_, i) => ({
    day: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    occupancy: Math.floor(Math.random() * 100)
  }));
}

function generateMockOccupancyData() {
  const data = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      occupancy: Math.floor(50 + Math.random() * 50)
    });
  }
  
  return data;
}
