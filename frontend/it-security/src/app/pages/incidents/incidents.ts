import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { IncidentDialog } from './incident-dialog/incident-dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Incident } from '../../types/types';
import { IncidentService } from '../../services/incident.service';




const PLACEHOLDER_INCIDENTS: Incident[] = [
  {
    id: 1,
    reporter: 'Alice Johnson',
    description: 'Device overheating during operation',
    serialNumber: 'RX200-8891',
    deviceType: 'Router',
    date: new Date('2026-02-10'),
    severity: 'High',
    status: 'Open'
  },
  {
    id: 2,
    reporter: 'Mark Stevens',
    description: 'Screen flickering intermittently',
    serialNumber: 'MP24-3344',
    deviceType: 'Monitor',
    date: new Date('2026-02-14'),
    severity: 'Medium',
    status: 'In Progress'
  },
  {
    id: 3,
    reporter: 'Sophia Lee',
    description: 'Battery draining too quickly',
    serialNumber: 'TZ10-9901',
    deviceType: 'Tablet',
    date: new Date('2026-02-18'),
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
    IncidentDialog
  ],
  templateUrl: './incidents.html',
  styleUrls: ['./incidents.css'],
})
export class Incidents implements AfterViewInit, OnInit {
  //placeholders
  

  displayedColumns: string[] = [
    'reporter',
    'description',
    'serialNumber',
    'deviceType',
    'date',
    'severity',
    'status',
    'actions'
  ];

  /* ================= DEFAULT DATE (YESTERDAY) ================= */

  private getYesterday(): Date {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  filterValues: {
    date: Date | null;
    serialNumber: string;
    deviceType: string;
  } = {
    date: this.getYesterday(),
    serialNumber: '',
    deviceType: ''
  };

  dataSource = new MatTableDataSource<Incident>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private incidentService: IncidentService
  ) {}

  ngOnInit() {
    this.initializeFilter();
    //this.loadIncidents();
    this.dataSource.data = PLACEHOLDER_INCIDENTS; // tmp
    this.applyFilters(); // apply yesterday filter on init
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /* ================= LOAD ================= */

  private loadIncidents() {
    this.incidentService.getAll().subscribe({
      next: (incidents) => {
        this.dataSource.data = incidents;
        this.dataSource.data = PLACEHOLDER_INCIDENTS; // tmp 
        this.applyFilters(); // apply yesterday filter after data loads
      },
      error: (err) => {
        console.error('Failed to load incidents', err);
      }
    });
  }

  /* ================= FILTER LOGIC ================= */

  private initializeFilter() {
    this.dataSource.filterPredicate = (data: Incident, filter: string) => {
      const search = JSON.parse(filter);

      const matchesDate =
        !search.date ||
        new Date(data.date).toDateString() ===
          new Date(search.date).toDateString();

      const matchesSerial =
        !search.serialNumber ||
        data.serialNumber
          .toLowerCase()
          .includes(search.serialNumber.toLowerCase());

      const matchesDevice =
        !search.deviceType ||
        data.deviceType
          .toLowerCase()
          .includes(search.deviceType.toLowerCase());

      return matchesDate && matchesSerial && matchesDevice;
    };
  }

  applyFilters() {
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  clearFilters() {
    this.filterValues = {
      date: null,
      serialNumber: '',
      deviceType: ''
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.incidentService.create(result).subscribe({
          next: (created) => {
            this.dataSource.data = [...this.dataSource.data, created];
            this.applyFilters();
          },
          error: (err) => {
            console.error('Failed to create incident', err);
          }
        });
      }
    });
  }

  openUpdateDialog(incident: Incident) {
    const dialogRef = this.dialog.open(IncidentDialog, {
      width: '650px',
      disableClose: true,
      data: { ...incident }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.incidentService.update(result.id, result).subscribe({
          next: (updated) => {
            this.dataSource.data = this.dataSource.data.map(item =>
              item.id === updated.id ? updated : item
            );
            this.applyFilters();
          },
          error: (err) => {
            console.error('Failed to update incident', err);
          }
        });
      }
    });
  }

  deleteIncident(incident: Incident) {
    const confirmed = confirm('Are you sure you want to delete this incident?');

    if (confirmed) {
      this.incidentService.delete(incident.id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            item => item.id !== incident.id
          );
          this.applyFilters();
        },
        error: (err) => {
          console.error('Failed to delete incident', err);
        }
      });
    }
  }
}