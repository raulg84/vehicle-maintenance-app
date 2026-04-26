import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MaintenanceRule } from '../../shared/models/maintenance-rule.model';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceRuleService {
  private http = inject(HttpClient);

  private apiUrl = 'http://vehicle-maintenance-api.ddev.site:8080/api/maintenance-rules';

  getRules(powertrainType?: string): Observable<MaintenanceRule[]> {
    if (powertrainType) {
      return this.http.get<MaintenanceRule[]>(
        `${this.apiUrl}?powertrain_type=${powertrainType}`
      );
    }

    return this.http.get<MaintenanceRule[]>(this.apiUrl);
  }

  getActiveRules(powertrainType?: string): Observable<MaintenanceRule[]> {
    const url = `${this.apiUrl}/active`;

    if (powertrainType) {
      return this.http.get<MaintenanceRule[]>(
        `${url}?powertrain_type=${powertrainType}`
      );
    }

    return this.http.get<MaintenanceRule[]>(url);
  }

  getRule(id: number): Observable<MaintenanceRule> {
    return this.http.get<MaintenanceRule>(`${this.apiUrl}/${id}`);
  }

  createRule(data: Partial<MaintenanceRule>): Observable<MaintenanceRule> {
    return this.http.post<MaintenanceRule>(this.apiUrl, data);
  }

  updateRule(
    id: number,
    data: Partial<MaintenanceRule>
  ): Observable<MaintenanceRule> {
    return this.http.put<MaintenanceRule>(`${this.apiUrl}/${id}`, data);
  }

  toggleRule(id: number): Observable<MaintenanceRule> {
    return this.http.patch<MaintenanceRule>(`${this.apiUrl}/${id}/toggle`, {});
  }
}