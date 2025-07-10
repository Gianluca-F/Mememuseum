import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { AuthState } from './auth-state';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: WritableSignal<AuthState> = signal<AuthState>({
    userId: this.getUserId(),
    userName: this.getUserName(),
    token: this.getToken(), //get token from localStorage, if there
    isAuthenticated: this.verifyToken(this.getToken()) //verify it's not expired
  })

  userId = computed(() => this.authState().userId);
  userName = computed(() => this.authState().userName);
  token = computed(() => this.authState().token);
  isAuthenticated = computed(() => this.authState().isAuthenticated);

  constructor() {
    effect(() => {
      const { userId, userName, token } = this.authState();
      if (token !== null) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
      if (userId !== null) {
        localStorage.setItem("userId", userId);
      } else {
        localStorage.removeItem("userId");
      }
      if (userName !== null) {
        localStorage.setItem("userName", userName);
      } else {
        localStorage.removeItem("userName");
      }
    });
  }

  async updateToken(token: string) {
    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.userId;
    const userName = decodedToken.userName;
    this.authState.set({
      userId: userId,
      userName: userName,
      token: token,
      isAuthenticated: this.verifyToken(token)
    })
  }

  getUserId() {
    return localStorage.getItem("userId");
  }

  getUserName() {
    return localStorage.getItem("userName");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  verifyToken(token: string | null): boolean {
    if (token !== null) {
      try {
        const decodedToken = jwtDecode(token);
        const expiration = decodedToken.exp;
        if (expiration === undefined || Date.now() >= expiration * 1000) {
          return false; //expiration not available or in the past
        } else {
          return true; //token not expired
        }
      } catch (error) {  //invalid token
        return false;
      }
    }
    return false;
  }

  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getToken());
  }

  logout() {
    this.authState.set({
      userId: null,
      userName: null,
      token: null,
      isAuthenticated: false
    });
  }
}
