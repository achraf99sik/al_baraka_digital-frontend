import { Injectable } from '@angular/core';
import { CookieHelper } from '../helper/cookie-helper';
import { ApiHelper } from '../helper/api-helper';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginRequest } from '../dto/request/login-request';
import { AuthResponse } from '../dto/responce/auth-response';
import { RegisterRequest } from '../dto/request/register-request';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiHelper {
  public isLoading$ = this.isLoading.asObservable();

  constructor(http: HttpClient, private cookieHelper: CookieHelper) {
    super(http);
  }

  isAuthenticated(): boolean {
    const token = this.cookieHelper.get('access_token');
    return token !== null && token !== '';
  }
  login(payload: LoginRequest) {
    this.handleRequest(
      this.http.post<AuthResponse>(`${this.api}/v1/auth/authenticate`, payload),
      (res) => {
        this.cookieHelper.set('access_token', res.access_token, 1);
        this.cookieHelper.set('refresh_token', res.refresh_token, 7);
      }
    );
  }
  register(payload: RegisterRequest) {
    this.handleRequest(
      this.http.post<AuthResponse>(`${this.api}/v1/auth/register`, payload),
      (res) => {
        this.cookieHelper.set('access_token', res.access_token, 1);
        this.cookieHelper.set('refresh_token', res.refresh_token, 7);
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
