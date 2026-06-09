import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MemeService } from '../_services/meme/meme.service';

@Component({
  selector: 'app-upload-meme',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './upload-meme.html',
  styleUrls: ['./upload-meme.scss']
})
export class UploadMemeComponent {
  private memeService = inject(MemeService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  submitted = false;
  isSubmitting = signal(false);
  imagePreview = signal<string | null>(null);
  private selectedFile: File | null = null;

  uploadForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    description: new FormControl('', [Validators.maxLength(1000)]),
    tags: new FormControl('')
  });

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

  handleUpload() {
    this.submitted = true;
    if (this.uploadForm.invalid || !this.selectedFile) {
      this.toastr.error('Compila tutti i campi obbligatori e seleziona un\'immagine', 'Dati mancanti');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.uploadForm.value.title as string);
    formData.append('description', this.uploadForm.value.description as string);
    formData.append('tags', this.uploadForm.value.tags as string);
    formData.append('image', this.selectedFile);

    this.isSubmitting.set(true);
    this.memeService.createMeme(formData).subscribe({
      next: (meme) => {
        this.toastr.success('Il tuo meme è stato pubblicato!', 'Fatto!');
        this.router.navigate(['/meme', meme.id]);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 400) {
          this.toastr.error('Controlla i dati inseriti e riprova', 'Richiesta non valida');
          return;
        }
        this.toastr.error('Si è verificato un errore imprevisto (' + err.status + ')', 'Oops!');
      }
    });
  }
}
