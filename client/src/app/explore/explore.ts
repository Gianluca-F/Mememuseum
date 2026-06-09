import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchForm } from './explore-state';
import { MemeService } from '../_services/meme/meme.service';
import { MemeList, MemeQueryParams } from '../_models/api.models';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './explore.html',
  styleUrls: ['./explore.scss']
})
export class ExploreComponent implements OnInit {
  private memeService = inject(MemeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  memes = signal<MemeList[]>([]);
  isLoading = signal(true);
  loadError = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  hasNextPage = signal(false);
  hasPreviousPage = signal(false);

  form: SearchForm = {
    title: '',
    tags: '',
    match: 'any',
    orderBy: 'createdAt_DESC',
  };

  readonly orderByOptions = [
    { value: 'createdAt_DESC', label: 'Più recenti' },
    { value: 'createdAt_ASC',  label: 'Meno recenti' },
    { value: 'upvotes_DESC',   label: 'Più upvotati' },
    { value: 'downvotes_DESC', label: 'Più downvotati' },
  ];

  ngOnInit() {
    const initialPage = Math.max(1, Number(this.route.snapshot.queryParamMap.get('page')) || 1);
    this.loadPage(initialPage);
  }

  search() {
    this.loadPage(1);
  }

  reset() {
    this.form = { title: '', tags: '', match: 'any', orderBy: 'createdAt_DESC' };
  }

  loadPage(page: number) {
    this.router.navigate([], {
      queryParams: { page: page > 1 ? page : null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.fetchPage(page);
  }

  private fetchPage(page: number) {
    this.isLoading.set(true);
    this.loadError.set(false);

    const [sortedBy, sortDirection] = this.form.orderBy.split('_') as [
      MemeQueryParams['sortedBy'],
      MemeQueryParams['sortDirection']
    ];

    const query: MemeQueryParams = { page, sortedBy, sortDirection };
    if (this.form.title.trim()) query.title = this.form.title.trim();
    if (this.form.tags.trim()) {
      query.tags = this.form.tags.trim();
      query.match = this.form.match;
    }

    this.memeService.getAllMemes(query).subscribe({
      next: (response) => {
        this.memes.set(response.data);
        this.currentPage.set(response.pagination.page);
        this.totalPages.set(response.pagination.totalPages);
        this.totalItems.set(response.pagination.totalItems);
        this.hasNextPage.set(response.pagination.hasNextPage);
        this.hasPreviousPage.set(response.pagination.hasPreviousPage);
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  imageUrl(path: string) {
    return this.memeService.getImageUrl(path);
  }
}
