import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MaintenanceService } from '../../../../core/services/maintenance.service';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { Maintenance } from '../../../../shared/models/maintenance.model';
import { Vehicle } from '../../../../shared/models/vehicle.model';

@Component({
  selector: 'app-vehicle-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './vehicle-dashboard.html',
  styleUrl: './vehicle-dashboard.scss',
})
export class VehicleDashboard {
  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  private maintenanceService = inject(MaintenanceService);

  vehicle: Vehicle | null = null;
  maintenances: Maintenance[] = [];

  vehicleId!: number;
  loading = true;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) return;

    this.vehicleId = Number(idParam);

    this.loadVehicle();
    this.loadMaintenances();
  }

  loadVehicle(): void {
    this.vehicleService.getVehicle(this.vehicleId).subscribe({
      next: (data) => {
        this.vehicle = data;
      },
    });
  }

  loadMaintenances(): void {
    this.maintenanceService.getMaintenancesByVehicle(this.vehicleId).subscribe({
      next: (data) => {
        // solo los últimos 3 mantenimientos para no saturar la pantalla
        this.maintenances = data.slice(0, 3);
        this.loading = false;
      },
    });
  }

  getVehicleName(): string {
    if (!this.vehicle) return 'Vehículo';
    return this.vehicle.alias || `${this.vehicle.make} ${this.vehicle.model}`;
  }

  formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES');
}

}
