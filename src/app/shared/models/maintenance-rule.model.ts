export interface MaintenanceRule {
  id: number;
  name: string;
  maintenance_key: string;
  description?: string | null;
  applies_to_powertrain: 'all' | 'combustion' | 'hybrid' | 'electric';
  interval_km?: number | null;
  interval_days?: number | null;
  warning_km?: number | null;
  warning_days?: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}