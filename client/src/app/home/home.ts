import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MemeService } from '../_services/meme/meme.service';
import { AuthService } from '../_services/auth/auth';
import { MemeDetail } from '../_models/api.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  private memeService = inject(MemeService);
  authService = inject(AuthService);

  memeOfTheDay = signal<MemeDetail | null>(null);
  isLoading = signal(true);
  loadError = signal(false);

  ngOnInit() {
    this.memeService.getMemeOfTheDay().subscribe({
      next: (meme) => {
        this.memeOfTheDay.set(meme);
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
