import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VehicleService } from '../../../../core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.scss',
})
export class VehicleForm implements OnInit {
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  vehicleId: number | null = null;

  loading = false;
  error = '';

  vehicleForm = this.fb.group({
    alias: [''],
    make: ['', Validators.required],
    model: ['', Validators.required],
    year: [null as number | null, [Validators.required]],
    powertrain_type: ['combustion', Validators.required],
    current_mileage: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.vehicleId = Number(idParam);
      this.loadVehicle();
    }
  }

  loadVehicle(): void {
    if (!this.vehicleId) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.vehicleService.getVehicle(this.vehicleId).subscribe({
      next: (vehicle) => {
        this.vehicleForm.patchValue({
          alias: vehicle.alias ?? '',
          make: vehicle.make ?? '',
          model: vehicle.model ?? '',
          year: vehicle.year ?? null,
          powertrain_type: vehicle.powertrain_type ?? 'combustion',
          current_mileage: vehicle.current_mileage ?? 0,
        });

        this.loading = false;
      },
      error: () => {
        this.error = 'No se ha podido cargar el vehículo.';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const formValue = this.vehicleForm.getRawValue();

    const vehicleData = {
      alias: formValue.alias || undefined,
      make: formValue.make || '',
      model: formValue.model || '',
      year: formValue.year ?? new Date().getFullYear(),
      powertrain_type: formValue.powertrain_type || 'combustion',
      current_mileage: formValue.current_mileage ?? 0,
    };

    if (this.isEditMode && this.vehicleId) {
      this.vehicleService.updateVehicle(this.vehicleId, vehicleData).subscribe({
        next: () => {
          this.router.navigate(['/vehicles']);
        },
        error: () => {
          this.error = 'No se ha podido actualizar el vehículo.';
          this.loading = false;
        },
      });

      return;
    }

    this.vehicleService.createVehicle(vehicleData).subscribe({
      next: () => {
        this.router.navigate(['/vehicles']);
      },
      error: () => {
        this.error = 'No se ha podido guardar el vehículo.';
        this.loading = false;
      },
    });
  }

  get makeControl() {
    return this.vehicleForm.get('make');
  }

  get modelControl() {
    return this.vehicleForm.get('model');
  }

  get yearControl() {
    return this.vehicleForm.get('year');
  }

  get currentMileageControl() {
    return this.vehicleForm.get('current_mileage');
  }
}