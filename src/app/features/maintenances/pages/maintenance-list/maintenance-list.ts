import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaintenanceService } from '../../../../core/services/maintenance.service';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { Maintenance } from '../../../../shared/models/maintenance.model';
import { Vehicle } from '../../../../shared/models/vehicle.model';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './maintenance-list.html',
  styleUrl: './maintenance-list.scss',
})
export class MaintenanceList implements OnInit {
  private route = inject(ActivatedRoute);
  private maintenanceService = inject(MaintenanceService);
  private vehicleService = inject(VehicleService);

  maintenances: Maintenance[] = [];
  vehicle: Vehicle | null = null;

  loading = true;
  error = '';
  vehicleId!: number;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const vehicleId = Number(params.get('vehicleId'));

      if (!vehicleId) {
        this.error = 'No se ha indicado un vehículo válido.';
        this.loading = false;
        return;
      }

      this.vehicleId = vehicleId;

      this.loadVehicle();
      this.loadMaintenances();
    });
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

  loadMaintenances(): void {
    this.loading = true;
    this.error = '';

    this.maintenanceService.getMaintenancesByVehicle(this.vehicleId).subscribe({
      next: (data) => {
        this.maintenances = [...data].sort((a, b) => {
          return (
            new Date(b.performed_at).getTime() -
            new Date(a.performed_at).getTime()
          );
        });

        this.loading = false;
      },
      error: () => {
        this.error = 'No se han podido cargar los mantenimientos.';
        this.loading = false;
      },
    });
  }

  onDelete(id: number): void {
    const confirmDelete = confirm(
      '¿Seguro que quieres eliminar este mantenimiento? Esta acción no se puede deshacer.'
    );

    if (!confirmDelete) return;

    this.error = '';

    this.maintenanceService.deleteMaintenance(id).subscribe({
      next: () => {
        this.loadMaintenances();
      },
      error: () => {
        this.error = 'No se ha podido eliminar el mantenimiento.';
      },
    });
  }

  getVehicleName(): string {
    if (!this.vehicle) {
      return 'Vehículo';
    }

    if (this.vehicle.alias) {
      return this.vehicle.alias;
    }

    return `${this.vehicle.make} ${this.vehicle.model}`;
  }

  formatCost(cost?: number | string | null): string {
    if (cost == null || cost === '') {
      return '-';
    }

    const parsedCost = Number(cost);

    if (Number.isNaN(parsedCost)) {
      return '-';
    }

    return `${parsedCost.toFixed(2)} €`;
  }

  formatMileage(km: number | string | null | undefined): string {
    if (km === null || km === undefined || km === '') {
      return '-';
    }

    const parsedKm = Number(km);

    if (Number.isNaN(parsedKm)) {
      return '-';
    }

    return `${Math.round(parsedKm)} km`;
  }

  formatDate(date?: string | null): string {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString('es-ES');
  }

  getMaintenanceCountLabel(): string {
    const count = this.maintenances.length;
    return count === 1 ? '1 mantenimiento registrado' : `${count} mantenimientos registrados`;
  }

  getLastMaintenanceDate(): string | null {
    if (this.maintenances.length === 0) {
      return null;
    }

    return this.formatDate(this.maintenances[0].performed_at);
  }
}