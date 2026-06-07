import { Injectable, inject, signal } from '@angular/core';
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

  getMemeById(id: string) {
    return this.http.get<MemeDetail>(`${this.API_URL}${this.BASE_PATH}/${id}`);
  }

  createMeme(meme: Partial<MemeList>) {
    return this.http.post<MemeList>(`${this.API_URL}${this.BASE_PATH}`, meme);
  }

  updateMeme(id: string, updates: Partial<MemeList>) {
    return this.http.put<MemeList>(`${this.API_URL}${this.BASE_PATH}/${id}`, updates);
  }

  deleteMeme(id: string) {
    return this.http.delete(`${this.API_URL}${this.BASE_PATH}/${id}`);
  }

  voteMeme(memeId: string, voteType: 'up' | 'down') {
    return this.http.post(`${this.API_URL}${this.BASE_PATH}/${memeId}/vote`, { voteType });
  }

  getComments(memeId: string) {
    return this.http.get<Comment[]>(`${this.API_URL}${this.BASE_PATH}/${memeId}/comments`);
  }

  addComment(memeId: string, content: string) {
    return this.http.post<Comment>(`${this.API_URL}${this.BASE_PATH}/${memeId}/comments`, { content });
  }

  deleteComment(memeId: string, commentId: string) {
    return this.http.delete(`${this.API_URL}${this.BASE_PATH}/${memeId}/comments/${commentId}`);
  }
}
