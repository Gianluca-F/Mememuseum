import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MemeService } from '../_services/meme/meme.service';
import { AuthService } from '../_services/auth/auth';
import { tagsValidator } from '../_validators/tags.validator';

@Component({
  selector: 'app-edit-meme',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-meme.html',
  styleUrls: ['./edit-meme.scss']
})
export class EditMemeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memeService = inject(MemeService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  submitted = false;
  isLoading = signal(true);
  loadError = signal(false);
  isSubmitting = signal(false);
  imagePreview = signal<string | null>(null);
  currentImageUrl = signal<string | null>(null);
  memeId = '';
  private selectedFile: File | null = null;

  editForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    description: new FormControl('', [Validators.maxLength(1000)]),
    tags: new FormControl('', [tagsValidator])
  });

  ngOnInit() {
    this.memeId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.memeId) {
      this.router.navigate(['/home']);
      return;
    }

    this.memeService.getMemeById(this.memeId).subscribe({
      next: (meme) => {
        if (meme.user.id !== this.authService.userId()) {
          this.toastr.error('You are not allowed to edit this meme', 'Access denied');
          this.router.navigate(['/meme', this.memeId]);
          return;
        }
        this.editForm.patchValue({
          title: meme.title,
          description: meme.description ?? '',
          tags: meme.tags?.join(', ') ?? ''
        });
        this.currentImageUrl.set(this.memeService.getImageUrl(meme.imageUrl));
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.imagePreview.set(null);
    }
  }

  handleEdit() {
    this.submitted = true;
    if (this.editForm.invalid) {
      this.toastr.error('Check the required fields', 'Missing data');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.editForm.value.title as string);
    formData.append('description', this.editForm.value.description ?? '');
    formData.append('tags', this.editForm.value.tags as string);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.isSubmitting.set(true);
    this.memeService.updateMeme(this.memeId, formData).subscribe({
      next: () => {
        this.toastr.success('The meme has been updated!', 'Done!');
        this.router.navigate(['/meme', this.memeId]);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 400) {
          this.toastr.error('Check the data you entered and try again', 'Invalid request');
          return;
        }
        if (err.status === 403) {
          this.toastr.error('You are not allowed to edit this meme', 'Access denied');
          return;
        }
        this.toastr.error('An unexpected error occurred (' + err.status + ')', 'Oops!');
      }
    });
  }
}
