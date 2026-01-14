import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { CookieHelper } from '../helper/cookie-helper';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokens = inject(CookieHelper);
  const accessToken = tokens.get('access_token');

  const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh-token'];
  if (PUBLIC_ENDPOINTS.some((url) => req.url.includes(url))) {
    return next(req);
  }

  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((newToken: any) => {
            const token = newToken.access_token || newToken;

            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            });

            return next(retryReq);
          }),
          catchError((refreshErr) => {
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
