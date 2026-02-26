import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { EmployeeRequest, EmployeeResponse } from '../../types';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDialog } from './employee-dialog/employee-dialog';
import { HttpResponse } from '@angular/common/http';

const PLACEHOLDER_EMPLOYEES: EmployeeResponse[] = [
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
    MatDialogModule,
    EmployeeDialog,
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

  dataSource = new MatTableDataSource<EmployeeResponse>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource.data = PLACEHOLDER_EMPLOYEES; // tmp - remove and call loadEmployees() when backend is ready
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // trigger backend call on every page or page size change
    this.paginator.page.subscribe(() => {
      this.loadEmployees();
    });
  }

  /* ================= LOAD ================= */

  private loadEmployees() {
    const page = this.paginator.pageIndex;
    const size = this.paginator.pageSize;

    this.employeeService.getAll(page, size).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.paginator.length = response.totalElements;
      },
      error: (err) => console.error('Failed to load employees', err)
    });
  }

  /* ================= CRUD ================= */

  openCreateDialog() {
    const dialogRef = this.dialog.open(EmployeeDialog, {
      width: '650px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe((result: EmployeeRequest) => {
      if (result) {
        this.employeeService.create(result).subscribe({
          next: (created) => {
            this.dataSource.data = [...this.dataSource.data, created];
          },
          error: (err) => console.error('Failed to create employee', err)
        });
      }
    });
  }

  openUpdateDialog(employee: EmployeeResponse) {
    const dialogRef = this.dialog.open(EmployeeDialog, {
      width: '650px',
      disableClose: true,
      data: { ...employee }
    });

    dialogRef.afterClosed().subscribe((result: EmployeeRequest & { id: number }) => {
      if (result) {
        this.employeeService.update(result.id, result).subscribe({
          next: (updated) => {
            this.dataSource.data = this.dataSource.data.map(item =>
              item.id === updated.id ? updated : item
            );
          },
          error: (err) => console.error('Failed to update employee', err)
        });
      }
    });
  }

  deleteEmployee(employee: EmployeeResponse) {
    const confirmed = confirm('Are you sure you want to delete this employee?');

    if (confirmed) {
      this.employeeService.delete(employee.id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            item => item.id !== employee.id
          );
        },
        error: (err) => console.error('Failed to delete employee', err)
      });
    }
  }

  downloadCsv() {
    this.employeeService.downloadCsv().subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body!;
        const disposition = response.headers.get('Content-Disposition') ?? '';
        const filename = disposition.match(/filename="(.+?)"/)?.[1] ?? 'employees.csv';

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Download failed', err)
    });
  }
}