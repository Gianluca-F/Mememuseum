import { Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../_services/auth/auth';
import { SidebarService } from '../../_services/sidebar/sidebar.service';
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

  @ViewChild('userMenuContainer') userMenuContainer?: ElementRef<HTMLElement>;

  userInitial = computed(() => this.authService.userName()?.charAt(0).toUpperCase() ?? '?');

  isUserMenuOpen = signal(false);

  toggleUserMenu() {
    this.isUserMenuOpen.update(open => !open);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isUserMenuOpen() && !this.userMenuContainer?.nativeElement.contains(event.target as Node)) {
      this.isUserMenuOpen.set(false);
    }
  }
}