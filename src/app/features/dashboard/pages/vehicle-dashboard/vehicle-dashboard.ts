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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
  mileageError = '';

  maintenanceStatus: VehicleMaintenanceStatus | null = null;
  ruleStatuses: MaintenanceRuleStatus[] = [];

  vehicleStatus: VehicleRuleStatus = 'ok';
  vehicleStatusLabel = 'OK';
  vehicleStatusMessage = '';

  nextActionTitle = '';
  nextActionMessage = '';
  nextActionType: 'info' | 'warning' | 'danger' = 'info';

  newMileage: number | null = null;
  readonly maxMileage = 2_000_000;

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
        this.newMileage = data.current_mileage;
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

  updateMileage(): void {
    if (!this.vehicle || this.newMileage == null) return;

    this.mileageError = '';

    const mileage = Number(this.newMileage);

    if (Number.isNaN(mileage) || mileage < 0) {
      this.mileageError = 'El kilometraje debe ser un número válido.';
      return;
    }

    if (mileage < this.vehicle.current_mileage) {
      this.mileageError = 'El kilometraje no puede ser inferior al actual.';
      return;
    }

    if (mileage > this.maxMileage) {
      this.mileageError = 'El kilometraje no puede superar 2.000.000 km.';
      return;
    }

    this.vehicleService
      .updateVehicle(this.vehicle.id, {
        current_mileage: mileage,
      })
      .subscribe({
        next: () => {
          this.loadVehicle();
          this.loadMaintenanceStatus();
        },
        error: (err) => {
          if (err.status === 422 && err.error?.errors?.current_mileage?.length) {
            this.mileageError = 'El kilometraje no puede superar 2.000.000 km.';
          } else {
            this.mileageError = 'No se ha podido actualizar el kilometraje.';
          }
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

  formatRemainingKm(km: number | null): string {
    if (km === null || km === undefined) {
      return '-';
    }

    return `${Math.abs(Math.round(km))} km`;
  }

  getRemainingKmLabel(km: number | null): string {
    if (km === null || km === undefined) {
      return 'Kilómetros';
    }

    return km < 0 ? 'Km vencidos' : 'Km restantes';
  }

  formatRemainingDays(days: number | null): string {
    if (days === null || days === undefined) {
      return '-';
    }

    return `${Math.abs(Math.round(days))} días`;
  }

  getRemainingDaysLabel(days: number | null): string {
    if (days === null || days === undefined) {
      return 'Días';
    }

    return days < 0 ? 'Días vencidos' : 'Días restantes';
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