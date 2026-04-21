import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface LoginPayload   { username: string; password: string; }
export interface RegisterPayload { username: string; email: string; password: string; role: 'user' | 'admin'; }
export interface AuthResponse   { access: string; refresh?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://127.0.0.1:8000/api';
  constructor(private http: HttpClient, private router: Router) {}

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/auth/login/`, payload).pipe(
      tap(res => this.saveTokens(res))
    );
  }

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.API}/auth/register/`, payload);
  }

  logout(): void {
    const refresh = this.getRefreshToken();
    if (refresh) {
      this.http.post(`${this.API}/auth/logout/`, { refresh }).subscribe({
        complete: () => this.clearSession(),
        error: () => this.clearSession(),
      });
      return;
    }
    this.clearSession();
  }

  refreshToken(): Observable<AuthResponse> {
    const refresh = this.getRefreshToken();
    return this.http.post<AuthResponse>(`${this.API}/auth/token/refresh/`, { refresh }).pipe(
      tap(res => this.saveTokens({ access: res.access, refresh: res.refresh ?? refresh ?? '' }))
    );
  }

  private saveTokens(res: AuthResponse): void {
    localStorage.setItem('access_token', res.access);
    if (res.refresh) {
      localStorage.setItem('refresh_token', res.refresh);
    }
    const payload = JSON.parse(atob(res.access.split('.')[1]));
    localStorage.setItem('role', payload.role ?? 'user');
    localStorage.setItem('username', payload.username ?? '');
  }

  getToken(): string | null     { return localStorage.getItem('access_token'); }
  getRefreshToken(): string | null { return localStorage.getItem('refresh_token'); }
  getRole(): string | null      { return localStorage.getItem('role'); }
  getUsername(): string | null  { return localStorage.getItem('username'); }
  isLoggedIn(): boolean         { return !!this.getToken(); }
  isAdmin(): boolean            { return this.getRole() === 'admin'; }

  private clearSession(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}