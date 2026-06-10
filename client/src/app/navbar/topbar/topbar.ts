import { Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../_services/auth/auth';
import { SidebarService } from '../../_services/sidebar/sidebar.service';
import { DarkModeToggleComponent } from './dark-mode-toggle/dark-mode-toggle';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, FormsModule, DarkModeToggleComponent],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss']
})
export class TopbarComponent {
  authService = inject(AuthService);
  sidebarService = inject(SidebarService);
  private router = inject(Router);

  @ViewChild('userMenuContainer') userMenuContainer?: ElementRef<HTMLElement>;

  userInitial = computed(() => this.authService.userName()?.charAt(0).toUpperCase() ?? '?');

  isUserMenuOpen = signal(false);

  toggleUserMenu() {
    this.isUserMenuOpen.update(open => !open);
  }

  search(query: string) {
    const tags = query.trim();
    this.router.navigate(['/explore'], {
      queryParams: tags ? { tags, match: 'any' } : null,
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isUserMenuOpen() && !this.userMenuContainer?.nativeElement.contains(event.target as Node)) {
      this.isUserMenuOpen.set(false);
    }
  }
}