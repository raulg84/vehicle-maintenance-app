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
}