
// Room type definition that works across all components
export interface Room {
  id: string;
  number: string;
  type: string;
  property: string;
  property_name?: string;
  property_id?: string;
  max_occupancy: number;
  base_rate: number;
  status: 'available' | 'occupied' | 'maintenance' | string;
  owner_id?: string;
  description?: string | null;
  amenities?: string[];
  image?: string | null;
  created_at?: string;
  updated_at?: string;
  // Add missing fields needed by components
  capacity?: number;
  rate?: number;
  floor?: string;
}
