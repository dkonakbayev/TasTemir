import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  const isAuthEndpoint = req.url.includes('/auth/login/') || req.url.includes('/auth/token/refresh/');

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isAuthEndpoint || error.status !== 401 || !auth.getRefreshToken()) {
        return throwError(() => error);
      }

      return auth.refreshToken().pipe(
        switchMap((tokens) => {
          const retried = req.clone({
            setHeaders: { Authorization: `Bearer ${tokens.access}` }
          });
          return next(retried);
        }),
        catchError((refreshError) => {
          auth.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};