import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MemeService } from '../_services/meme/meme.service';
import { AuthService } from '../_services/auth/auth';
import { MemeDetail } from '../_models/api.models';

@Component({
  selector: 'app-meme',
  standalone: true,
  imports: [RouterLink, DatePipe, NgClass, ReactiveFormsModule],
  templateUrl: './meme.html',
  styleUrls: ['./meme.scss']
})
export class MemeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memeService = inject(MemeService);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  meme = signal<MemeDetail | null>(null);
  isLoading = signal(true);
  loadError = signal(false);
  isVoting = signal(false);
  isCommenting = signal(false);
  isConfirmingDelete = signal(false);
  isDeleting = signal(false);
  confirmingDeleteCommentId = signal<string | null>(null);
  deletingCommentId = signal<string | null>(null);
  submitted = false;

  isOwner = computed(() => {
    const meme = this.meme();
    const userId = this.authService.userId();
    if (!meme || !userId) return false;
    return meme.user.id === userId;
  });

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
      this.toastr.warning('Log in to vote for this meme', 'Login required');
      return;
    }

    this.isVoting.set(true);
    this.memeService.voteMeme(meme.id, type).subscribe({
      next: ({ meme: updated }) => {
        this.meme.set({ ...meme, upvotes: updated.upvotes, downvotes: updated.downvotes, userVote: updated.userVote });
        this.isVoting.set(false);
      },
      error: () => {
        this.toastr.error('Could not register your vote', 'Oops!');
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
        this.toastr.success('Your comment has been posted', 'Done!');
        this.loadMeme();
      },
      error: () => {
        this.isCommenting.set(false);
        this.toastr.error('Could not post your comment', 'Oops!');
      }
    });
  }

  onCommentEnterKey(event: Event) {
    event.preventDefault();
    this.submitComment();
  }

  // Opening one delete confirmation cancels the other, so only one is pending at a time
  startConfirmingMemeDelete() {
    this.confirmingDeleteCommentId.set(null);
    this.isConfirmingDelete.set(true);
  }

  startConfirmingCommentDelete(commentId: string) {
    this.isConfirmingDelete.set(false);
    this.confirmingDeleteCommentId.set(commentId);
  }

  isCommentOwner(userId: string) {
    return this.authService.isUserAuthenticated() && userId === this.authService.userId();
  }

  deleteComment(commentId: string) {
    const meme = this.meme();
    if (!meme || this.deletingCommentId()) return;

    this.deletingCommentId.set(commentId);
    this.memeService.deleteComment(meme.id, commentId).subscribe({
      next: () => {
        this.deletingCommentId.set(null);
        this.confirmingDeleteCommentId.set(null);
        this.toastr.success('The comment has been deleted', 'Done!');
        this.loadMeme();
      },
      error: () => {
        this.deletingCommentId.set(null);
        this.confirmingDeleteCommentId.set(null);
        this.toastr.error('Could not delete the comment', 'Oops!');
      }
    });
  }

  deleteMeme() {
    const meme = this.meme();
    if (!meme || this.isDeleting()) return;

    this.isDeleting.set(true);
    this.memeService.deleteMeme(meme.id).subscribe({
      next: () => {
        this.toastr.success('The meme has been deleted', 'Done!');
        this.router.navigate(['/home']);
      },
      error: () => {
        this.isDeleting.set(false);
        this.isConfirmingDelete.set(false);
        this.toastr.error('Could not delete the meme', 'Oops!');
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
