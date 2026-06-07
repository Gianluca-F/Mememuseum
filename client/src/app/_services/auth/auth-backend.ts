import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthBackendService {
  private readonly API_URL = 'http://localhost:3000';
  private readonly BASE_PATH = '/auth';

  constructor(
    private http: HttpClient
  ) { }

  login(userName: string, password: string) {
    return this.http.post<{ token: string }>(`${this.API_URL}${this.BASE_PATH}/login`, { userName, password });
  }

  signup(userName: string, password: string) {
    return this.http.post<{ token: string }>(`${this.API_URL}${this.BASE_PATH}/signup`, { userName, password });
  }

}
