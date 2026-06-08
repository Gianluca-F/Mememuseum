import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MemeService } from '../_services/meme/meme.service';
import { AuthService } from '../_services/auth/auth';
import { MemeDetail } from '../_models/api.models';

@Component({
  selector: 'app-meme',
  standalone: true,
  imports: [RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './meme.html',
  styleUrls: ['./meme.scss']
})
export class MemeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private memeService = inject(MemeService);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  meme = signal<MemeDetail | null>(null);
  isLoading = signal(true);
  loadError = signal(false);
  isVoting = signal(false);
  isCommenting = signal(false);
  submitted = false;

  commentForm = new FormGroup({
    content: new FormControl('', [Validators.required, Validators.maxLength(500)])
  });

  ngOnInit() {
    this.loadMeme();
  }

  imageUrl(path: string) {
    return this.memeService.getImageUrl(path);
  }

  vote(type: 'upvote' | 'downvote') {
    const meme = this.meme();
    if (!meme || this.isVoting()) {
      return;
    }
    if (!this.authService.isUserAuthenticated()) {
      this.toastr.warning('Effettua il login per votare questo meme', 'Accesso richiesto');
      return;
    }

    this.isVoting.set(true);
    this.memeService.voteMeme(meme.id, type).subscribe({
      next: ({ meme: updated }) => {
        this.meme.set({ ...meme, upvotes: updated.upvotes, downvotes: updated.downvotes });
        this.isVoting.set(false);
      },
      error: () => {
        this.toastr.error('Non è stato possibile registrare il voto', 'Oops!');
        this.isVoting.set(false);
      }
    });
  }

  submitComment() {
    this.submitted = true;
    const meme = this.meme();
    if (!meme || this.commentForm.invalid || this.isCommenting()) {
      return;
    }

    const content = this.commentForm.value.content as string;
    this.isCommenting.set(true);
    this.memeService.addComment(meme.id, content).subscribe({
      next: () => {
        this.commentForm.reset();
        this.submitted = false;
        this.isCommenting.set(false);
        this.toastr.success('Il tuo commento è stato pubblicato', 'Fatto!');
        this.loadMeme();
      },
      error: () => {
        this.isCommenting.set(false);
        this.toastr.error('Non è stato possibile pubblicare il commento', 'Oops!');
      }
    });
  }

  private loadMeme() {
    this.isLoading.set(true);
    this.loadError.set(false);

    const id = this.route.snapshot.paramMap.get('id');
    const request = id ? this.memeService.getMemeById(id) : this.memeService.getMemeOfTheDay();

    request.subscribe({
      next: (meme) => {
        this.meme.set(meme);
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.isLoading.set(false);
      }
    });
  }
}
