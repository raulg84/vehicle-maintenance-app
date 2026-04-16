import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDashboard } from './vehicle-dashboard';

describe('VehicleDashboard', () => {
  let component: VehicleDashboard;
  let fixture: ComponentFixture<VehicleDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
