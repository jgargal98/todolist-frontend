import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { AuthComponent } from './auth.component';

function createComponent(mode: 'login' | 'register'): AuthComponent {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [AuthComponent],
    providers: [
      provideRouter([]),
      { provide: ActivatedRoute, useValue: { snapshot: { data: { mode } } } },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(AuthComponent);
  fixture.detectChanges();
  return fixture.componentInstance;
}

function setValue(component: AuthComponent, controlName: string, value: string): void {
  const control = component.form.get(controlName)!;
  control.setValue(value);
  control.markAsTouched();
}

// ─── Login ───────────────────────────────────────────────────────────────────

describe('AuthComponent – login mode', () => {
  let component: AuthComponent;
  beforeEach(() => { component = createComponent('login'); });

  it('should be in login mode', () => {
    expect(component.isRegister).toBe(false);
  });

  it('should not expose a confirmPassword control', () => {
    expect(component.form.get('confirmPassword')).toBeNull();
  });

  describe('email validation', () => {
    it('should be invalid when email is empty', () => {
      component.form.get('email')!.markAsTouched();
      expect(component.form.get('email')!.hasError('required')).toBe(true);
    });

    it('should be invalid for an improperly formatted email', () => {
      setValue(component, 'email', 'not-an-email');
      expect(component.form.get('email')!.hasError('email')).toBe(true);
    });

    it('should be valid for a correctly formatted email', () => {
      setValue(component, 'email', 'user@example.com');
      expect(component.form.get('email')!.valid).toBe(true);
    });
  });

  describe('password validation', () => {
    it('should be invalid when password is empty', () => {
      component.form.get('password')!.markAsTouched();
      expect(component.form.get('password')!.hasError('required')).toBe(true);
    });

    it('should be invalid when shorter than 6 characters', () => {
      setValue(component, 'password', 'Ab1');
      expect(component.form.get('password')!.hasError('minlength')).toBe(true);
    });

    it('should be invalid when no uppercase letter', () => {
      setValue(component, 'password', 'abcd12');
      expect(component.form.get('password')!.hasError('pattern')).toBe(true);
    });

    it('should be invalid when no digit', () => {
      setValue(component, 'password', 'Abcdef');
      expect(component.form.get('password')!.hasError('pattern')).toBe(true);
    });

    it('should be valid when all requirements are met', () => {
      setValue(component, 'email', 'user@example.com');
      setValue(component, 'password', 'Pass12');
      expect(component.form.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    it('should not proceed when the form is invalid', () => {
      const spy = vi.spyOn(console, 'log');
      component.form.get('email')!.setValue('bad-email');
      component.form.get('password')!.setValue('ab');
      component.onSubmit();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should allow submit when the form is valid', () => {
      setValue(component, 'email', 'user@example.com');
      setValue(component, 'password', 'Pass12');
      expect(() => component.onSubmit()).not.toThrow();
    });
  });
});

// ─── Register ────────────────────────────────────────────────────────────────

describe('AuthComponent – register mode', () => {
  let component: AuthComponent;
  beforeEach(() => { component = createComponent('register'); });

  it('should be in register mode', () => {
    expect(component.isRegister).toBe(true);
  });

  it('should expose a confirmPassword control', () => {
    expect(component.form.get('confirmPassword')).not.toBeNull();
  });

  describe('email validation', () => {
    it('should be invalid when email is empty', () => {
      component.form.get('email')!.markAsTouched();
      expect(component.form.get('email')!.hasError('required')).toBe(true);
    });

    it('should be invalid for an improperly formatted email', () => {
      setValue(component, 'email', 'not-an-email');
      expect(component.form.get('email')!.hasError('email')).toBe(true);
    });

    it('should be valid for a correctly formatted email', () => {
      setValue(component, 'email', 'user@example.com');
      expect(component.form.get('email')!.valid).toBe(true);
    });
  });

  describe('password validation', () => {
    it('should be invalid when password is empty', () => {
      component.form.get('password')!.markAsTouched();
      expect(component.form.get('password')!.hasError('required')).toBe(true);
    });

    it('should be invalid when shorter than 6 characters', () => {
      setValue(component, 'password', 'Ab1');
      expect(component.form.get('password')!.hasError('minlength')).toBe(true);
    });

    it('should be invalid when no uppercase letter', () => {
      setValue(component, 'password', 'abcd12');
      expect(component.form.get('password')!.hasError('pattern')).toBe(true);
    });

    it('should be invalid when no digit', () => {
      setValue(component, 'password', 'Abcdef');
      expect(component.form.get('password')!.hasError('pattern')).toBe(true);
    });

    it('should be valid when all requirements are met', () => {
      setValue(component, 'password', 'Pass12');
      expect(component.form.get('password')!.valid).toBe(true);
    });
  });

  describe('confirm password validation', () => {
    it('should be invalid when confirmPassword is empty', () => {
      component.form.get('confirmPassword')!.markAsTouched();
      expect(component.form.get('confirmPassword')!.hasError('required')).toBe(true);
    });

    it('should report passwordMismatch when passwords differ', () => {
      setValue(component, 'password', 'Pass12');
      setValue(component, 'confirmPassword', 'Different1');
      expect(component.form.hasError('passwordMismatch')).toBe(true);
    });

    it('should not report passwordMismatch when passwords match', () => {
      setValue(component, 'password', 'Pass12');
      setValue(component, 'confirmPassword', 'Pass12');
      expect(component.form.hasError('passwordMismatch')).toBe(false);
    });
  });

  describe('form validity', () => {
    it('should be invalid when all fields are empty', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should be valid when all requirements are met', () => {
      setValue(component, 'email', 'user@example.com');
      setValue(component, 'password', 'Strong99');
      setValue(component, 'confirmPassword', 'Strong99');
      expect(component.form.valid).toBe(true);
    });

    it('should be invalid when passwords do not match', () => {
      setValue(component, 'email', 'user@example.com');
      setValue(component, 'password', 'Strong99');
      setValue(component, 'confirmPassword', 'Strong00');
      expect(component.form.valid).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('should not proceed when the form is invalid', () => {
      const spy = vi.spyOn(console, 'log');
      component.onSubmit();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should allow submit when the form is valid', () => {
      setValue(component, 'email', 'user@example.com');
      setValue(component, 'password', 'Pass12');
      setValue(component, 'confirmPassword', 'Pass12');
      expect(() => component.onSubmit()).not.toThrow();
    });
  });
});
