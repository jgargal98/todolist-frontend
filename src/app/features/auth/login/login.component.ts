import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

/**
 * Regex enforcing API password rules:
 * - Minimum 6 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 */
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
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

      .mt-3 {
        margin-top: 1rem;
      }

      .text-center {
        text-align: center;
      }

      .text-sm {
        font-size: 0.875rem;
      }

      .text-primary {
        color: var(--p-primary-color);
      }

      .no-underline {
        text-decoration: none;
      }

      .font-semibold {
        font-weight: 600;
      }

      .cursor-pointer {
        cursor: pointer;
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
          Validators.pattern(PASSWORD_PATTERN),
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
