import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

interface LoginResponse {
  message: string;
  role?: string;
  user?: any;   // backend returns full_name, address
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:5000/api/users';

  constructor(private http: HttpClient) {}

  // -----------------------------------
  // LOGIN FUNCTIONS
  // -----------------------------------
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(catchError(this.handleError));
  }

  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, data)
      .pipe(catchError(this.handleError));
  }

  adminLogin(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/admin/login`, { email, password })
      .pipe(catchError(this.handleError));
  }

  // -----------------------------------
  // SESSION MANAGEMENT (Required for guards)
  // -----------------------------------

  // Save logged-in user to localStorage
  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get current user
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  // Logout user
  logout() {
    localStorage.removeItem('user');
  }

  // -----------------------------------
  // ERROR HANDLER
  // -----------------------------------
  private handleError(error: any) {
    let errorMsg = 'An unknown error occurred';

    if (error instanceof HttpErrorResponse) {
      if (error.error?.error) errorMsg = error.error.error;
      else if (error.error?.message) errorMsg = error.error.message;
      else errorMsg = `Server returned code ${error.status}`;
    } else if (error?.message) {
      errorMsg = error.message;
    }

    return throwError(() => new Error(errorMsg));
  }
}
