export interface Maintenance {
  id: number;
  vehicle_id: number;
  maintenance_rule_id?: number | null;
  maintenance_type: string;
  performed_at: string;
  mileage_at_service: number;
  cost?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}