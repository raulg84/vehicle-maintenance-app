import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { MaintenanceStatusService } from '../../../../core/services/maintenance-status.service';

import { Vehicle } from '../../../../shared/models/vehicle.model';
import {
  VehicleMaintenanceStatus,
  MaintenanceRuleStatus,
  VehicleRuleStatus,
} from '../../../../shared/models/vehicle-maintenance-status.model';

@Component({
  selector: 'app-vehicle-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vehicle-dashboard.html',
  styleUrl: './vehicle-dashboard.scss',
})
export class VehicleDashboard implements OnInit {
  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  private maintenanceStatusService = inject(MaintenanceStatusService);

  vehicle: Vehicle | null = null;
  vehicleId!: number;

  loading = true;
  error = '';

  maintenanceStatus: VehicleMaintenanceStatus | null = null;
  ruleStatuses: MaintenanceRuleStatus[] = [];

  vehicleStatus: VehicleRuleStatus = 'ok';
  vehicleStatusLabel = 'OK';
  vehicleStatusMessage = '';

  nextActionTitle = '';
  nextActionMessage = '';
  nextActionType: 'info' | 'warning' | 'danger' = 'info';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.error = 'Vehículo no válido';
      this.loading = false;
      return;
    }

    this.vehicleId = Number(idParam);

    this.loadVehicle();
    this.loadMaintenanceStatus();
  }

  loadVehicle(): void {
    this.vehicleService.getVehicle(this.vehicleId).subscribe({
      next: (data) => {
        this.vehicle = data;
      },
      error: () => {
        this.vehicle = null;
      },
    });
  }

  loadMaintenanceStatus(): void {
    this.maintenanceStatusService
      .getVehicleMaintenanceStatus(this.vehicleId)
      .subscribe({
        next: (data) => {
          this.maintenanceStatus = data;
          this.ruleStatuses = [...data.rules].sort((a, b) => {
            const order: Record<VehicleRuleStatus, number> = {
              overdue: 1,
              upcoming: 2,
              pending: 3,
              ok: 4,
            };

            return order[a.status] - order[b.status];
          });

          this.vehicleStatus = data.vehicle_status;
          this.vehicleStatusLabel = data.summary.label;
          this.vehicleStatusMessage = data.summary.message;

          this.nextActionTitle = data.next_action.title;
          this.nextActionMessage = data.next_action.message;

          this.nextActionType =
            data.vehicle_status === 'overdue'
              ? 'danger'
              : data.vehicle_status === 'upcoming' || data.vehicle_status === 'pending'
                ? 'warning'
                : 'info';

          this.loading = false;
        },
        error: () => {
          this.error = 'Error calculando estado del vehículo';
          this.loading = false;
        },
      });
  }

  getVehicleName(): string {
    if (!this.vehicle) {
      return 'Vehículo';
    }

    return this.vehicle.alias || `${this.vehicle.make} ${this.vehicle.model}`;
  }

  formatDate(date: string | null): string {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString('es-ES');
  }

  formatRemainingKm(value: number | null): string {
    if (value == null) {
      return '-';
    }

    return `${value} km`;
  }

  formatRemainingDays(value: number | null): string {
    if (value == null) {
      return '-';
    }

    return `${value} días`;
  }

  getVisibleRuleStatuses(): MaintenanceRuleStatus[] {
    return this.ruleStatuses;
  }

  getRuleCardStateClass(status: VehicleRuleStatus): string {
    return `dashboard-rule-card--${status}`;
  }

  getRuleBadgeClass(status: VehicleRuleStatus): string {
    return `dashboard-rule-card__badge--${status}`;
  }

  getVehicleStatusBadgeClass(status: VehicleRuleStatus): string {
    return `vehicle-dashboard__status-badge--${status}`;
  }
}