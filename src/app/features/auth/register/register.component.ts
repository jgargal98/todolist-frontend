import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Register } from '../../../store/auth/auth.actions';
import { AuthState } from '../../../store/auth/auth.state';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

/** Cross-field validator that ensures password and confirmPassword match. */
function passwordMatchValidator(
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
  host: {
    style: 'display: flex; align-items: center; justify-content: center; min-height: 100vh;',
  },
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly registerForm: FormGroup;

  /** Reactive signal reflecting the loading state of the auth store. */
  readonly loading = this.store.selectSignal(AuthState.loading);

  constructor() {
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

  get f() {
    return this.registerForm.controls;
  }

  /** Validates the form and dispatches the Register action to the store. */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    this.store.dispatch(new Register(this.registerForm.value));
  }
}
