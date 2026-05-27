import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { delay, Observable, of, tap } from 'rxjs';
import { Login, Logout, Register } from './auth.actions';

/** Shape of the authentication slice in the global store. */
export interface AuthStateModel {
  /** JWT token returned after a successful login / registration. */
  token: string | null;
  /** Whether an auth request is currently in flight. */
  loading: boolean;
  /** Human-readable error message when the last request failed. */
  error: string | null;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: localStorage.getItem('auth_token'),
    loading: false,
    error: null,
  },
})
@Injectable()
export class AuthState {
  /** Simulated async login — stores a fake token on success. */
  @Action(Login)
  login(
    ctx: StateContext<AuthStateModel>,
    _action: Login,
  ): Observable<void> {
    ctx.patchState({ loading: true, error: null });
    return of(undefined).pipe(
      delay(1500), // TODO: Remove delay — temporarily simulates network latency
      tap(() => {
        const token = 'mock-jwt-token';
        localStorage.setItem('auth_token', token);
        ctx.patchState({ token, loading: false });
      }),
    );
  }

  /** Simulated async registration — stores a fake token on success. */
  @Action(Register)
  register(
    ctx: StateContext<AuthStateModel>,
    _action: Register,
  ): Observable<void> {
    ctx.patchState({ loading: true, error: null });
    return of(undefined).pipe(
      delay(1500), // TODO: Remove delay — temporarily simulates network latency
      tap(() => {
        const token = 'mock-jwt-register-token';
        localStorage.setItem('auth_token', token);
        ctx.patchState({ token, loading: false });
      }),
    );
  }

  /** Clears the token from both memory and localStorage. */
  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>): void {
    localStorage.removeItem('auth_token');
    ctx.setState({ token: null, loading: false, error: null });
  }

  // ── Selectors ──────────────────────────────────────────────

  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  @Selector()
  static loading(state: AuthStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: AuthStateModel): string | null {
    return state.error;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.token !== null;
  }
}
