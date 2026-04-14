import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaintenanceService } from '../../../../core/services/maintenance.service';
import { Maintenance } from '../../../../shared/models/maintenance.model';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { Vehicle } from '../../../../shared/models/vehicle.model';

@Component({
  selector: 'app-maintenance-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './maintenance-list.html',
  styleUrl: './maintenance-list.scss',
})
export class MaintenanceList {

  private route = inject(ActivatedRoute);
  private maintenanceService = inject(MaintenanceService);

  maintenances: Maintenance[] = [];
  loading = true;
  error = '';
  vehicleId!: number;

  private vehicleService = inject(VehicleService);

  vehicle: Vehicle | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.error = 'No se ha indicado un vehículo válido.';
      this.loading = false;
      return;
    }

    this.vehicleId = Number(idParam);
    this.loadVehicle();
    this.loadMaintenances();
  }

  loadVehicle(): void {
    this.vehicleService.getVehicle(this.vehicleId).subscribe({
      next: (data) => {
        this.vehicle = data;
      },
      error: () => {
        // no se rompe la pantalla si falla
        this.vehicle = null;
      },
    });
  }

  loadMaintenances(): void {
    this.maintenanceService.getMaintenancesByVehicle(this.vehicleId).subscribe({
      next: (data) => {
        console.log('Mantenimientos recibidos:', data);
        console.log('Cantidad:', data.length);

        this.maintenances = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se han podido cargar los mantenimientos.';
        this.loading = false;
      },
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES');
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

  getVehicleName(): string {
    if (!this.vehicle) {
      return 'Vehículo';
    }

    if (this.vehicle.alias) {
      return this.vehicle.alias;
    }

    return `${this.vehicle.make} ${this.vehicle.model}`;
  }

}