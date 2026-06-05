import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthState } from '../../store/auth/auth.state';

const SKIP_AUTH = ['/auth/login', '/auth/register', '/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (SKIP_AUTH.some((url) => req.url.includes(url))) {
    return next(req);
  }

  const token = inject(Store).selectSnapshot(AuthState.accessToken);

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }),
  );
};
