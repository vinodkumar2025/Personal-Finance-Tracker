import { Component } from '@angular/core';
import { TopNavbarComponent } from "../top-navbar/top-navbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-main-index',
  standalone: true,
  imports: [TopNavbarComponent, SidebarComponent, RouterOutlet,
    CommonModule,
    MatSidenavModule,
  ],
  templateUrl: './main-index.component.html',
  styleUrl: './main-index.component.scss'
})
export class MainIndexComponent {

}
