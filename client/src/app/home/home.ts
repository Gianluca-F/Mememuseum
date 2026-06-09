import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MemeService } from '../_services/meme/meme.service';
import { AuthService } from '../_services/auth/auth';
import { MemeDetail, MemeList } from '../_models/api.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  private memeService = inject(MemeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authService = inject(AuthService);

  memeOfTheDay = signal<MemeDetail | null>(null);
  motdLoading = signal(true);
  motdError = signal(false);

  memes = signal<MemeList[]>([]);
  memesLoading = signal(true);
  memesError = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  hasNextPage = signal(false);
  hasPreviousPage = signal(false);

  ngOnInit() {
    this.memeService.getMemeOfTheDay().subscribe({
      next: (meme) => {
        this.memeOfTheDay.set(meme);
        this.motdLoading.set(false);
      },
      error: () => {
        this.motdError.set(true);
        this.motdLoading.set(false);
      }
    });

    const initialPage = Math.max(1, Number(this.route.snapshot.queryParamMap.get('page')) || 1);
    this.loadPage(initialPage);
  }

  loadPage(page: number) {
    if (page < 1) {
      this.loadPage(1);
      return;
    };

    this.router.navigate([], {
      queryParams: { page: page > 1 ? page : null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.fetchPage(page);
  }

  private fetchPage(page: number) {
    this.memesLoading.set(true);
    this.memesError.set(false);
    this.memeService.getAllMemes({ page }).subscribe({
      next: (response) => {
        const totalpages = response.pagination.totalPages;
        if (totalpages > 0 && page > totalpages) {
          this.loadPage(1);
          return;
        }
        this.memes.set(response.data);
        this.currentPage.set(response.pagination.page);
        this.totalPages.set(totalpages);
        this.hasNextPage.set(response.pagination.hasNextPage);
        this.hasPreviousPage.set(response.pagination.hasPreviousPage);
        this.memesLoading.set(false);
      },
      error: () => {
        this.memesError.set(true);
        this.memesLoading.set(false);
      }
    });
  }

  imageUrl(path: string) {
    return this.memeService.getImageUrl(path);
  }
}
