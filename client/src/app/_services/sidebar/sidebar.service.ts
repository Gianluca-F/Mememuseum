import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Signal per lo stato della sidebar mobile
  private _isMobileSidebarOpen = signal(false);
  
  // Getter pubblici per i signals
  isMobileSidebarOpen = this._isMobileSidebarOpen.asReadonly();
  
  // Metodi per gestire la sidebar mobile
  toggleMobileSidebar() {
    this._isMobileSidebarOpen.update(current => !current);
  }

  closeMobileSidebar() {
    this._isMobileSidebarOpen.set(false);
  }
}