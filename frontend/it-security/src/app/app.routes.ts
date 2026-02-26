import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Incidents } from './pages/incidents/incidents';
import { Devices } from './pages/devices/devices';
import { Employees } from './pages/employees/employees';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'incidents', component: Incidents },
      { path: 'devices', component: Devices },
      { path: '', redirectTo: 'incidents', pathMatch: 'full' },
      { path: 'employees', component: Employees}
    ]
  }
];