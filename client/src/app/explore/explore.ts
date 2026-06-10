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
    sortedBy: 'createdAt',
    sortDirection: 'DESC',
  };

  readonly sortedByOptions = [
    { value: 'createdAt',     label: 'Data' },
    { value: 'upvotes',       label: 'Upvote' },
    { value: 'downvotes',     label: 'Downvote' },
    { value: 'commentsCount', label: 'Commenti' },
  ];

  readonly sortDirectionOptions = [
    { value: 'DESC', label: 'Decrescente' },
    { value: 'ASC',  label: 'Crescente' },
  ];

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.form.title = params.get('title') ?? '';
      this.form.tags = params.get('tags') ?? '';
      this.form.match = params.get('match') === 'all' ? 'all' : 'any';

      const sortedByParam = params.get('sortedBy');
      this.form.sortedBy = this.sortedByOptions.some(opt => opt.value === sortedByParam)
        ? sortedByParam as SearchForm['sortedBy'] 
        : 'createdAt';
        
      this.form.sortDirection = params.get('sortDirection') === 'ASC' ? 'ASC' : 'DESC';

      const page = Math.max(1, Number(params.get('page')) || 1);
      this.fetchPage(page);
    });
  }

  search() {
    this.loadPage(1);
  }

  reset() {
    this.form = { title: '', tags: '', match: 'any', sortedBy: 'createdAt', sortDirection: 'DESC' };
  }

  loadPage(page: number) {
    this.router.navigate([], {
      queryParams: {
        page: page > 1 ? page : null,
        title: this.form.title.trim() || null,
        tags: this.form.tags.trim() || null,
        match: this.form.tags.trim() && this.form.match !== 'any' ? this.form.match : null,
        sortedBy: this.form.sortedBy !== 'createdAt' ? this.form.sortedBy : null,
        sortDirection: this.form.sortDirection !== 'DESC' ? this.form.sortDirection : null,
      },
      replaceUrl: true,
    });
  }

  private fetchPage(page: number) {
    this.isLoading.set(true);
    this.loadError.set(false);

    const query: MemeQueryParams = { page, sortedBy: this.form.sortedBy, sortDirection: this.form.sortDirection };
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
