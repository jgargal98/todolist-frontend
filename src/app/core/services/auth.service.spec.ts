import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import type { LoginRequest, RegisterRequest, RefreshRequest, AuthResponse } from '../../shared/models/dto';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login', () => {
    it('should POST to /auth/login with the payload', () => {
      const payload: LoginRequest = { email: 'user@test.com', password: 'Secret1' };
      const mockResponse: AuthResponse = {
        accessToken: 'token-123',
        refreshToken: 'refresh-456',
        email: 'user@test.com',
      };

      service.login(payload).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });
  });

  describe('register', () => {
    it('should POST to /auth/register with the payload', () => {
      const payload: RegisterRequest = {
        email: 'new@test.com',
        password: 'Secret1',
        confirmPassword: 'Secret1',
      };
      const mockResponse: AuthResponse = {
        accessToken: 'token-789',
        refreshToken: 'refresh-012',
        email: 'new@test.com',
      };

      service.register(payload).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });
  });

  describe('refreshToken', () => {
    it('should POST to /auth/refresh with the payload', () => {
      const payload: RefreshRequest = {
        accessToken: 'expired-token',
        refreshToken: 'my-refresh',
      };
      const mockResponse: AuthResponse = {
        accessToken: 'new-token',
        refreshToken: 'new-refresh',
        email: 'user@test.com',
      };

      service.refreshToken(payload).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/refresh`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });
  });
});
