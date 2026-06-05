import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { AuthState, type AuthStateModel } from './auth.state';
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
import type { AuthResponse } from '../../shared/models/dto';

describe('AuthState', () => {
  let store: Store;

  function configureStore(): void {
    TestBed.configureTestingModule({
      providers: [provideStore([AuthState])],
    }).compileComponents();
    store = TestBed.inject(Store);
  }

  function snapshot(): AuthStateModel {
    return store.selectSnapshot<AuthStateModel>((state) => state.auth);
  }

  function authResponse(overrides?: Partial<AuthResponse>): AuthResponse {
    return {
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-456',
      email: 'test@example.com',
      ...overrides,
    };
  }

  beforeEach(() => {
    configureStore();
  });

  describe('initial state', () => {
    it('should have default values', () => {
      const state = snapshot();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('selectors', () => {
    it('AuthState.user should return null initially', () => {
      expect(AuthState.user(snapshot())).toBeNull();
    });

    it('AuthState.accessToken should return null initially', () => {
      expect(AuthState.accessToken(snapshot())).toBeNull();
    });

    it('AuthState.isAuthenticated should return false initially', () => {
      expect(AuthState.isAuthenticated(snapshot())).toBe(false);
    });

    it('AuthState.loading should return false initially', () => {
      expect(AuthState.loading(snapshot())).toBe(false);
    });

    it('AuthState.error should return null initially', () => {
      expect(AuthState.error(snapshot())).toBeNull();
    });
  });

  describe('Login', () => {
    it('should set loading to true', () => {
      store.dispatch(new Login({ email: 'a@b.com', password: 'secret' }));

      const state = snapshot();
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should clear previous error', () => {
      store.dispatch(new LoginFailure({ error: 'previous error' }));
      store.dispatch(new Login({ email: 'a@b.com', password: 'secret' }));

      expect(AuthState.error(snapshot())).toBeNull();
    });
  });

  describe('LoginSuccess', () => {
    it('should update tokens and set authenticated', () => {
      const response = authResponse();
      store.dispatch(new LoginSuccess(response));

      const state = snapshot();
      expect(state.accessToken).toBe('access-token-123');
      expect(state.refreshToken).toBe('refresh-token-456');
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle different token values', () => {
      const response = authResponse({ accessToken: 'abc', refreshToken: 'xyz' });
      store.dispatch(new LoginSuccess(response));

      expect(AuthState.accessToken(snapshot())).toBe('abc');
      expect(snapshot().refreshToken).toBe('xyz');
    });
  });

  describe('LoginFailure', () => {
    it('should set error and clear loading', () => {
      store.dispatch(new LoginFailure({ error: 'Invalid credentials' }));

      const state = snapshot();
      expect(state.error).toBe('Invalid credentials');
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle empty error message', () => {
      store.dispatch(new LoginFailure({ error: '' }));

      expect(AuthState.error(snapshot())).toBe('');
    });
  });

  describe('Register', () => {
    it('should set loading to true', () => {
      store.dispatch(
        new Register({
          email: 'a@b.com',
          password: 'Secret1',
          confirmPassword: 'Secret1',
        }),
      );

      expect(AuthState.loading(snapshot())).toBe(true);
    });
  });

  describe('RegisterSuccess', () => {
    it('should update tokens and set authenticated', () => {
      const response = authResponse();
      store.dispatch(new RegisterSuccess(response));

      const state = snapshot();
      expect(state.accessToken).toBe('access-token-123');
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
    });
  });

  describe('RegisterFailure', () => {
    it('should set error and clear loading', () => {
      store.dispatch(new RegisterFailure({ error: 'Email taken' }));

      const state = snapshot();
      expect(state.error).toBe('Email taken');
      expect(state.loading).toBe(false);
    });
  });

  describe('Logout', () => {
    it('should reset state to defaults', () => {
      store.dispatch(new LoginSuccess(authResponse()));
      expect(AuthState.isAuthenticated(snapshot())).toBe(true);

      store.dispatch(new Logout());

      const state = snapshot();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('RefreshToken', () => {
    it('should set loading to true', () => {
      store.dispatch(
        new RefreshToken({
          accessToken: 'old',
          refreshToken: 'old-refresh',
        }),
      );

      expect(AuthState.loading(snapshot())).toBe(true);
    });
  });

  describe('RefreshTokenSuccess', () => {
    it('should update tokens', () => {
      store.dispatch(new RefreshTokenSuccess(authResponse({ accessToken: 'new-token' })));

      const state = snapshot();
      expect(state.accessToken).toBe('new-token');
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
    });

    it('should preserve authenticated status when already logged in', () => {
      store.dispatch(new LoginSuccess(authResponse()));
      store.dispatch(new RefreshTokenSuccess(authResponse({ accessToken: 'refreshed' })));

      expect(AuthState.isAuthenticated(snapshot())).toBe(true);
      expect(AuthState.accessToken(snapshot())).toBe('refreshed');
    });
  });

  describe('RefreshTokenFailure', () => {
    it('should reset state to defaults', () => {
      store.dispatch(new LoginSuccess(authResponse()));
      store.dispatch(new RefreshTokenFailure());

      const state = snapshot();
      expect(state.isAuthenticated).toBe(false);
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
    });
  });

  describe('state transitions', () => {
    it('should go through full login success flow', () => {
      store.dispatch(new Login({ email: 'u@t.com', password: 'Pass1' }));
      expect(AuthState.loading(snapshot())).toBe(true);

      store.dispatch(new LoginSuccess(authResponse()));
      expect(AuthState.isAuthenticated(snapshot())).toBe(true);
      expect(AuthState.loading(snapshot())).toBe(false);

      store.dispatch(new Logout());
      expect(AuthState.isAuthenticated(snapshot())).toBe(false);
    });

    it('should go through full login failure flow', () => {
      store.dispatch(new Login({ email: 'u@t.com', password: 'wrong' }));
      store.dispatch(new LoginFailure({ error: 'Unauthorized' }));

      expect(AuthState.isAuthenticated(snapshot())).toBe(false);
      expect(AuthState.loading(snapshot())).toBe(false);
      expect(AuthState.error(snapshot())).toBe('Unauthorized');
    });

    it('should recover from error on next login attempt', () => {
      store.dispatch(new LoginFailure({ error: 'Server error' }));
      store.dispatch(new Login({ email: 'u@t.com', password: 'Pass1' }));

      expect(AuthState.error(snapshot())).toBeNull();
      expect(AuthState.loading(snapshot())).toBe(true);
    });
  });
});
