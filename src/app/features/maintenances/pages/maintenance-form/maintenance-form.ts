import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaintenanceService } from '../../../../core/services/maintenance.service';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { MaintenanceRuleService } from '../../../../core/services/maintenance-rule.service';
import { Vehicle } from '../../../../shared/models/vehicle.model';
import { MaintenanceRule } from '../../../../shared/models/maintenance-rule.model';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './maintenance-form.html',
  styleUrl: './maintenance-form.scss',
})
export class MaintenanceForm implements OnInit {
  private fb = inject(FormBuilder);
  private maintenanceService = inject(MaintenanceService);
  private vehicleService = inject(VehicleService);
  private maintenanceRuleService = inject(MaintenanceRuleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  error = '';

  vehicleId: number | null = null;
  vehicle: Vehicle | null = null;
  rules: MaintenanceRule[] = [];

  maintenanceForm = this.fb.group({
    vehicle_id: [null as number | null, Validators.required],
    maintenance_rule_id: [null as number | null, Validators.required],
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

      this.loadVehicle();
    }
  }

  loadVehicle(): void {
    if (!this.vehicleId) return;

    this.vehicleService.getVehicle(this.vehicleId).subscribe({
      next: (data) => {
        this.vehicle = data;
        this.loadRules();
      },
      error: () => {
        this.vehicle = null;
      },
    });
  }

  loadRules(): void {
    const powertrainType = this.vehicle?.powertrain_type;

    this.maintenanceRuleService.getRules(powertrainType).subscribe({
      next: (data) => {
        this.rules = data;
      },
      error: () => {
        this.rules = [];
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

  onRuleChange(): void {
    const selectedRuleId = this.maintenanceForm.get('maintenance_rule_id')?.value;

    const selectedRule = this.rules.find((rule) => rule.id === Number(selectedRuleId));

    if (!selectedRule) return;

    this.maintenanceForm.patchValue({
      maintenance_type: selectedRule.name,
    });
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
      maintenance_rule_id: formValue.maintenance_rule_id ?? undefined,
      maintenance_type: formValue.maintenance_type || '',
      performed_at: formValue.performed_at || '',
      mileage_at_service: formValue.mileage_at_service ?? 0,
      cost: formValue.cost ?? undefined,
      notes: formValue.notes || undefined,
    };

    this.maintenanceService.createMaintenance(maintenanceData).subscribe({
      next: () => {
        this.router.navigate(['/vehicles', formValue.vehicle_id, 'maintenances']);
      },
      error: (err) => {
        if (err.status === 422) {
          this.error =
            'Hay campos obligatorios sin completar o con valores no válidos.';
        } else {
          this.error = 'No se ha podido guardar el mantenimiento.';
        }

        this.loading = false;
      },
    });
  }

  get maintenanceRuleControl() {
    return this.maintenanceForm.get('maintenance_rule_id');
  }

  get maintenanceTypeControl() {
    return this.maintenanceForm.get('maintenance_type');
  }

  get performedAtControl() {
    return this.maintenanceForm.get('performed_at');
  }

  get mileageAtServiceControl() {
    return this.maintenanceForm.get('mileage_at_service');
  }
}