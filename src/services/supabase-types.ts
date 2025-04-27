
export type Room = {
  id: string;
  number: string;
  type: string;
  capacity: number;
  rate: number;
  status: 'available' | 'occupied' | 'maintenance';
  floor: string;
  description: string | null;
  amenities: string[];
  features: any;
  created_at: string;
  updated_at: string;
  property?: string; // Adding property field as it's used in RoomList component
  maintenance?: boolean; // Adding maintenance field used in other components
  lastCleaned?: string; // Adding lastCleaned field
  nextCheckIn?: string | null; // Adding nextCheckIn field
};

export type Booking = {
  id: string;
  room_id: string;
  booking_number: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  amount: number;
  status: string;
  payment_status: string;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
  rooms?: any; // Adding rooms property that comes from join queries
  // Financial fields
  commission: number;
  tourismFee: number;
  vat: number;
  netToOwner: number;
  securityDeposit: number;
  baseRate: number;
  // Guest information
  adults: number;
  children: number;
  guestEmail: string;
  guestPhone: string;
  guestDocument?: string; // Adding guestDocument field for passport/ID document
  notes?: string;
  amountPaid: number;
  pendingAmount: number;
  // Other fields from the database
  property_id?: string;
  guest_id?: string;
  created_by?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar_url: string | null;
  last_active: string | null;
  created_at: string;
  updated_at: string;
};

export type Owner = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  payment_info: any;
  created_at: string;
  updated_at: string;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CleaningTask = {
  id: string;
  room_id: string;
  date: string;
  assigned_to: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PropertyOwnership = {
  id: string;
  room_id: string;
  owner_id: string;
  commission_rate: number;
  contract_start_date: string;
  contract_end_date: string | null;
  created_at: string;
  updated_at: string;
};
