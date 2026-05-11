import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MaintenanceRule } from '../../shared/models/maintenance-rule.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceRuleService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/maintenance-rules`;

  getRules(powertrainType?: string): Observable<MaintenanceRule[]> {
    return this.http.get<MaintenanceRule[]>(this.apiUrl, {
      params: powertrainType ? { powertrain_type: powertrainType } : {},
    });
  }

  getActiveRules(powertrainType?: string): Observable<MaintenanceRule[]> {
    return this.http.get<MaintenanceRule[]>(`${this.apiUrl}/active`, {
      params: powertrainType ? { powertrain_type: powertrainType } : {},
    });
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