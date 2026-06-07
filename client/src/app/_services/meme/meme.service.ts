import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import { MemeList, MemeDetail, PaginatedResponse, Comment } from '../../_models/api.models';

@Injectable({
  providedIn: 'root'
})
export class MemeService {
  private api = inject(ApiService);

  private readonly BASE_PATH = '/memes';

  memes = signal<MemeList[]>([]);
  isLoading = signal(false);

  getAllMemes(page: number = 1, limit: number = 10) {
    return this.api.get<PaginatedResponse<MemeList>>(`${this.BASE_PATH}?page=${page}&limit=${limit}`);
  }

  getMemeById(id: string) {
    return this.api.get<MemeDetail>(`${this.BASE_PATH}/${id}`);
  }

  createMeme(meme: Partial<MemeList>) {
    return this.api.post<MemeList>(`${this.BASE_PATH}`, meme);
  }

  updateMeme(id: string, updates: Partial<MemeList>) {
    return this.api.put<MemeList>(`${this.BASE_PATH}/${id}`, updates);
  }

  deleteMeme(id: string) {
    return this.api.delete(`${this.BASE_PATH}/${id}`);
  }

  voteMeme(memeId: string, voteType: 'up' | 'down') {
    return this.api.post(`${this.BASE_PATH}/${memeId}/vote`, { voteType });
  }

  getComments(memeId: string) {
    return this.api.get<Comment[]>(`${this.BASE_PATH}/${memeId}/comments`);
  }

  addComment(memeId: string, content: string) {
    return this.api.post<Comment>(`${this.BASE_PATH}/${memeId}/comments`, { content });
  }

  deleteComment(memeId: string, commentId: string) {
    return this.api.delete(`${this.BASE_PATH}/${memeId}/comments/${commentId}`);
  }
}
