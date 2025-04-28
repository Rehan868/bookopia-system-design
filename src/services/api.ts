
import { supabase } from './supabase';
import { Room, Booking, User, Owner, Expense } from './supabase-types';

// Rooms
export const fetchRooms = async (): Promise<Room[]> => {
  try {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }

    return rooms || [];
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
};

export const fetchRoomById = async (id: string): Promise<Room | null> => {
  try {
    const { data: room, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching room with ID ${id}:`, error);
      throw error;
    }

    return room || null;
  } catch (error) {
    console.error(`Error fetching room with ID ${id}:`, error);
    return null;
  }
};

// Bookings
export const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }

    return bookings || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

export const fetchRecentBookings = async (limit: number = 5): Promise<Booking[]> => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent bookings:', error);
      throw error;
    }

    return bookings || [];
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    return [];
  }
};

export const fetchBookingById = async (id: string): Promise<Booking | null> => {
  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching booking with ID ${id}:`, error);
      throw error;
    }

    return booking || null;
  } catch (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    return null;
  }
};

export const deleteBooking = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting booking with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting booking with ID ${id}:`, error);
    throw error;
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

// Users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const fetchUserById = async (id: string): Promise<User | null> => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }

    return user || null;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    return null;
  }
};

export const createUser = async (user: Partial<User>): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(user)
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

    if (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

// Owners
export const fetchOwners = async (): Promise<Owner[]> => {
  try {
    const { data: owners, error } = await supabase
      .from('owners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching owners:', error);
      throw error;
    }

    return owners || [];
  } catch (error) {
    console.error('Error fetching owners:', error);
    return [];
  }
};

export const fetchOwnerById = async (id: string): Promise<Owner | null> => {
  try {
    const { data: owner, error } = await supabase
      .from('owners')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching owner with ID ${id}:`, error);
      throw error;
    }

    return owner || null;
  } catch (error) {
    console.error(`Error fetching owner with ID ${id}:`, error);
    return null;
  }
};

export const createOwner = async (owner: Partial<Owner>): Promise<Owner> => {
  try {
    const { data, error } = await supabase
      .from('owners')
      .insert(owner)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating owner:', error);
    throw error;
  }
};

export const updateOwner = async (id: string, owner: Partial<Owner>): Promise<Owner> => {
  try {
    const { data, error } = await supabase
      .from('owners')
      .update(owner)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating owner with ID ${id}:`, error);
    throw error;
  }
};

export const deleteOwner = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('owners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting owner with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting owner with ID ${id}:`, error);
    throw error;
  }
};

// Expenses
export const fetchExpenses = async (): Promise<Expense[]> => {
  try {
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }

    return expenses || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
};

export const fetchExpenseById = async (id: string): Promise<Expense | null> => {
  try {
    const { data: expense, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching expense with ID ${id}:`, error);
      throw error;
    }

    return expense || null;
  } catch (error) {
    console.error(`Error fetching expense with ID ${id}:`, error);
    return null;
  }
};

export const createExpense = async (expense: Partial<Expense>): Promise<Expense> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

export const updateExpense = async (id: string, expense: Partial<Expense>): Promise<Expense> => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .update(expense)
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

    if (error) {
      console.error(`Error deleting expense with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting expense with ID ${id}:`, error);
    throw error;
  }
};

// Auth
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Error signing up:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      console.error('Error resetting password:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const updatePassword = async (password: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error('Error updating password:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const fetchUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const fetchTodayCheckins = async (): Promise<Booking[]> => {
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('check_in', today);

    if (error) {
      console.error('Error fetching today\'s check-ins:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching today\'s check-ins:', error);
    return [];
  }
};

export const fetchTodayCheckouts = async (): Promise<Booking[]> => {
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('check_out', today);

    if (error) {
      console.error('Error fetching today\'s check-outs:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching today\'s check-outs:', error);
    return [];
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

export const updateBookingPayment = async (bookingId: string, amountPaid: number): Promise<Booking> => {
  try {
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError) throw fetchError;

    const newRemainingAmount = booking.amount - amountPaid;
    const newPaymentStatus = newRemainingAmount <= 0 ? 'paid' : 'partially_paid';

    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        amount_paid: amountPaid, 
        remaining_amount: newRemainingAmount,
        payment_status: newPaymentStatus
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating payment for booking ID ${bookingId}:`, error);
    throw error;
  }
};

export const createRoom = async (room: Partial<Room>): Promise<Room> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .insert([room])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

export const updateRoom = async (id: string, room: Partial<Room>): Promise<Room> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .update(room)
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

// Role and permission management functions
export const fetchRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

export const fetchUserRoles = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching roles for user ID ${userId}:`, error);
    return [];
  }
};

export const createRole = async (role: { name: string; description?: string }) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .insert(role)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const updateRole = async (id: string, role: { name: string; description?: string }) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .update(role)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating role with ID ${id}:`, error);
    throw error;
  }
};

