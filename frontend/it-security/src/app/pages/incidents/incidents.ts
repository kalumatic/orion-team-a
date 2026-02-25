import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { IncidentDialog } from './incident-dialog/incident-dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IncidentRequest, IncidentResponse } from '../../types';
import { IncidentService } from '../../services/incident.service';

const PLACEHOLDER_INCIDENTS: IncidentResponse[] = [
  {
    id: 1,
    reporterName: 'Alice Johnson',
    reporterId: 1,
    description: 'Device overheating during operation',
    deviceInfo: 'Router - RX200-8891',
    deviceId: 1,
    incidentDate: '2026-02-10',
    severity: 'High',
    status: 'Open'
  },
  {
    id: 2,
    reporterName: 'Mark Stevens',
    reporterId: 2,
    description: 'Screen flickering intermittently',
    deviceInfo: 'Monitor - MP24-3344',
    deviceId: 2,
    incidentDate: '2026-02-14',
    severity: 'Medium',
    status: 'In Progress'
  },
  {
    id: 3,
    reporterName: 'Sophia Lee',
    reporterId: 3,
    description: 'Battery draining too quickly',
    deviceInfo: 'Tablet - TZ10-9901',
    deviceId: 3,
    incidentDate: '2026-02-18',
    severity: 'Low',
    status: 'Resolved'
  }
];

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    IncidentDialog,
    MatIconModule
  ],
  templateUrl: './incidents.html',
  styleUrls: ['./incidents.css'],
})
export class Incidents implements AfterViewInit, OnInit {

  displayedColumns: string[] = [
    'reporterName',
    'description',
    'deviceInfo',
    'incidentDate',
    'severity',
    'status',
    'actions'
  ];

  private getYesterday(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  filterValues: {
    date: string | null;
    deviceInfo: string;
    reporterName: string;
  } = {
    date: this.getYesterday(),
    deviceInfo: '',
    reporterName: ''
  };

  dataSource = new MatTableDataSource<IncidentResponse>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private incidentService: IncidentService
  ) {}

  ngOnInit() {
    this.initializeFilter();
    this.dataSource.data = PLACEHOLDER_INCIDENTS; // tmp - replace with loadIncidents()
    this.applyFilters();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /* ================= LOAD ================= */

  private loadIncidents() {
    this.incidentService.getAll().subscribe({
      next: (incidents) => {
        this.dataSource.data = incidents;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Failed to load incidents', err);
      }
    });
  }

  /* ================= FILTER LOGIC ================= */

  private initializeFilter() {
    this.dataSource.filterPredicate = (data: IncidentResponse, filter: string) => {
      const search = JSON.parse(filter);

      const matchesDate =
        !search.date ||
        data.incidentDate === search.date;

      const matchesDeviceInfo =
        !search.deviceInfo ||
        data.deviceInfo.toLowerCase().includes(search.deviceInfo.toLowerCase());

      const matchesReporter =
        !search.reporterName ||
        data.reporterName.toLowerCase().includes(search.reporterName.toLowerCase());

      return matchesDate && matchesDeviceInfo && matchesReporter;
    };
  }

  applyFilters() {
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  clearFilters() {
    this.filterValues = {
      date: null,
      deviceInfo: '',
      reporterName: ''
    };
    this.applyFilters();
  }

  /* ================= CRUD ================= */

  openCreateDialog() {
    const dialogRef = this.dialog.open(IncidentDialog, {
      width: '650px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe((result: IncidentRequest) => {
      if (result) {
        this.incidentService.create(result).subscribe({
          next: (created) => {
            this.dataSource.data = [...this.dataSource.data, created];
            this.applyFilters();
          },
          error: (err) => console.error('Failed to create incident', err)
        });
      }
    });
  }

  openUpdateDialog(incident: IncidentResponse) {
    const dialogRef = this.dialog.open(IncidentDialog, {
      width: '650px',
      disableClose: true,
      data: { ...incident }
    });

    console.log(incident);

    dialogRef.afterClosed().subscribe((result: IncidentRequest & { id: number }) => {
      if (result) {
        this.incidentService.update(result.id, result).subscribe({
          next: (updated) => {
            this.dataSource.data = this.dataSource.data.map(item =>
              item.id === updated.id ? updated : item
            );
            this.applyFilters();
          },
          error: (err) => console.error('Failed to update incident', err)
        });
      }
    });
  }

  deleteIncident(incident: IncidentResponse) {
    const confirmed = confirm('Are you sure you want to delete this incident?');

    if (confirmed) {
      this.incidentService.delete(incident.id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            item => item.id !== incident.id
          );
          this.applyFilters();
        },
        error: (err) => console.error('Failed to delete incident', err)
      });
    }
  }
}