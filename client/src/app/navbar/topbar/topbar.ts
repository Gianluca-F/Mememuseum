import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../_services/auth/auth';
import { SidebarService } from '../../_services/sidebar/sidebar';
import { DarkModeToggleComponent } from './dark-mode-toggle/dark-mode-toggle';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, DarkModeToggleComponent],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss']
})
export class TopbarComponent {
  authService = inject(AuthService);
  sidebarService = inject(SidebarService);

  toggleSidebar() {
    this.sidebarService.toggleDesktopSidebar();
  } /* NOTE: ! not actually used ! */

  toggleMobileSidebar() {
    this.sidebarService.toggleMobileSidebar();
  }

  closeSidebar() {
    this.sidebarService.closeMobileSidebar();
  } /* NOTE: ! not actually used ! */

  logout() {
    this.authService.logout();
  }
}