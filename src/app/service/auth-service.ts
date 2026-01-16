import { Injectable } from '@angular/core';
import { CookieHelper } from '../helper/cookie-helper';
import { ApiHelper } from '../helper/api-helper';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequest } from '../dto/request/login-request';
import { AuthResponse } from '../dto/responce/auth-response';
import { RegisterRequest } from '../dto/request/register-request';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiHelper {
  public isLoading$ = this.isLoading.asObservable();

  isAuthenticated(): boolean {
    const token = this.cookieHelper.get('access_token');
    return token !== null && token !== '' && !this.isTokenExpired(token);
  }

  getRole(): string | null {
    const token = this.cookieHelper.get('access_token');
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded ? decoded.role : null;
  }

  isTokenExpired(token: string): boolean {
     const decoded = this.decodeToken(token);
     if (!decoded || !decoded.exp) return true;
     return (Math.floor((new Date).getTime() / 1000)) >= decoded.exp;
  }
  
  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  constructor(http: HttpClient, private cookieHelper: CookieHelper, private router: Router) {
    super(http);
  }

  redirectUser() {
    const role = this.getRole();
    switch (role) {
      case 'CLIENT':
        this.router.navigate(['/client/dashboard']);
        break;
      case 'AGENT_BANCAIRE':
        this.router.navigate(['/agent/dashboard']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      default:
        this.router.navigate(['/']); 
    }
  }

  login(payload: LoginRequest) {
    this.handleRequest(
      this.http.post<AuthResponse>(`${this.api}/v1/auth/authenticate`, payload),
      (res) => {
        this.cookieHelper.set('access_token', res.access_token, 1);
        this.cookieHelper.set('refresh_token', res.refresh_token, 7);
        this.redirectUser();
      }
    );
  }
  register(payload: RegisterRequest) {
    this.handleRequest(
      this.http.post<AuthResponse>(`${this.api}/v1/auth/register`, payload),
      (res) => {
        this.cookieHelper.set('access_token', res.access_token, 1);
        this.cookieHelper.set('refresh_token', res.refresh_token, 7);
        this.redirectUser();
      }
    );
  }
  refreshToken(): Observable<string> {
    const refreshToken = this.cookieHelper.get('refresh_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${refreshToken}`,
    });

    return this.http
      .post<AuthResponse>(`${this.api}/v1/auth/refresh-token`, null, { headers })
      .pipe(
        tap((res) => {
          this.cookieHelper.set('access_token', res.access_token, 1);
          this.cookieHelper.set('refresh_token', res.refresh_token, 7);
        }),
        map((res) => res.access_token)
      );
  }

  logout() {
    this.cookieHelper.destroy('refresh_token');
    this.cookieHelper.destroy('access_token');
  }
}
