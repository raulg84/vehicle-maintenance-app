import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaintenanceRuleService } from '../../../../core/services/maintenance-rule.service';

@Component({
  selector: 'app-rule-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './rule-form.html',
  styleUrl: './rule-form.scss',
})
export class RuleForm {
  private fb = inject(FormBuilder);
  private service = inject(MaintenanceRuleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  error = '';

  isEditMode = false;
  ruleId: number | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    maintenance_key: ['', Validators.required],
    description: [''],
    applies_to_powertrain: ['all', Validators.required],
    interval_km: [null as number | null],
    interval_days: [null as number | null],
    warning_km: [null as number | null],
    warning_days: [null as number | null],
    is_active: [true],
    sort_order: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.ruleId = Number(id);
      this.loadRule();
    }
  }

  loadRule(): void {
    if (!this.ruleId) return;

    this.loading = true;

    this.service.getRule(this.ruleId).subscribe({
      next: (rule) => {
        this.form.patchValue({
          name: rule.name,
          maintenance_key: rule.maintenance_key,
          description: rule.description ?? '',
          applies_to_powertrain: rule.applies_to_powertrain,
          interval_km: rule.interval_km ?? null,
          interval_days: rule.interval_days ?? null,
          warning_km: rule.warning_km ?? null,
          warning_days: rule.warning_days ?? null,
          is_active: rule.is_active,
          sort_order: rule.sort_order,
        });

        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando la regla.';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (!value.interval_km && !value.interval_days) {
      this.error = 'Debes indicar intervalo en KM o días.';
      return;
    }
    const ruleData = {
      name: value.name || '',
      maintenance_key: value.maintenance_key || '',
      description: value.description || null,
      applies_to_powertrain:
        (value.applies_to_powertrain as
          | 'all'
          | 'combustion'
          | 'hybrid'
          | 'electric') || 'all',
      interval_km: value.interval_km ?? null,
      interval_days: value.interval_days ?? null,
      warning_km: value.warning_km ?? null,
      warning_days: value.warning_days ?? null,
      is_active: value.is_active ?? true,
      sort_order: value.sort_order ?? 0,
    };

    this.loading = true;
    this.error = '';

    if (this.isEditMode && this.ruleId) {
      this.service.updateRule(this.ruleId, ruleData).subscribe({
        next: () => this.router.navigate(['/rules']),
        error: () => {
          this.error = 'Error actualizando regla.';
          this.loading = false;
        },
      });

      return;
    }

    this.service.createRule(ruleData).subscribe({
      next: () => this.router.navigate(['/rules']),
      error: () => {
        this.error = 'Error creando regla.';
        this.loading = false;
      },
    });
  }

  get nameControl() {
    return this.form.get('name');
  }

  get keyControl() {
    return this.form.get('maintenance_key');
  }

  get orderControl() {
    return this.form.get('sort_order');
  }
}
