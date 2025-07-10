export interface AuthState {
  userId: string | null,
  userName: string | null,
  token: string | null,
  isAuthenticated: boolean
};