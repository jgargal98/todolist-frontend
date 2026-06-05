import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { AuthState } from '../../../store/auth/auth.state';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let store: Store;
  let authServiceMock: { login: ReturnType<typeof vi.fn>; register: ReturnType<typeof vi.fn>; refreshToken: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn(),
      register: vi.fn(),
      refreshToken: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        provideStore([AuthState]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    const fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  /** Helper to set a control value and mark it as touched. */
  function setValue(controlName: string, value: string): void {
    const control = component.registerForm.get(controlName)!;
    control.setValue(value);
    control.markAsTouched();
  }

  describe('email validation', () => {
    it('should be invalid when email is empty', () => {
      const email = component.registerForm.get('email')!;
      email.markAsTouched();
      expect(email.hasError('required')).toBe(true);
    });

    it('should be invalid for an improperly formatted email', () => {
      setValue('email', 'not-an-email');
      expect(component.registerForm.get('email')!.hasError('email')).toBe(true);
    });

    it('should be valid for a correctly formatted email', () => {
      setValue('email', 'user@example.com');
      expect(component.registerForm.get('email')!.valid).toBe(true);
    });
  });

  describe('password validation', () => {
    it('should be invalid when password is empty', () => {
      const password = component.registerForm.get('password')!;
      password.markAsTouched();
      expect(password.hasError('required')).toBe(true);
    });

    it('should be invalid when password is shorter than 6 characters', () => {
      setValue('password', 'Ab1');
      expect(
        component.registerForm.get('password')!.hasError('minlength'),
      ).toBe(true);
    });

    it('should be invalid when password has no uppercase letter', () => {
      setValue('password', 'abcd12');
      const pwd = component.registerForm.get('password')!;
      expect(pwd.hasError('pattern')).toBe(true);
    });

    it('should be invalid when password has no digit', () => {
      setValue('password', 'Abcdef');
      const pwd = component.registerForm.get('password')!;
      expect(pwd.hasError('pattern')).toBe(true);
    });

    it('should be valid when password meets all requirements', () => {
      setValue('password', 'Pass12');
      expect(component.registerForm.get('password')!.valid).toBe(true);
    });
  });

  describe('confirm password validation', () => {
    it('should be invalid when confirmPassword is empty', () => {
      const confirmPassword = component.registerForm.get('confirmPassword')!;
      confirmPassword.markAsTouched();
      expect(confirmPassword.hasError('required')).toBe(true);
    });

    it('should be invalid when passwords do not match', () => {
      setValue('password', 'Pass12');
      setValue('confirmPassword', 'Different1');
      expect(component.registerForm.hasError('passwordMismatch')).toBe(true);
    });

    it('should be valid when passwords match', () => {
      setValue('password', 'Pass12');
      setValue('confirmPassword', 'Pass12');
      expect(component.registerForm.hasError('passwordMismatch')).toBe(false);
    });
  });

  describe('form validity', () => {
    it('should be invalid when all fields are empty', () => {
      expect(component.registerForm.valid).toBe(false);
    });

    it('should be valid when all requirements are met', () => {
      setValue('email', 'user@example.com');
      setValue('password', 'Strong99');
      setValue('confirmPassword', 'Strong99');
      expect(component.registerForm.valid).toBe(true);
    });

    it('should be invalid when passwords do not match even with valid fields', () => {
      setValue('email', 'user@example.com');
      setValue('password', 'Strong99');
      setValue('confirmPassword', 'Strong00');
      expect(component.registerForm.valid).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('should not dispatch when the form is invalid', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      component.onSubmit();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch Register when the form is valid', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      setValue('email', 'user@example.com');
      setValue('password', 'Pass12');
      setValue('confirmPassword', 'Pass12');
      component.onSubmit();
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { email: 'user@example.com', password: 'Pass12', confirmPassword: 'Pass12' },
        }),
      );
    });
  });

  describe('store signals', () => {
    it('should reflect loading state from store', () => {
      expect(component.loading()).toBe(false);
    });

    it('should reflect error state from store', () => {
      expect(component.error()).toBeNull();
    });
  });
});
