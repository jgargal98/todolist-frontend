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

/**
 * Custom validator that checks if the 'password' and 'confirmPassword'
 * controls of the given FormGroup have matching values.
 */
export function passwordMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value
    ? null
    : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  /** Reactive form group for the registration form. */
  readonly registerForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.registerForm = this.fb.nonNullable.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(PASSWORD_PATTERN),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );
  }

  /** Convenience getter for the email form control. */
  protected get email() {
    return this.registerForm.get('email')!;
  }

  /** Convenience getter for the password form control. */
  protected get password() {
    return this.registerForm.get('password')!;
  }

  /** Convenience getter for the confirmPassword form control. */
  protected get confirmPassword() {
    return this.registerForm.get('confirmPassword')!;
  }

  /**
   * Handles form submission.
   * Logs the form value to the console when the form is valid.
   */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    console.log('Register submitted:', this.registerForm.value);
  }
}