export const deleteRole = async (id: string) => {
  try {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting role with ID ${id}:`, error);
    throw error;
  }
};

export const fetchPermissions = async () => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return [];
  }
};

export const fetchRolePermissions = async (roleId: string) => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('permission_id')
      .eq('role_id', roleId);

    if (error) throw error;
    return data?.map(item => item.permission_id) || [];
  } catch (error) {
    console.error(`Error fetching permissions for role ID ${roleId}:`, error);
    return [];
  }
};

export const assignPermissionsToRole = async (roleId: string, permissionIds: string[]) => {
  try {
    // First delete all existing permissions for this role
    const { error: deleteError } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId);

    if (deleteError) throw deleteError;

    // Then insert new permissions
    if (permissionIds.length > 0) {
      const rolePermissions = permissionIds.map(permissionId => ({
        role_id: roleId,
        permission_id: permissionId
      }));

      const { error: insertError } = await supabase
        .from('role_permissions')
        .insert(rolePermissions);

      if (insertError) throw insertError;
    }

    return true;
  } catch (error) {
    console.error(`Error assigning permissions to role ID ${roleId}:`, error);
    throw error;
  }
};

export const fetchCleaningTasks = async () => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select(`
        id,
        number as room_number,
        property_name as property,
        status,
        updated_at as last_cleaned,
        'Unassigned' as assigned_to
      `)
      .order('property_name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching cleaning tasks:', error);
    return [];
  }
};

export const updateCleaningTaskStatus = async (id: string, status: string) => {
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
    console.error(`Error updating cleaning task status for room ID ${id}:`, error);
    throw error;
  }
};

// Add missing API functions
export const fetchProperties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

export const fetchRoomAvailability = async (startDate: string, endDate: string) => {
  try {
    // Fetch rooms
    const { data: rooms, error: roomError } = await supabase
      .from('rooms')
      .select('*');

    if (roomError) throw roomError;

    // Fetch bookings for the date range
    const { data: bookings, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .or(`check_in.gte.${startDate},check_out.lte.${endDate}`)
      .or(`check_in.lte.${startDate},check_out.gte.${startDate}`)
      .or(`check_in.lte.${endDate},check_out.gte.${endDate}`);

    if (bookingError) throw bookingError;

    // Map rooms with availability data
    const roomsWithAvailability = rooms.map(room => {
      const roomBookings = bookings.filter(b => b.room_number === room.number);
      
      // Create an array of dates that are booked for this room
      const bookedDates: string[] = [];
      
      roomBookings.forEach(booking => {
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        
        // Add all dates between check-in and check-out to bookedDates
        const currentDate = new Date(checkIn);
        while (currentDate <= checkOut) {
          bookedDates.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
      
      return {
        id: room.id,
        number: room.number,
        type: room.type,
        property: room.property_name,
        property_name: room.property_name,
        capacity: room.max_occupancy,
        rate: room.base_rate,
        bookedDates: [...new Set(bookedDates)], // Remove duplicates
        bookings: roomBookings
      };
    });

    return roomsWithAvailability;
  } catch (error) {
    console.error('Error fetching room availability:', error);
    return [];
  }
};

export const fetchSingleRoomAvailability = async (roomId: string, startDate: string, endDate: string) => {
  try {
    // Fetch the room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (roomError) throw roomError;

    // Fetch bookings for this room within the date range
    const { data: bookings, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('room_number', room.number)
      .or(`check_in.gte.${startDate},check_out.lte.${endDate}`)
      .or(`check_in.lte.${startDate},check_out.gte.${startDate}`)
      .or(`check_in.lte.${endDate},check_out.gte.${endDate}`);

    if (bookingError) throw bookingError;

    // Create an array of dates that are booked for this room
    const bookedDates: string[] = [];
      
    bookings.forEach(booking => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      
      // Add all dates between check-in and check-out to bookedDates
      const currentDate = new Date(checkIn);
      while (currentDate <= checkOut) {
        bookedDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    return {
      id: room.id,
      number: room.number,
      type: room.type,
      property: room.property_name,
      capacity: room.max_occupancy,
      rate: room.base_rate,
      bookedDates: [...new Set(bookedDates)], // Remove duplicates
      bookings: bookings
    };
  } catch (error) {
    console.error(`Error fetching availability for room ID ${roomId}:`, error);
    return {
      id: '',
      number: '',
      type: '',
      property: '',
      capacity: 0,
      rate: 0,
      bookedDates: [],
      bookings: []
    };
  }
};

export const fetchDashboardStats = async () => {
  try {
    // Fetch room counts
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('status');

    if (roomsError) throw roomsError;

    const availableRooms = rooms.filter(room => room.status === 'available').length;
    const totalRooms = rooms.length;

    // Fetch today's check-ins and check-outs
    const today = new Date().toISOString().split('T')[0];
    
    const { data: todayCheckInsData, error: checkinError } = await supabase
      .from('bookings')
      .select('id')
      .eq('check_in', today);

    if (checkinError) throw checkinError;

    const { data: todayCheckOutsData, error: checkoutError } = await supabase
      .from('bookings')
      .select('id')
      .eq('check_out', today);

    if (checkoutError) throw checkoutError;

    // Calculate occupancy rate
    const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return {
      availableRooms,
      totalRooms,
      todayCheckIns: todayCheckInsData?.length || 0,
      todayCheckOuts: todayCheckOutsData?.length || 0,
      occupancyRate,
      weeklyOccupancyTrend: '+2%' // Mock value, would need to be calculated
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      availableRooms: 0,
      totalRooms: 0,
      todayCheckIns: 0,
      todayCheckOuts: 0,
      occupancyRate: 0,
      weeklyOccupancyTrend: '0%'
    };
  }
};

export const fetchOccupancyData = async () => {
  try {
    // This would typically fetch real data from the API
    // For now, returning mock data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const mockData = [];
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      
      mockData.push({
        date: currentDate.toISOString().split('T')[0],
        occupancy: Math.floor(Math.random() * 40) + 60 // Random number between 60-100
      });
    }
    
    return mockData;
  } catch (error) {
    console.error('Error fetching occupancy data:', error);
    return [];
  }
};
