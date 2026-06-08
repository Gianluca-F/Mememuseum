import { Injectable, signal } from '@angular/core';
import { MemeList, MemeDetail, PaginatedResponse, Comment } from '../../_models/api.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MemeService {
  private readonly API_URL = 'http://localhost:3000';
  private readonly BASE_PATH = '/memes';

  constructor(
    private http: HttpClient
  ) { }

  memes = signal<MemeList[]>([]);
  isLoading = signal(false);

  getAllMemes(page: number = 1, limit: number = 10) {
    return this.http.get<PaginatedResponse<MemeList>>(`${this.API_URL}${this.BASE_PATH}?page=${page}&limit=${limit}`);
  }

  getMemeOfTheDay() {
    return this.http.get<MemeDetail>(`${this.API_URL}${this.BASE_PATH}/meme-of-the-day`);
  }

  getMemeById(id: string) {
    return this.http.get<MemeDetail>(`${this.API_URL}${this.BASE_PATH}/${id}`);
  }

  createMeme(meme: FormData) {
    return this.http.post<MemeDetail>(`${this.API_URL}${this.BASE_PATH}`, meme);
  }

  updateMeme(id: string, updates: FormData) {
    return this.http.put<MemeDetail>(`${this.API_URL}${this.BASE_PATH}/${id}`, updates);
  }

  deleteMeme(id: string) {
    return this.http.delete(`${this.API_URL}${this.BASE_PATH}/${id}`);
  }

  voteMeme(memeId: string, type: 'upvote' | 'downvote') {
    return this.http.post<{ meme: MemeDetail }>(`${this.API_URL}${this.BASE_PATH}/${memeId}/vote`, { type });
  }

  addComment(memeId: string, content: string) {
    return this.http.post<{ comment: Comment, message: string }>(`${this.API_URL}${this.BASE_PATH}/${memeId}/comments`, { content });
  }

  deleteComment(memeId: string, commentId: string) {
    return this.http.delete(`${this.API_URL}${this.BASE_PATH}/${memeId}/comments/${commentId}`);
  }

  getImageUrl(imageUrl: string) {
    return `${this.API_URL}/${imageUrl}`;
  }
}
