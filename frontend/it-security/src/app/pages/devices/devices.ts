import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Device } from '../../types/types';
import { DeviceService } from '../../services/device.service';
import { DeviceDialog } from './device-dialog/device-dialog';

const PLACEHOLDER_DEVICES: Device[] = [
  {
    id: 1,
    deviceType: 'Laptop',
    model: 'Dell XPS 15',
    serialNumber: 'SN12345',
    assignedEmployee: 'Alice Johnson'
  },
  {
    id: 2,
    deviceType: 'Phone',
    model: 'iPhone 14',
    serialNumber: 'SN54321',
    assignedEmployee: 'Mark Stevens'
  },
  {
    id: 3,
    deviceType: 'Tablet',
    model: 'iPad Pro',
    serialNumber: 'SN99988',
    assignedEmployee: 'Sophia Lee'
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
  ],
  templateUrl: './devices.html',
  styleUrls: ['./devices.css'],
})
export class Devices implements AfterViewInit, OnInit {

  displayedColumns: string[] = [
    'deviceType',
    'model',
    'serialNumber',
    'assignedEmployee',
    'actions'
  ];

  dataSource = new MatTableDataSource<Device>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private deviceService: DeviceService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataSource.data = PLACEHOLDER_DEVICES; // tmp - swap when backend is ready
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /* ================= CRUD ================= */

  openCreateDialog() {
    const dialogRef = this.dialog.open(DeviceDialog, {
      width: '650px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deviceService.create(result).subscribe({
          next: (created) => {
            this.dataSource.data = [...this.dataSource.data, created];
          },
          error: (err) => {
            console.error('Failed to create device', err);
          }
        });
      }
    });
  }

  openUpdateDialog(device: Device) {
    const dialogRef = this.dialog.open(DeviceDialog, {
      width: '650px',
      disableClose: true,
      data: { ...device }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deviceService.update(result.id, result).subscribe({
          next: (updated) => {
            this.dataSource.data = this.dataSource.data.map(item =>
              item.id === updated.id ? updated : item
            );
          },
          error: (err) => {
            console.error('Failed to update device', err);
          }
        });
      }
    });
  }

  openReassignDialog(device: Device) {
    // TODO: open reassign dialog when form is ready
    console.log('Reassign device - coming soon', device);
  }

  deleteDevice(device: Device) {
    const confirmed = confirm('Are you sure you want to delete this device?');

    if (confirmed) {
      this.deviceService.delete(device.id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            item => item.id !== device.id
          );
        },
        error: (err) => {
          console.error('Failed to delete device', err);
        }
      });
    }
  }
}