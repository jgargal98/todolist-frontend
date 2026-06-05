import type { AuthResponse, LoginRequest, RefreshRequest, RegisterRequest } from '../../shared/models/dto';

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public readonly payload: LoginRequest) {}
}

export class LoginSuccess {
  static readonly type = '[Auth] Login Success';
  constructor(public readonly payload: AuthResponse) {}
}

export class LoginFailure {
  static readonly type = '[Auth] Login Failure';
  constructor(public readonly payload: { error: string }) {}
}

export class Register {
  static readonly type = '[Auth] Register';
  constructor(public readonly payload: RegisterRequest) {}
}

export class RegisterSuccess {
  static readonly type = '[Auth] Register Success';
  constructor(public readonly payload: AuthResponse) {}
}

export class RegisterFailure {
  static readonly type = '[Auth] Register Failure';
  constructor(public readonly payload: { error: string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class RefreshToken {
  static readonly type = '[Auth] Refresh Token';
  constructor(public readonly payload: RefreshRequest) {}
}

export class RefreshTokenSuccess {
  static readonly type = '[Auth] Refresh Token Success';
  constructor(public readonly payload: AuthResponse) {}
}

export class RefreshTokenFailure {
  static readonly type = '[Auth] Refresh Token Failure';
}
