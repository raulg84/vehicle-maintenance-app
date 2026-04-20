import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleMaintenanceStatus } from '../../shared/models/vehicle-maintenance-status.model';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceStatusService {
    private http = inject(HttpClient);

  private apiUrl = 'http://vehicle-maintenance-api.ddev.site:8080/api';

  getVehicleMaintenanceStatus(
    vehicleId: number
  ): Observable<VehicleMaintenanceStatus> {
    return this.http.get<VehicleMaintenanceStatus>(
      `${this.apiUrl}/vehicles/${vehicleId}/maintenance-status`
    );
  }
}
