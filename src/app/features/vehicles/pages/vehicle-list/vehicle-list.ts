import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { Vehicle } from '../../../../shared/models/vehicle.model';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss',
})
export class VehicleList implements OnInit {
  private vehicleService = inject(VehicleService);

  vehicles: Vehicle[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se han podido cargar los vehículos.';
        this.loading = false;
      },
    });
  }

  onDelete(id: number): void {
    const confirmDelete = confirm('¿Seguro que quieres eliminar este vehículo?');

    if (!confirmDelete) return;

    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => {
        this.loadVehicles();
      },
      error: () => {
        alert('Error eliminando vehículo');
      },
    });
  }
}