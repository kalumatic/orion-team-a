import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';

import { IncidentRequest, IncidentResponse } from '../../types';
import { IncidentService } from '../../core/services/incident.service';
import { IncidentDialog } from './incident-dialog/incident-dialog';

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
    'reporterName', 'description', 'deviceInfo',
    'incidentDate', 'severity', 'status', 'actions'
  ];

  private getYesterday(): Date {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  }

  filterValues: {
    date: Date | null;
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
    private incidentService: IncidentService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initializeFilter();
    this.loadIncidents();
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
      error: () => {}
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
    const dateValue = this.filterValues.date;
    let formattedDate: string | null = null;

    if (dateValue) {
      if (dateValue instanceof Date) {
        const yyyy = dateValue.getFullYear();
        const mm = String(dateValue.getMonth() + 1).padStart(2, '0');
        const dd = String(dateValue.getDate()).padStart(2, '0');
        formattedDate = `${yyyy}-${mm}-${dd}`;
      } else {
        formattedDate = dateValue;
      }
    }

    this.dataSource.filter = JSON.stringify({
      ...this.filterValues,
      date: formattedDate
    });
  }

  clearFilters() {
    this.filterValues = { date: null, deviceInfo: '', reporterName: '' };
    this.applyFilters();
  }

  /* ================= CRUD ================= */

  openCreateDialog() {
    const dialogRef = this.dialog.open(IncidentDialog, {
      width: '650px', disableClose: true, data: null
    });

    dialogRef.afterClosed().subscribe((result: IncidentRequest) => {
      if (result) {
        this.incidentService.create(result).subscribe({
          next: () => {
            this.toastr.success('Incident created successfully');
            this.loadIncidents();
          },
          error: () => {}
        });
      }
    });
  }

  openUpdateDialog(incident: IncidentResponse) {
    const dialogRef = this.dialog.open(IncidentDialog, {
      width: '650px', disableClose: true, data: { ...incident }
    });

    dialogRef.afterClosed().subscribe((result: IncidentRequest & { id: number }) => {
      if (result) {
        this.incidentService.update(result.id, result).subscribe({
          next: () => {
            this.toastr.success('Incident updated successfully');
            this.loadIncidents();
          },
          error: () => {}
        });
      }
    });
  }

  deleteIncident(incident: IncidentResponse) {
    const confirmed = confirm('Are you sure you want to delete this incident?');

    if (confirmed) {
      this.incidentService.delete(incident.id).subscribe({
        next: () => {
          this.toastr.success('Incident deleted successfully');
          this.loadIncidents();
        },
        error: () => {}
      });
    }
  }

  downloadPdf() {
    this.incidentService.downloadDailyReport().subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'daily-report.pdf';
        a.click();

        window.URL.revokeObjectURL(url);

        this.toastr.success('Daily report downloaded successfully');
      },
      error: () => {}
    });
  }
}