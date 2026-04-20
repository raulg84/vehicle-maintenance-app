import { TestBed } from '@angular/core/testing';

import { MaintenanceRuleService } from './maintenance-rule.service';

describe('MaintenanceRuleService', () => {
  let service: MaintenanceRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
