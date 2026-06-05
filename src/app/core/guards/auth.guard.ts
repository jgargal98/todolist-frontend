import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../store/auth/auth.state';

export const authGuard: CanActivateFn = () => {
  const isAuthenticated = inject(Store).selectSnapshot(
    AuthState.isAuthenticated,
  );

  if (isAuthenticated) {
    return true;
  }

  return inject(Router).createUrlTree(['/login']);
};
