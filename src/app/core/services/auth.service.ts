import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  role: 'admin' | 'vendedor' | 'cliente';
  is_verified: boolean;
  must_change_password?: boolean;
  bio?: string;
  years_experience?: number;
  rating?: number;
  rating_count?: number;
}

interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'arkak_token';
  private currentUser$ = new BehaviorSubject<User | null>(null);

  user$ = this.currentUser$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromToken();
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          this.fetchMe();
        } else {
          this.logout();
        }
      } catch {
        this.logout();
      }
    }
  }

  private fetchMe(): void {
    this.http.get<User>(`${this.API}/me`).subscribe({
      next: (user) => this.currentUser$.next(user),
      error: () => this.logout(),
    });
  }

  register(data: { email: string; password: string; first_name: string; last_name: string; phone?: string; role?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/register`, data).pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.currentUser$.next(res.user);
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.currentUser$.next(res.user);
      })
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API}/reset-password/${token}`, { password });
  }

  verifyAccount(token: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API}/verify/${token}`, {});
  }

  changePassword(current_password: string, new_password: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.API}/change-password`, { current_password, new_password });
  }

  updateProfile(data: FormData | Record<string, any>): Observable<User> {
    return this.http.put<User>(`${this.API}/profile`, data).pipe(
      tap((user) => this.currentUser$.next(user))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    return !!this.getToken();
  }

  get currentUser(): User | null {
    return this.currentUser$.value;
  }

  get userRole(): string | null {
    return this.currentUser?.role ?? null;
  }

  getRedirectUrl(): string {
    switch (this.currentUser?.role) {
      case 'admin': return '/admin/dashboard';
      case 'vendedor': return '/vendedor/dashboard';
      case 'cliente': return '/cliente/buscar';
      default: return '/';
    }
  }
}
