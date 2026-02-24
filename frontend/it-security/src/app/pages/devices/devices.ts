import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

import { Device } from '../../types/types';
import { DeviceService } from '../../services/device.service';

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

  constructor(private deviceService: DeviceService) {}

  ngOnInit() {
    this.loadDevices();
    this.dataSource.data = PLACEHOLDER_DEVICES; // tmp
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /* ================= LOAD ================= */

  private loadDevices() {
    this.deviceService.getAll().subscribe({
      next: () => {
        this.dataSource.data = PLACEHOLDER_DEVICES; // tmp
      },
      error: (err) => {
        console.error('Failed to load devices', err);
      }
    });
  }

  /* ================= CRUD ================= */

  openCreateDialog() {
    // TODO: open create dialog when form is ready
    console.log('Create device - coming soon');
  }

  openUpdateDialog(device: Device) {
    // TODO: open update dialog when form is ready
    console.log('Update device - coming soon', device);
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