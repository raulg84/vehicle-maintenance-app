import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-vehicle-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.scss',
})
export class VehicleForm {
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  loading = false;
  error = '';

  vehicleForm = this.fb.group({
    alias: [''],
    make: ['', Validators.required],
    model: ['', Validators.required],
    year: [null, [Validators.required]],
    powertrain_type: ['combustion', Validators.required],
    current_mileage: [0, [Validators.required, Validators.min(0)]],
  });

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
}
