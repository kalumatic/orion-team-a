import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';

import { Device } from '../../types/types';


const DEVICE_DATA: Device[] = [
  {
    deviceType: 'Laptop',
    model: 'Dell XPS 13',
    serialNumber: 'DX13-00123',
    assignmentDate: new Date(2024, 5, 12)
  },
  {
    deviceType: 'Phone',
    model: 'iPhone 14',
    serialNumber: 'IP14-00987',
    assignmentDate: new Date(2024, 7, 2)
  }
];

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule
  ],
  templateUrl: './devices.html',
  styleUrl: './devices.css',
})
export class Devices implements AfterViewInit {

  displayedColumns: string[] = [
    'deviceType',
    'model',
    'serialNumber',
    'assignmentDate'
  ];

  dataSource = new MatTableDataSource<Device>(DEVICE_DATA);

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}