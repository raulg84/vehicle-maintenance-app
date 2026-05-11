import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleMaintenanceStatus } from '../../shared/models/vehicle-maintenance-status.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceStatusService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}`;

  getVehicleMaintenanceStatus(
    vehicleId: number
  ): Observable<VehicleMaintenanceStatus> {
    return this.http.get<VehicleMaintenanceStatus>(
      `${this.apiUrl}/vehicles/${vehicleId}/maintenance-status`
    );
  }
}
