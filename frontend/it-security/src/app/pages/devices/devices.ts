import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { DeviceRequest, DeviceResponse, EmployeeResponse } from '../../types';
import { DeviceService } from '../../core/services/device.service';
import { EmployeeService } from '../../core/services/employee.service';
import { DeviceDialog } from './device-dialog/device-dialog';
import { DeviceReassignDialog } from './device-reassign-dialog/device-reassign-dialog';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDialogModule,
    DeviceDialog,
    DeviceReassignDialog,
    MatFormField,
    MatLabel,
    MatDatepickerModule,
    FormsModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './devices.html',
  styleUrls: ['./devices.css'],
})
export class Devices implements AfterViewInit, OnInit {

  displayedColumns: string[] = [
    'deviceType', 'model', 'serialNumber',
    'assignedEmployeeName', 'assignmentDate', 'actions'
  ];

  deviceFilterValues = {
    date: null as Date | null,
    serialNumber: '',
    deviceType: ''
  };

  private employeeMap = new Map<number, string>();
  dataSource = new MatTableDataSource<DeviceResponse>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private deviceService: DeviceService,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initializeFilter(); // add this
    this.employeeService.getAllUnpaged().subscribe({
      next: (employees) => {
        employees.forEach(emp => {
          this.employeeMap.set(emp.id, `${emp.firstName} ${emp.lastName}`);
        });
      },
      error: () => {} // interceptor handles it
    });
  }
  private initializeFilter() {
    this.dataSource.filterPredicate = (data: DeviceResponse, filter: string) => {
      const search = JSON.parse(filter);

      const matchesDate =
        !search.date ||
        data.assignmentDate === search.date;

      const matchesSerial =
        !search.serialNumber ||
        data.serialNumber.toLowerCase().includes(search.serialNumber);

      const matchesType =
        !search.deviceType ||
        data.deviceType.toLowerCase().includes(search.deviceType);

      return matchesDate && matchesSerial && matchesType;
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(() => this.loadDevices());
    this.loadDevices();
  }

  /* ================= LOAD ================= */

  private loadDevices() {
    const page = this.paginator.pageIndex;
    const size = this.paginator.pageSize || 10;

    this.deviceService.getAllPaged(page, size).subscribe({
      next: (response) => {
        this.dataSource.data = response.content.map(device => ({
          ...device,
          assignedEmployeeName: this.employeeMap.get(device.assignedEmployee) ?? 'Unknown'
        }));
        this.paginator.length = response.totalElements;
      },
      error: () => {}
    });
  }

  /* ================= CRUD ================= */

  openCreateDialog() {
    const dialogRef = this.dialog.open(DeviceDialog, {
      width: '650px', disableClose: true, data: null
    });

    dialogRef.afterClosed().subscribe((result: DeviceRequest) => {
      if (result) {
        this.deviceService.create(result).subscribe({
          next: () => {
            this.toastr.success('Device created successfully');
            this.loadDevices();
          },
          error: () => {}
        });
      }
    });
  }

  openUpdateDialog(device: DeviceResponse) {
    const dialogRef = this.dialog.open(DeviceDialog, {
      width: '650px', disableClose: true, data: { ...device }
    });

    dialogRef.afterClosed().subscribe((result: DeviceRequest & { id: number }) => {
      if (result) {
        this.deviceService.update(result.id, result).subscribe({
          next: () => {
            this.toastr.success('Device updated successfully');
            this.loadDevices();
          },
          error: () => {}
        });
      }
    });
  }

  openReassignDialog(device: DeviceResponse) {
    const dialogRef = this.dialog.open(DeviceReassignDialog, {
      width: '500px', disableClose: true, data: { ...device }
    });

    dialogRef.afterClosed().subscribe((result: EmployeeResponse) => {
      if (result) {
        const reassignRequest: DeviceRequest = {
          deviceType: device.deviceType,
          model: device.model,
          serialNumber: device.serialNumber,
          assignedEmployeeId: result.id,
          assignmentDate: new Date().toISOString().split('T')[0]
        };

        this.deviceService.update(device.id, reassignRequest).subscribe({
          next: () => {
            this.toastr.success('Device reassigned successfully');
            this.loadDevices();
          },
          error: () => {}
        });
      }
    });
  }

  deleteDevice(device: DeviceResponse) {
    const confirmed = confirm('Are you sure you want to delete this device?');

    if (confirmed) {
      this.deviceService.delete(device.id).subscribe({
        next: () => {
          this.toastr.success('Device deleted successfully');
          this.loadDevices();
        },
        error: () => {}
      });
    }
  }

  downloadCsv() {
    this.deviceService.downloadCsv().subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body!;
        const disposition = response.headers.get('Content-Disposition') ?? '';
        const filename = disposition.match(/filename="(.+?)"/)?.[1] ?? 'devices.csv';

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

  applyDeviceFilters() {
    let formattedDate: string | null = null;

    if (this.deviceFilterValues.date) {
      const d = this.deviceFilterValues.date;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      formattedDate = `${yyyy}-${mm}-${dd}`;
    }

    this.dataSource.filter = JSON.stringify({
      serialNumber: this.deviceFilterValues.serialNumber.toLowerCase(),
      deviceType: this.deviceFilterValues.deviceType.toLowerCase(),
      date: formattedDate
    });
  }

  clearDeviceFilters() {
    this.deviceFilterValues = { date: null, serialNumber: '', deviceType: '' };
    this.dataSource.filter = '';
  }
}