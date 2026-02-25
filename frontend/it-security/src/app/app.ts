import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Incidents } from './pages/incidents/incidents';
import { Devices } from './pages/devices/devices';
import { Topbar } from './layout/topbar/topbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Layout, Topbar, Devices, Incidents],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('it-security');
}
