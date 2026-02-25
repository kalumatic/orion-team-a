import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, of, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { IncidentRequest, DeviceResponse, EmployeeResponse } from '../../../types';
import { EmployeeService } from '../../../services/employee.service';
import { DeviceService } from '../../../services/device.service';

@Component({
  selector: 'app-incident-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatOptionModule
  ],
  templateUrl: './incident-dialog.html',
  styleUrl: './incident-dialog.css'
})
export class IncidentDialog implements OnInit {

  form: FormGroup;
  today = new Date();
  isEditMode = false;

  private employees: EmployeeResponse[] = [];
  private devices: DeviceResponse[] = [];

  private fallbackEmployees: EmployeeResponse[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@company.com' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@company.com' },
    { id: 3, firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@company.com' }
  ];

  private fallbackDevices: DeviceResponse[] = [
    { id: 1, deviceType: 'Laptop', model: 'Dell XPS 15', serialNumber: 'SN12345', assignedEmployee: 1, assignedEmployeeName: 'John Doe', assignmentDate: '2025-01-10' },
    { id: 2, deviceType: 'Phone', model: 'iPhone 14', serialNumber: 'SN54321', assignedEmployee: 2, assignedEmployeeName: 'Jane Smith', assignmentDate: '2025-03-22' },
    { id: 3, deviceType: 'Tablet', model: 'iPad Pro', serialNumber: 'SN99988', assignedEmployee: 3, assignedEmployeeName: 'Michael Brown', assignmentDate: '2025-06-05' },
    { id: 4, deviceType: 'Laptop', model: 'HP EliteBook', serialNumber: 'SN77766', assignedEmployee: 1, assignedEmployeeName: 'John Doe', assignmentDate: '2025-07-15' }
  ];

  filteredEmployees$!: Observable<EmployeeResponse[]>;
  filteredDevices$!: Observable<DeviceResponse[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IncidentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeService,
    private deviceService: DeviceService
  ) {
    this.form = this.fb.group({
      id: [null],
      reporter: [null, Validators.required],
      device: [null, Validators.required],
      description: ['', Validators.required],
      date: [new Date(), Validators.required],
      severity: ['Low'],
      status: ['Open']
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    this.form.disable(); // disable form until data is loaded
    forkJoin({
      employees: this.employeeService.getAllUnpaged(),
      devices: this.deviceService.getAll()
    }).subscribe({
      next: ({ employees, devices }) => {

        this.employees = employees?.length ? employees : this.fallbackEmployees;
        this.devices = devices?.length ? devices : this.fallbackDevices;

        if (this.data) {
          this.isEditMode = true;

          const selectedEmployee = this.employees.find(
            emp => emp.id === this.data.reporterId
          );

          const selectedDevice = this.devices.find(
            dev => dev.id === this.data.deviceId
          );

          this.form.patchValue({
            id: this.data.id ?? null,
            reporter: selectedEmployee ?? null,
            device: selectedDevice ?? null,
            description: this.data.description,
            date: this.data.incidentDate
              ? new Date(this.data.incidentDate)
              : new Date(),
            severity: this.data.severity,
            status: this.data.status
          });
        }
        this.form.enable(); // enable form after data is loaded
      },
      error: (err) => {
        console.error('Loading failed — using fallback data', err);
        this.employees = this.fallbackEmployees;
        this.devices = this.fallbackDevices;
        if (this.data) {
          this.isEditMode = true;

          const selectedEmployee = this.employees.find(
            emp => emp.id === this.data.reporterId
          );

          const selectedDevice = this.devices.find(
            dev => dev.id === this.data.deviceId
          );

          this.form.patchValue({
            id: this.data.id ?? null,
            reporter: selectedEmployee ?? null,
            device: selectedDevice ?? null,
            description: this.data.description,
            date: this.data.incidentDate
              ? new Date(this.data.incidentDate)
              : new Date(),
            severity: this.data.severity,
            status: this.data.status
          });
          this.form.enable(); // enable form even if loading failed
        }
        this.form.enable(); // enable form even if loading failed
      }
    });
    this.filteredEmployees$ = this.form.get('reporter')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.searchEmployees(value))
    );

    this.filteredDevices$ = this.form.get('device')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.searchDevices(value))
    );
  }

  private searchEmployees(value: string | EmployeeResponse): Observable<EmployeeResponse[]> {

    // IMPORTANT FIX: if object (edit mode), return full list
    if (typeof value !== 'string') {
      return of([]);
    }

    const searchValue = value.toLowerCase().trim();
    if (searchValue.length < 2) return of([]);

    return of(
      this.employees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchValue) ||
        emp.lastName.toLowerCase().includes(searchValue) ||
        emp.email.toLowerCase().includes(searchValue)
      )
    );
  }

  private searchDevices(value: string | DeviceResponse): Observable<DeviceResponse[]> {

    // IMPORTANT FIX: if object (edit mode), return full list
    if (typeof value !== 'string') {
      return of(this.devices);
    }

    const searchValue = value.toLowerCase().trim();
    if (searchValue.length < 2) return of([]);

    return of(
      this.devices.filter(dev =>
        dev.deviceType.toLowerCase().includes(searchValue) ||
        dev.model.toLowerCase().includes(searchValue) ||
        dev.serialNumber.toLowerCase().includes(searchValue)
      )
    );
  }

  displayEmployee(employee: EmployeeResponse | string): string {
    if (typeof employee === 'string') return employee;
    return employee ? `${employee.firstName} ${employee.lastName}` : '';
  }

  displayDevice(device: DeviceResponse | string): string {
    if (typeof device === 'string') return device;
    return device ? `${device.deviceType} - ${device.serialNumber}` : '';
  }

  save(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const request: IncidentRequest = {
      description: formValue.description,
      incidentDate: formValue.date instanceof Date
        ? formValue.date.toISOString().split('T')[0]
        : formValue.date,
      severity: formValue.severity,
      status: formValue.status,
      reporterId: formValue.reporter?.id,
      deviceId: formValue.device?.id
    };

    this.dialogRef.close({ id: formValue.id, ...request });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}