import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DeviceRequest, DeviceResponse } from '../../types';
import { DeviceService } from '../../services/device.service';
import { EmployeeService } from '../../services/employee.service';
import { DeviceDialog } from './device-dialog/device-dialog';
import { DeviceReassignDialog } from './device-reassign-dialog/device-reassign-dialog';

const PLACEHOLDER_DEVICES: DeviceResponse[] = [
  {
    id: 1,
    deviceType: 'Laptop',
    model: 'Dell XPS 15',
    serialNumber: 'SN12345',
    assignedEmployee: 1,
    assignedEmployeeName: 'Alice Johnson',
    assignmentDate: '2025-01-10'
  },
  {
    id: 2,
    deviceType: 'Phone',
    model: 'iPhone 14',
    serialNumber: 'SN54321',
    assignedEmployee: 2,
    assignedEmployeeName: 'Mark Stevens',
    assignmentDate: '2025-03-22'
  },
  {
    id: 3,
    deviceType: 'Tablet',
    model: 'iPad Pro',
    serialNumber: 'SN99988',
    assignedEmployee: 3,
    assignedEmployeeName: 'Sophia Lee',
    assignmentDate: '2025-06-05'
  }
];

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    DeviceDialog,
    DeviceReassignDialog
  ],
  templateUrl: './devices.html',
  styleUrls: ['./devices.css'],
})
export class Devices implements AfterViewInit, OnInit {

  displayedColumns: string[] = [
    'deviceType',
    'model',
    'serialNumber',
    'assignedEmployeeName',
    'assignmentDate',
    'actions'
  ];

  private employeeMap = new Map<number, string>();

  dataSource = new MatTableDataSource<DeviceResponse>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private deviceService: DeviceService,
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadDevices();
    this.dataSource.data = PLACEHOLDER_DEVICES;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /* ================= LOAD ================= */

  private loadDevices() {
    forkJoin({
      employees: this.employeeService.getAllUnpaged(),
      devices: this.deviceService.getAll()
    }).subscribe({
      next: ({ employees, devices }) => {
        employees.forEach(emp => {
          this.employeeMap.set(emp.id, `${emp.firstName} ${emp.lastName}`);
        });
        this.dataSource.data = devices.map(device => ({
          ...device,
          assignedEmployeeName: this.employeeMap.get(device.assignedEmployee) ?? 'Unknown'
        }));
      },
      error: (err) => console.error('Failed to load data', err)
    });
  }

  /* ================= CRUD ================= */

  openCreateDialog() {
    const dialogRef = this.dialog.open(DeviceDialog, {
      width: '650px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe((result: DeviceRequest) => {
      if (result) {
        this.deviceService.create(result).subscribe({
          next: (created) => {
            const withName: DeviceResponse = {
              ...created,
              assignedEmployeeName: this.employeeMap.get(created.assignedEmployee) ?? 'Unknown'
            };
            this.dataSource.data = [...this.dataSource.data, withName];
          },
          error: (err) => console.error('Failed to create device', err)
        });
      }
    });
  }

  openUpdateDialog(device: DeviceResponse) {
    const dialogRef = this.dialog.open(DeviceDialog, {
      width: '650px',
      disableClose: true,
      data: { ...device }
    });

    dialogRef.afterClosed().subscribe((result: DeviceRequest & { id: number }) => {
      if (result) {
        this.deviceService.update(result.id, result).subscribe({
          next: (updated) => {
            const withName: DeviceResponse = {
              ...updated,
              assignedEmployeeName: this.employeeMap.get(updated.assignedEmployee) ?? 'Unknown'
            };
            this.dataSource.data = this.dataSource.data.map(item =>
              item.id === withName.id ? withName : item
            );
          },
          error: (err) => console.error('Failed to update device', err)
        });
      }
    });
  }

  openReassignDialog(device: DeviceResponse) {
    const dialogRef = this.dialog.open(DeviceReassignDialog, {
      width: '500px',
      disableClose: true,
      data: { ...device }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const reassignRequest: DeviceRequest = {
          deviceType: device.deviceType,
          model: device.model,
          serialNumber: device.serialNumber,
          assignedEmployeeId: result.id,
          assignmentDate: new Date().toISOString().split('T')[0]
        };

        this.deviceService.update(device.id, reassignRequest).subscribe({
          next: (updated) => {
            const withName: DeviceResponse = {
              ...updated,
              assignedEmployeeName: `${result.firstName} ${result.lastName}`
            };
            this.dataSource.data = this.dataSource.data.map(item =>
              item.id === withName.id ? withName : item
            );
          },
          error: (err) => console.error('Failed to reassign device', err)
        });
      }
    });
  }

  deleteDevice(device: DeviceResponse) {
    const confirmed = confirm('Are you sure you want to delete this device?');

    if (confirmed) {
      this.deviceService.delete(device.id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            item => item.id !== device.id
          );
        },
        error: (err) => console.error('Failed to delete device', err)
      });
    }
  }
}