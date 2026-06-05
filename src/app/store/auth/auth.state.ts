import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, Observable, switchMap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import type { AuthResponse, UserResponseDto } from '../../shared/models/dto';
import {
  Login,
  LoginFailure,
  LoginSuccess,
  Logout,
  RefreshToken,
  RefreshTokenFailure,
  RefreshTokenSuccess,
  Register,
  RegisterFailure,
  RegisterSuccess,
} from './auth.actions';

export interface AuthStateModel {
  user: UserResponseDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const defaults: AuthStateModel = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

function toAuthModel(payload: AuthResponse): Partial<AuthStateModel> {
  return {
    user: null,
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    isAuthenticated: true,
    loading: false,
    error: null,
  };
}

@State<AuthStateModel>({
  name: 'auth',
  defaults,
})
@Injectable()
export class AuthState {
  constructor(private readonly authService: AuthService) {}

  @Selector()
  static user(state: AuthStateModel): UserResponseDto | null {
    return state.user;
  }

  @Selector()
  static accessToken(state: AuthStateModel): string | null {
    return state.accessToken;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Selector()
  static loading(state: AuthStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: AuthStateModel): string | null {
    return state.error;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login): Observable<unknown> {
    ctx.patchState({ loading: true, error: null });
    return this.authService.login(action.payload).pipe(
      switchMap((response) => ctx.dispatch(new LoginSuccess(response))),
      catchError((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Login failed';
        return ctx.dispatch(new LoginFailure({ error: message }));
      }),
    );
  }

  @Action(LoginSuccess)
  loginSuccess(ctx: StateContext<AuthStateModel>, action: LoginSuccess): void {
    ctx.patchState(toAuthModel(action.payload));
  }

  @Action(LoginFailure)
  loginFailure(ctx: StateContext<AuthStateModel>, action: LoginFailure): void {
    ctx.patchState({ loading: false, error: action.payload.error });
  }

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, action: Register): Observable<unknown> {
    ctx.patchState({ loading: true, error: null });
    return this.authService.register(action.payload).pipe(
      switchMap((response) => ctx.dispatch(new RegisterSuccess(response))),
      catchError((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Registration failed';
        return ctx.dispatch(new RegisterFailure({ error: message }));
      }),
    );
  }

  @Action(RegisterSuccess)
  registerSuccess(ctx: StateContext<AuthStateModel>, action: RegisterSuccess): void {
    ctx.patchState(toAuthModel(action.payload));
  }

  @Action(RegisterFailure)
  registerFailure(ctx: StateContext<AuthStateModel>, action: RegisterFailure): void {
    ctx.patchState({ loading: false, error: action.payload.error });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>): void {
    ctx.setState(defaults);
  }

  @Action(RefreshToken)
  refreshToken(ctx: StateContext<AuthStateModel>, action: RefreshToken): Observable<unknown> {
    ctx.patchState({ loading: true });
    return this.authService.refreshToken(action.payload).pipe(
      switchMap((response) => ctx.dispatch(new RefreshTokenSuccess(response))),
      catchError(() => ctx.dispatch(new RefreshTokenFailure())),
    );
  }

  @Action(RefreshTokenSuccess)
  refreshTokenSuccess(ctx: StateContext<AuthStateModel>, action: RefreshTokenSuccess): void {
    ctx.patchState(toAuthModel(action.payload));
  }

  @Action(RefreshTokenFailure)
  refreshTokenFailure(ctx: StateContext<AuthStateModel>): void {
    ctx.setState(defaults);
  }
}
