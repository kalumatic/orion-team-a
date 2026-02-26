import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceReassignDialog } from './device-reassign-dialog';

describe('DeviceReassignDialog', () => {
  let component: DeviceReassignDialog;
  let fixture: ComponentFixture<DeviceReassignDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceReassignDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceReassignDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
