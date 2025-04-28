
export interface Owner {
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
  properties?: number;
  revenue?: number;
  occupancy?: number;
  avatar?: string;
  joinedDate?: string;
}
