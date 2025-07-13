import { Component, inject } from '@angular/core';
import { SidebarService } from '../../_services/sidebar/sidebar';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  sidebarOpen = false;
  sidebarService = inject(SidebarService);

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // Metodo per chiudere la sidebar quando si clicca su un link (utile per mobile)
  onLinkClick() {
    this.sidebarService.closeMobileSidebar();
  }
  
  // Metodo per chiudere la sidebar
  closeSidebar() {
    this.sidebarService.closeMobileSidebar();
  }

}
