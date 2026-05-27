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
import { CardModule } from 'primeng/card';
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
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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
