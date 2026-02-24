import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Incidents } from './pages/incidents/incidents';
import { Devices } from './pages/devices/devices';
import { Reports } from './pages/reports/reports';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'incidents', component: Incidents },
      { path: 'devices', component: Devices },
      { path: 'reports', component: Reports },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];