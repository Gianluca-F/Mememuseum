import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Signal per lo stato della sidebar mobile
  private _isMobileSidebarOpen = signal(false);
  
  // Signal per lo stato della sidebar desktop (opzionale se vuoi renderla collassabile)
  private _isDesktopSidebarOpen = signal(true);
  
  // Getter pubblici per i signals
  isMobileSidebarOpen = this._isMobileSidebarOpen.asReadonly();
  isDesktopSidebarOpen = this._isDesktopSidebarOpen.asReadonly();
  
  // Metodi per gestire la sidebar mobile
  toggleMobileSidebar() {
    this._isMobileSidebarOpen.update(current => !current);
  }
  
  openMobileSidebar() {
    this._isMobileSidebarOpen.set(true);
  } // NOTE: ! not actually used !

  closeMobileSidebar() {
    this._isMobileSidebarOpen.set(false);
  }
  
  // Metodi per gestire la sidebar desktop (opzionale)
  // NOTE: ! not actually used these 3 !
  toggleDesktopSidebar() {
    this._isDesktopSidebarOpen.update(current => !current);
  }
  
  openDesktopSidebar() {
    this._isDesktopSidebarOpen.set(true);
  }
  
  closeDesktopSidebar() {
    this._isDesktopSidebarOpen.set(false);
  }
}