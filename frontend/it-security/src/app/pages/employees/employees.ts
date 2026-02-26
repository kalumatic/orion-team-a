import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { EmployeeRequest, EmployeeResponse } from '../../types';
import { EmployeeService } from '../../core/services/employee.service';
import { EmployeeDialog } from './employee-dialog/employee-dialog';

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

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'actions'];

  dataSource = new MatTableDataSource<EmployeeResponse>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(() => this.loadEmployees());
    this.loadEmployees();
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
      error: () => {}
    });
  }

  /* ================= CRUD ================= */

  openCreateDialog() {
    const dialogRef = this.dialog.open(EmployeeDialog, {
      width: '650px', disableClose: true, data: null
    });

    dialogRef.afterClosed().subscribe((result: EmployeeRequest) => {
      if (result) {
        this.employeeService.create(result).subscribe({
          next: () => {
            this.toastr.success('Employee created successfully');
            this.loadEmployees();
          },
          error: () => {}
        });
      }
    });
  }

  openUpdateDialog(employee: EmployeeResponse) {
    const dialogRef = this.dialog.open(EmployeeDialog, {
      width: '650px', disableClose: true, data: { ...employee }
    });

    dialogRef.afterClosed().subscribe((result: EmployeeRequest & { id: number }) => {
      if (result) {
        this.employeeService.update(result.id, result).subscribe({
          next: () => {
            this.toastr.success('Employee updated successfully');
            this.loadEmployees();
          },
          error: () => {}
        });
      }
    });
  }

  deleteEmployee(employee: EmployeeResponse) {
    const confirmed = confirm('Are you sure you want to delete this employee?');

    if (confirmed) {
      this.employeeService.delete(employee.id).subscribe({
        next: () => {
          this.toastr.success('Employee deleted successfully');
          this.loadEmployees();
        },
        error: () => {}
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

        this.toastr.success('CSV downloaded successfully');
      },
      error: () => {}
    });
  }
}