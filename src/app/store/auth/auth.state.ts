import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import type { UserResponseDto } from '../../shared/models/dto';

export interface AuthStateModel {
  user: UserResponseDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  },
})
@Injectable()
export class AuthState {}
