import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaintenanceRuleService } from '../../../../core/services/maintenance-rule.service';
import { MaintenanceRule } from '../../../../shared/models/maintenance-rule.model';

@Component({
  selector: 'app-rule-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './rule-list.html',
  styleUrl: './rule-list.scss',
})
export class RuleList implements OnInit {

  private service = inject(MaintenanceRuleService);

  rules: MaintenanceRule[] = [];
  loading = true;
  updatingRuleId: number | null = null;
  error = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getRules().subscribe({
      next: (data) => {
        this.rules = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando reglas';
        this.loading = false;
      },
    });
  }

  toggleActive(rule: MaintenanceRule): void {
    this.service.toggleRule(rule.id).subscribe({
      next: (updatedRule) => {
        this.rules = this.rules.map((item) =>
          item.id === updatedRule.id ? updatedRule : item
        );
      },
      error: () => {
        this.error = 'No se ha podido actualizar la regla.';
      },
    });
  }
}
