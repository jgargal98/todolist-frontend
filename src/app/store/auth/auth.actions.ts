/** Payload for Login and Register actions carrying form credentials. */
export interface AuthCredentials {
  email: string;
  password: string;
}

/** Dispatched when the user submits the login form. */
export class Login {
  static readonly type = '[Auth] Login';
  constructor(public readonly payload: AuthCredentials) {}
}

/** Dispatched when the user submits the registration form. */
export class Register {
  static readonly type = '[Auth] Register';
  constructor(public readonly payload: AuthCredentials) {}
}

/** Dispatched when the user explicitly signs out. */
export class Logout {
  static readonly type = '[Auth] Logout';
}
