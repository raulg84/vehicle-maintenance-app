export type VehicleRuleStatus = 'ok' | 'upcoming' | 'overdue' | 'pending';

export interface MaintenanceStatusSummary {
  label: string;
  message: string;
}

export interface MaintenanceNextAction {
  rule_id: number | null;
  maintenance_key: string | null;
  title: string;
  message: string;
}

export interface MaintenanceRuleStatus {
  rule_id: number;
  name: string;
  maintenance_key: string;
  status: VehicleRuleStatus;
  status_label: string;
  last_maintenance_date: string | null;
  last_maintenance_km: number | null;
  current_vehicle_km: number;
  remaining_km: number | null;
  remaining_days: number | null;
  progress: number; // Valor entre 0 y 1 para representar el progreso hacia la próxima acción
}

export interface VehicleMaintenanceStatus {
  vehicle_id: number;
  vehicle_status: VehicleRuleStatus;
  summary: MaintenanceStatusSummary;
  next_action: MaintenanceNextAction;
  rules: MaintenanceRuleStatus[];
}