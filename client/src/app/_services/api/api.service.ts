import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  get<T>(endpoint: string) {
    return this.http.get<T>(`${this.API_URL}${endpoint}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  post<T>(endpoint: string, body: any = {}) {
    return this.http.post<T>(`${this.API_URL}${endpoint}`, body).pipe(
      catchError(error => this.handleError(error))
    );
  }

  put<T>(endpoint: string, body: any = {}) {
    return this.http.put<T>(`${this.API_URL}${endpoint}`, body).pipe(
      catchError(error => this.handleError(error))
    );
  }

  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.API_URL}${endpoint}`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Status: ${error.status}`;
    }

    this.toastr.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
