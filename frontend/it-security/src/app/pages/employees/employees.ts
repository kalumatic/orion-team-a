import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

import { Employee } from '../../types/types';
import { EmployeeService } from '../../services/employee.service';

const PLACEHOLDER_EMPLOYEES: Employee[] = [
  { id: 1, firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@company.com' },
  { id: 2, firstName: 'Mark', lastName: 'Stevens', email: 'mark.stevens@company.com' },
  { id: 3, firstName: 'Sophia', lastName: 'Lee', email: 'sophia.lee@company.com' },
  { id: 4, firstName: 'James', lastName: 'Carter', email: 'james.carter@company.com' },
  { id: 5, firstName: 'Emma', lastName: 'Wilson', email: 'emma.wilson@company.com' },
  { id: 6, firstName: 'Liam', lastName: 'Davis', email: 'liam.davis@company.com' },
  { id: 7, firstName: 'Olivia', lastName: 'Martinez', email: 'olivia.martinez@company.com' },
  { id: 8, firstName: 'Noah', lastName: 'Anderson', email: 'noah.anderson@company.com' },
  { id: 9, firstName: 'Ava', lastName: 'Thomas', email: 'ava.thomas@company.com' },
  { id: 10, firstName: 'William', lastName: 'Jackson', email: 'william.jackson@company.com' },
  { id: 11, firstName: 'Isabella', lastName: 'White', email: 'isabella.white@company.com' },
  { id: 12, firstName: 'Benjamin', lastName: 'Harris', email: 'benjamin.harris@company.com' },
];

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
  ],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css'],
})
export class Employees implements AfterViewInit, OnInit {

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'actions'
  ];

  dataSource = new MatTableDataSource<Employee>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.dataSource.data = PLACEHOLDER_EMPLOYEES; // tmp - swap when backend is ready
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /* ================= CRUD ================= */

  openCreateDialog() {
    // TODO: open create dialog when form is ready
    console.log('Create employee - coming soon');
  }

  openUpdateDialog(employee: Employee) {
    // TODO: open update dialog when form is ready
    console.log('Update employee - coming soon', employee);
  }

  deleteEmployee(employee: Employee) {
    const confirmed = confirm('Are you sure you want to delete this employee?');

    if (confirmed) {
      this.employeeService.delete(employee.id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            item => item.id !== employee.id
          );
        },
        error: (err) => {
          console.error('Failed to delete employee', err);
        }
      });
    }
  }
}