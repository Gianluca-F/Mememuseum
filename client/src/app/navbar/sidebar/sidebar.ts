import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../_services/sidebar/sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  sidebarOpen = false; /* NOTE: ! not actually used */
  sidebarService = inject(SidebarService);

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  } /* NOTE: ! not actually used ! */

  // Metodo per chiudere la sidebar quando si clicca su un link (utile per mobile)
  onLinkClick() {
    this.sidebarService.closeMobileSidebar();
  }
  
  // Metodo per chiudere la sidebar
  closeSidebar() {
    this.sidebarService.closeMobileSidebar();
  }

}
