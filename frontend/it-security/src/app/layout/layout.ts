import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Topbar } from './topbar/topbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Topbar,
    Sidebar,
    MatSidenavModule,
    MatToolbarModule
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}