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
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

interface Employee {
  id: number;
  surname: string;
  lastname: string;
  email: string;
}

interface Device {
  deviceType: string;
  model: string;
  serialNumber: string;
  assignedEmployee: string;
}

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

  private employees: Employee[] = [
    { id: 1, surname: 'John', lastname: 'Doe', email: 'john.doe@company.com' },
    { id: 2, surname: 'Jane', lastname: 'Smith', email: 'jane.smith@company.com' },
    { id: 3, surname: 'Michael', lastname: 'Brown', email: 'michael.brown@company.com' }
  ];

  private devices: Device[] = [
    { deviceType: 'Laptop', model: 'Dell XPS 15', serialNumber: 'SN12345', assignedEmployee: 'John Doe' },
    { deviceType: 'Phone', model: 'iPhone 14', serialNumber: 'SN54321', assignedEmployee: 'Jane Smith' },
    { deviceType: 'Tablet', model: 'iPad Pro', serialNumber: 'SN99988', assignedEmployee: 'Michael Brown' },
    { deviceType: 'Laptop', model: 'HP EliteBook', serialNumber: 'SN77766', assignedEmployee: 'John Doe' }
  ];

  filteredEmployees$!: Observable<Employee[]>;
  filteredDevices$!: Observable<Device[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IncidentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      id: [null], // important for update mode
      reporter: [null, Validators.required],
      device: [null, Validators.required],
      description: ['', Validators.required],
      date: [new Date(), Validators.required],
      severity: ['Low'],
      status: ['Open']
    });
  }

  ngOnInit(): void {

    /* -------- Detect Edit Mode -------- */
    if (this.data) {
      this.isEditMode = true;

      this.form.patchValue({
        id: this.data.id ?? null,
        reporter: this.data.reporter ?? null,
        device: this.data.device ?? null,
        description: this.data.description,
        date: this.data.date,
        severity: this.data.severity,
        status: this.data.status
      });
    }

    /* -------- Employee Search -------- */
    this.filteredEmployees$ = this.form.get('reporter')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.searchEmployees(value))
    );

    /* -------- Device Search -------- */
    this.filteredDevices$ = this.form.get('device')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.searchDevices(value))
    );
  }

  private searchEmployees(value: string | Employee): Observable<Employee[]> {
    if (typeof value !== 'string') return of([]);

    const searchValue = value.toLowerCase().trim();
    if (searchValue.length < 2) return of([]);

    return of(this.employees.filter(emp =>
      emp.surname.toLowerCase().includes(searchValue) ||
      emp.lastname.toLowerCase().includes(searchValue) ||
      emp.email.toLowerCase().includes(searchValue)
    ));
  }

  private searchDevices(value: string | Device): Observable<Device[]> {
    if (typeof value !== 'string') return of([]);

    const searchValue = value.toLowerCase().trim();
    if (searchValue.length < 2) return of([]);

    return of(this.devices.filter(dev =>
      dev.deviceType.toLowerCase().includes(searchValue) ||
      dev.model.toLowerCase().includes(searchValue) ||
      dev.serialNumber.toLowerCase().includes(searchValue) ||
      dev.assignedEmployee.toLowerCase().includes(searchValue)
    ));
  }

  displayEmployee(employee: Employee): string {
    return employee ? `${employee.surname} ${employee.lastname}` : '';
  }

  displayDevice(device: Device): string {
    return device ? `${device.deviceType} - ${device.serialNumber}` : '';
  }

  save(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const incidentResult = {
      id: formValue.id, // exists if updating
      reporter: this.displayEmployee(formValue.reporter),
      description: formValue.description,
      device: formValue.device.serialNumber,
      date: formValue.date,
      severity: formValue.severity,
      status: formValue.status
    };

    /* If you want backend later, this is where you'd branch:
       if (this.isEditMode) -> call update API
       else -> call create API
    */

    this.dialogRef.close(incidentResult);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}