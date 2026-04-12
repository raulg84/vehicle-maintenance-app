import { Component, inject, OnInit } from '@angular/core';
import { MaintenanceService } from '../../../../core/services/maintenance.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './maintenance-form.html',
  styleUrl: './maintenance-form.scss',
})
export class MaintenanceForm implements OnInit {
  private fb = inject(FormBuilder);
  private maintenanceService = inject(MaintenanceService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  error = '';
  vehicleId: number | null = null;

   maintenanceForm = this.fb.group({
    vehicle_id: [null as number | null, Validators.required],
    maintenance_type: ['', Validators.required],
    performed_at: ['', Validators.required],
    mileage_at_service: [0, [Validators.required, Validators.min(0)]],
    cost: [null as number | null],
    notes: [''],
  });

   ngOnInit(): void {
    const vehicleIdParam = this.route.snapshot.queryParamMap.get('vehicleId');

    if (vehicleIdParam) {
      this.vehicleId = Number(vehicleIdParam);
      this.maintenanceForm.patchValue({
        vehicle_id: this.vehicleId,
      });
    }
  }

   onSubmit(): void {
    if (this.maintenanceForm.invalid) {
      this.maintenanceForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const formValue = this.maintenanceForm.getRawValue();

    const maintenanceData = {
      vehicle_id: formValue.vehicle_id ?? undefined,
      maintenance_type: formValue.maintenance_type || '',
      performed_at: formValue.performed_at || '',
      mileage_at_service: formValue.mileage_at_service ?? 0,
      cost: formValue.cost ?? undefined,
      notes: formValue.notes || undefined,
    };

    this.maintenanceService.createMaintenance(maintenanceData).subscribe({
      next: () => {
        this.router.navigate(['/vehicles']);
      },
      error: () => {
        this.error = 'No se ha podido guardar el mantenimiento.';
        this.loading = false;
      },
    });
  }
}
