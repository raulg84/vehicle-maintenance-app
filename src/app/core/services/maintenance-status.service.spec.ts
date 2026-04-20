import { TestBed } from '@angular/core/testing';

import { MaintenanceStatusService } from './maintenance-status.service';

describe('MaintenanceStatusService', () => {
  let service: MaintenanceStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
