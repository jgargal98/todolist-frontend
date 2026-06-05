import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { Logout, RefreshToken } from '../../store/auth/auth.actions';
import { AuthState } from '../../store/auth/auth.state';

let isRefreshing = false;
let refreshSubject: BehaviorSubject<string | null> | null = null;

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const store = inject(Store);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      const accessToken = store.selectSnapshot(AuthState.accessToken);
      const refreshToken = store.selectSnapshot(
        (s) => (s as { auth: { refreshToken: string | null } }).auth
          .refreshToken,
      );

      if (!accessToken || !refreshToken) {
        store.dispatch(new Logout());
        return throwError(() => error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshSubject = new BehaviorSubject<string | null>(null);

        store
          .dispatch(new RefreshToken({ accessToken, refreshToken }))
          .pipe(
            catchError(() => {
              refreshSubject!.next(null);
              refreshSubject!.complete();
              return throwError(() => error);
            }),
          )
          .subscribe({
            next: () => {
              const newToken = store.selectSnapshot(AuthState.accessToken);
              refreshSubject!.next(newToken);
              refreshSubject!.complete();
            },
            error: () => {
              refreshSubject!.next(null);
              refreshSubject!.complete();
            },
            complete: () => {
              isRefreshing = false;
            },
          });
      }

      return refreshSubject!.pipe(
        filter((token): token is string => token !== null),
        take(1),
        switchMap((token) =>
          next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            }),
          ),
        ),
      );
    }),
  );
};
