
export type Room = {
  id: string;
  number: string;
  type: string;
  property_name: string;
  max_occupancy: number;
  base_rate: number;
  status: 'available' | 'occupied' | 'maintenance';
  property_id?: string;
  owner_id?: string;
  description: string | null;
  amenities: string[];
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  booking_number: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  room_number: string;
  property: string;
  adults: number;
  children: number;
  amount: number;
  amount_paid: number | null;
  base_rate: number;
  commission: number | null;
  tourism_fee: number | null;
  vat: number | null;
  net_to_owner: number | null;
  security_deposit: number | null;
  remaining_amount: number | null;
  status: string;
  payment_status: string;
  guest_document: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  phone?: string;
  position?: string;
  avatar_url?: string | null;
  notification_preferences?: any;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
};

export type Owner = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  birthdate: string | null;
  commission_rate: number | null;
  payment_details: any;
  created_at: string;
  updated_at: string;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  property: string;
  vendor: string | null;
  payment_method: string | null;
  notes: string | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
};

