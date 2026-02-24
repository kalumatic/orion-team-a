import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Incidents } from './pages/incidents/incidents';
import { Devices } from './pages/devices/devices';
import { Reports } from './pages/reports/reports';
import { Topbar } from './layout/topbar/topbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Layout, Topbar, Dashboard, Devices, Incidents, Reports],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('it-security');
}
