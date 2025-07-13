import { Component, inject } from '@angular/core';
import { AuthService } from '../../_services/auth/auth';
import { SidebarService } from '../../_services/sidebar/sidebar';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss']
})
export class TopbarComponent {
  authService = inject(AuthService);
  sidebarService = inject(SidebarService);

  toggleSidebar() {
    this.sidebarService.toggleDesktopSidebar();
  }

  toggleMobileSidebar() {
    this.sidebarService.toggleMobileSidebar();
  }

  closeSidebar() {
    this.sidebarService.closeMobileSidebar();
  }
  
  logout() {
    this.authService.logout();
  }
}