import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import { MemeList, MemeDetail, PaginatedResponse, Comment } from '../../_models/api.models';

@Injectable({
  providedIn: 'root'
})
export class MemeService {
  private api = inject(ApiService);

  memes = signal<MemeList[]>([]);
  isLoading = signal(false);

  getAllMemes(page: number = 1, limit: number = 10) {
    return this.api.get<PaginatedResponse<MemeList>>(`/memes?page=${page}&limit=${limit}`);
  }

  getMemeById(id: string) {
    return this.api.get<MemeDetail>(`/memes/${id}`);
  }

  createMeme(meme: Partial<MemeList>) {
    return this.api.post<MemeList>('/memes', meme);
  }

  updateMeme(id: string, updates: Partial<MemeList>) {
    return this.api.put<MemeList>(`/memes/${id}`, updates);
  }

  deleteMeme(id: string) {
    return this.api.delete(`/memes/${id}`);
  }

  voteMeme(memeId: string, voteType: 'up' | 'down') {
    return this.api.post(`/memes/${memeId}/vote`, { voteType });
  }

  getComments(memeId: string) {
    return this.api.get<Comment[]>(`/memes/${memeId}/comments`);
  }

  addComment(memeId: string, content: string) {
    return this.api.post<Comment>(`/memes/${memeId}/comments`, { content });
  }

  deleteComment(memeId: string, commentId: string) {
    return this.api.delete(`/memes/${memeId}/comments/${commentId}`);
  }
}
