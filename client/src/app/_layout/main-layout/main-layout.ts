import { Component, inject } from '@angular/core';
import { SidebarService } from '../../_services/sidebar/sidebar';
import { TopbarComponent } from '../../navbar/topbar/topbar';
import { SidebarComponent } from '../../navbar/sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [TopbarComponent, SidebarComponent],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent {

  sidebarOpen = false;
  sidebarService = inject(SidebarService);
 
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  onOverlayClick() {
    this.sidebarService.closeMobileSidebar();
  }
  
}