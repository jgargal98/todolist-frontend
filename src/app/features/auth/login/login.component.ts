import { Component, DestroyRef, inject } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { filter, take } from 'rxjs';
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
    style: 'height: 100vh; width: 100vw; overflow: hidden; display: block;',
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
  readonly loginForm: FormGroup;
  readonly loading = toSignal(inject(Store).select(AuthState.loading), {
    initialValue: false,
  });
  readonly error = toSignal(inject(Store).select(AuthState.error), {
    initialValue: null,
  });

  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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

    this.store
      .select(AuthState.isAuthenticated)
      .pipe(
        filter(Boolean),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.router.navigate(['/dashboard']));
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.store.dispatch(new Login(this.loginForm.getRawValue()));
  }
}
