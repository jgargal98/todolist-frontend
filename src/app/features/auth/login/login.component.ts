import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

/**
 * Validates that the control value contains at least one uppercase letter.
 */
function uppercaseValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  return /[A-Z]/.test(control.value) ? null : { uppercase: true };
}

/**
 * Validates that the control value contains at least one lowercase letter.
 */
function lowercaseValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  return /[a-z]/.test(control.value) ? null : { lowercase: true };
}

/**
 * Validates that the control value contains at least one digit.
 */
function digitValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  return /\d/.test(control.value) ? null : { digit: true };
}

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './login.component.html',
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }

      .login-card {
        background: var(--p-surface-card);
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
        width: 100%;
        max-width: 400px;
      }

      .login-card h2 {
        margin: 0 0 1.5rem;
        text-align: center;
        font-weight: 600;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        margin-bottom: 1.25rem;
      }

      .field label {
        font-weight: 500;
        font-size: 0.875rem;
      }

      .error {
        color: var(--p-red-400);
        font-size: 0.75rem;
        line-height: 1.25;
        margin-top: 0.25rem;
      }

      .submit-btn {
        width: 100%;
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class LoginComponent {
  /** Reactive form group for the login form. */
  readonly loginForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          uppercaseValidator,
          lowercaseValidator,
          digitValidator,
        ],
      ],
    });
  }

  /** Convenience getter for the email form control. */
  protected get email() {
    return this.loginForm.get('email')!;
  }

  /** Convenience getter for the password form control. */
  protected get password() {
    return this.loginForm.get('password')!;
  }

  /**
   * Handles form submission.
   * Logs the form value to the console when the form is valid.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    console.log('Login submitted:', this.loginForm.value);
  }
}
