import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Maintenance } from '../../shared/models/maintenance.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private http = inject(HttpClient);

  private apiUrl = 'http://vehicle-maintenance-api.ddev.site:8080/api/maintenances';

  getMaintenances(): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(this.apiUrl);
  }

  getMaintenancesByVehicle(vehicleId: number): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(`${this.apiUrl}?vehicle_id=${vehicleId}`);
  }

  createMaintenance(maintenance: Partial<Maintenance>): Observable<Maintenance> {
    return this.http.post<Maintenance>(this.apiUrl, maintenance);
  }
}
