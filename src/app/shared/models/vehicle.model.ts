export interface Vehicle {
  id: number;
  alias?: string;
  make: string;
  model: string;
  year: number;
  powertrain_type: string;
  current_mileage: number;
  in_service_date?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}