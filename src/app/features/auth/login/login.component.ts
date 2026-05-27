import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Login } from '../../../store/auth/auth.actions';
import { AuthState } from '../../../store/auth/auth.state';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly loginForm: FormGroup;

  /** Reactive signal reflecting the loading state of the auth store. */
  readonly loading = this.store.selectSignal(AuthState.loading);

  constructor() {
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

  get f() {
    return this.loginForm.controls;
  }

  /** Validates the form and dispatches the Login action to the store. */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.store.dispatch(new Login(this.loginForm.value));
  }
}
