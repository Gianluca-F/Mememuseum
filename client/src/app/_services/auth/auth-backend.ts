import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthBackendService {
  private api = inject(ApiService);

  private readonly BASE_PATH = '/auth';

  login(userName: string, password: string) {
    return this.api.post<{ token: string }>(`${this.BASE_PATH}/login`, { userName, password });
  }

  signup(userName: string, password: string) {
    return this.api.post<{ token: string }>(`${this.BASE_PATH}/signup`, { userName, password });
  }

}
