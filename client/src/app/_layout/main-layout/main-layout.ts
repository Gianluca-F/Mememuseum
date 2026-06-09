import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarService } from '../../_services/sidebar/sidebar.service';
import { TopbarComponent } from '../../navbar/topbar/topbar';
import { SidebarComponent } from '../../navbar/sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [TopbarComponent, SidebarComponent],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent {
  sidebarService = inject(SidebarService);

  @ViewChild('mainContent') mainContent!: ElementRef<HTMLElement>;

  constructor(router: Router) {
    router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.mainContent?.nativeElement.scrollTo({ top: 0 });
    });
  }
}