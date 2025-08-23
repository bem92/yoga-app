import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send POST request to register endpoint', () => {
    const registerRequest: RegisterRequest = {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'secret'
    };

    service.register(registerRequest).subscribe((res) => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerRequest);
    req.flush(null);
  });

  it('should send POST request to login endpoint and return session information', () => {
    const loginRequest: LoginRequest = {
      email: 'john.doe@example.com',
      password: 'secret'
    };
    const sessionInfo: SessionInformation = {
      token: 'abc123',
      type: 'Bearer',
      id: 1,
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    service.login(loginRequest).subscribe((res) => {
      expect(res).toEqual(sessionInfo);
    });

    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginRequest);
    req.flush(sessionInfo);
  });
});
