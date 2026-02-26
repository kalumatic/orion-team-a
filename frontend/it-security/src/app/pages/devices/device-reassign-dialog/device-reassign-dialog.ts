import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Employee } from '../../../types';

const PLACEHOLDER_EMPLOYEES: Employee[] = [
  { id: 1, firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@company.com' },
  { id: 2, firstName: 'Mark', lastName: 'Stevens', email: 'mark.stevens@company.com' },
  { id: 3, firstName: 'Sophia', lastName: 'Lee', email: 'sophia.lee@company.com' },
  { id: 4, firstName: 'James', lastName: 'Carter', email: 'james.carter@company.com' },
  { id: 5, firstName: 'Emma', lastName: 'Wilson', email: 'emma.wilson@company.com' },
  { id: 6, firstName: 'Liam', lastName: 'Davis', email: 'liam.davis@company.com' },
  { id: 7, firstName: 'Olivia', lastName: 'Martinez', email: 'olivia.martinez@company.com' },
  { id: 8, firstName: 'Noah', lastName: 'Anderson', email: 'noah.anderson@company.com' },
];

@Component({
  selector: 'app-device-reassign-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
  ],
  templateUrl: './device-reassign-dialog.html',
  styleUrl: './device-reassign-dialog.css'
})
export class DeviceReassignDialog implements OnInit {

  form: FormGroup;
  filteredEmployees$!: Observable<Employee[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DeviceReassignDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      employee: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.filteredEmployees$ = this.form.get('employee')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.searchEmployees(value))
    );
  }

  private searchEmployees(value: string | Employee): Observable<Employee[]> {
    if (typeof value !== 'string') return of([]);

    const searchValue = value.toLowerCase().trim();
    if (searchValue.length < 2) return of([]);

    return of(PLACEHOLDER_EMPLOYEES.filter(emp =>
      emp.firstName.toLowerCase().includes(searchValue) ||
      emp.lastName.toLowerCase().includes(searchValue) ||
      emp.email.toLowerCase().includes(searchValue)
    ));
  }

  displayEmployee(employee: Employee): string {
    return employee ? `${employee.firstName} ${employee.lastName}` : '';
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value.employee);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}