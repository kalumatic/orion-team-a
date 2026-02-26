import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Employee, DeviceRequest } from '../../../types';
import { EmployeeService } from '../../../services/employee.service'; // adjust path
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-device-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
  templateUrl: './device-dialog.html',
  styleUrl: './device-dialog.css'
})
export class DeviceDialog implements OnInit {

  form: FormGroup;
  isEditMode = false;
  allEmployees: Employee[] = [];
  filteredEmployees$!: Observable<Employee[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DeviceDialog>,
    private employeeService: EmployeeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      id: [null],
      assignedEmployeeId: [null],
      deviceType: ['', Validators.required],
      model: ['', Validators.required],
      serialNumber: ['', Validators.required],
      employee: [null, Validators.required],
      assignmentDate: [null, Validators.required],  // add this
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.form.patchValue({
        id: this.data.id ?? null,
        assignedEmployeeId: this.data.assignedEmployee ?? null,
        deviceType: this.data.deviceType ?? '',
        model: this.data.model ?? '',
        serialNumber: this.data.serialNumber ?? '',
        employee: this.data.assignedEmployeeName ?? null,
        assignmentDate: this.data.assignmentDate ? new Date(this.data.assignmentDate) : null,  // add this
      });
    }

    // Load all employees from the API
    this.employeeService.getAllUnpaged().subscribe(employees => {
      this.allEmployees = employees;
    });

    this.filteredEmployees$ = this.form.get('employee')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => this.filterEmployees(value))
    );
  }

  private filterEmployees(value: string | Employee): Employee[] {
    if (typeof value !== 'string') return [];
    const search = value.toLowerCase().trim();
    if (search.length < 2) return [];

    return this.allEmployees.filter(emp =>
      emp.firstName.toLowerCase().includes(search) ||
      emp.lastName.toLowerCase().includes(search) ||
      emp.email.toLowerCase().includes(search)
    );
  }

  displayEmployee(employee: Employee | string): string {
    if (typeof employee === 'string') return employee;
    return employee ? `${employee.firstName} ${employee.lastName}` : '';
  }

  save(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const employeeValue = formValue.employee;

    const assignedEmployeeId = typeof employeeValue === 'object' && employeeValue !== null
      ? employeeValue.id
      : formValue.assignedEmployeeId;

    const d = new Date(formValue.assignmentDate);
    const assignmentDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const request: DeviceRequest & { id: number } = {
      id: formValue.id,
      deviceType: formValue.deviceType,
      model: formValue.model,
      serialNumber: formValue.serialNumber,
      assignedEmployeeId: assignedEmployeeId,
      assignmentDate: assignmentDate
    };

    this.dialogRef.close(request);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}