import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  /** Helper to set a control value and mark it as touched. */
  function setValue(controlName: string, value: string): void {
    const control = component.loginForm.get(controlName)!;
    control.setValue(value);
    control.markAsTouched();
  }

  describe('email validation', () => {
    it('should be invalid when email is empty', () => {
      const email = component.loginForm.get('email')!;
      email.markAsTouched();
      expect(email.hasError('required')).toBe(true);
    });

    it('should be invalid for an improperly formatted email', () => {
      setValue('email', 'not-an-email');
      expect(component.loginForm.get('email')!.hasError('email')).toBe(true);
    });

    it('should be valid for a correctly formatted email', () => {
      setValue('email', 'user@example.com');
      expect(component.loginForm.get('email')!.valid).toBe(true);
    });
  });

  describe('password validation', () => {
    it('should be invalid when password is empty', () => {
      const password = component.loginForm.get('password')!;
      password.markAsTouched();
      expect(password.hasError('required')).toBe(true);
    });

    it('should be invalid when password is shorter than 6 characters', () => {
      setValue('password', 'Ab1');
      expect(
        component.loginForm.get('password')!.hasError('minlength'),
      ).toBe(true);
    });

    it('should be invalid when password has 6 lowercase letters (no uppercase, no digit)', () => {
      setValue('password', 'abcdef');
      const pwd = component.loginForm.get('password')!;
      expect(pwd.hasError('pattern')).toBe(true);
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should be invalid when password has 6 characters but no uppercase', () => {
      setValue('password', 'abcd12');
      const pwd = component.loginForm.get('password')!;
      expect(pwd.hasError('pattern')).toBe(true);
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should be invalid when password has 6 characters but no digit', () => {
      setValue('password', 'Abcdef');
      const pwd = component.loginForm.get('password')!;
      expect(pwd.hasError('pattern')).toBe(true);
      expect(component.loginForm.invalid).toBe(true);
    });

    it('should be valid when password meets all requirements ("Pass12")', () => {
      setValue('email', 'user@example.com');
      setValue('password', 'Pass12');
      expect(component.loginForm.get('password')!.valid).toBe(true);
      expect(component.loginForm.valid).toBe(true);
    });

    it('should be valid with a complex valid password', () => {
      setValue('password', 'StrongPass99');
      expect(component.loginForm.get('password')!.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    it('should not log when the form is invalid', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      component.loginForm.get('email')!.setValue('bad-email');
      component.loginForm.get('password')!.setValue('ab');
      component.onSubmit();
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log when the form is valid', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      setValue('email', 'user@example.com');
      setValue('password', 'Pass12');
      component.onSubmit();
      expect(consoleSpy).toHaveBeenCalledWith('Login submitted:', {
        email: 'user@example.com',
        password: 'Pass12',
      });
    });
  });
});
