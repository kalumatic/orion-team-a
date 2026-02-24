import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { IncidentDialog } from './incident-dialog/incident-dialog';

export interface Incident {
  reporter: string;
  description: string;
  device: string;
  date: Date;
  severity: string;
  status: string;
}

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatChipsModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './incidents.html',
  styleUrl: './incidents.css',
})
export class Incidents implements AfterViewInit {

  displayedColumns: string[] = [
    'reporter',
    'description',
    'device',
    'date',
    'severity',
    'status'
  ];

  dataSource = new MatTableDataSource<Incident>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(IncidentDialog, {
      width: '650px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result];
      }
    });
  }
}