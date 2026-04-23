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

  getMaintenance(id: number): Observable<Maintenance> {
    return this.http.get<Maintenance>(`${this.apiUrl}/${id}`);
  }

  createMaintenance(maintenance: Partial<Maintenance>): Observable<Maintenance> {
    return this.http.post<Maintenance>(this.apiUrl, maintenance);
  }

  updateMaintenance(id: number, maintenance: Partial<Maintenance>): Observable<Maintenance> {
    return this.http.put<Maintenance>(`${this.apiUrl}/${id}`, maintenance);
  }

  deleteMaintenance(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
