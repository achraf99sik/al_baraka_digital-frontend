import { Injectable } from '@angular/core';
import { CookieHelper } from '../helper/cookie-helper';
import { ApiHelper } from '../helper/api-helper';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../dto/request/login-request';
import { AuthResponse } from '../dto/responce/auth-response';
import { BehaviorSubject } from 'rxjs';

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
    return this.handleRequest(
      this.http.post<AuthResponse>(`${this.api}/v1/auth/authenticate`, payload),
      (res) => {
        this.cookieHelper.set('access_token', res.access_token, 1);
        this.cookieHelper.set('refresh_token', res.refresh_token, 7);
      }
    );
  }
}
