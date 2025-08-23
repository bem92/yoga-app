import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { AuthService } from '../../services/auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jest.Mocked<AuthService>;
  let sessionService: SessionService;
  let router: Router;
  let navigateSpy: jest.SpyInstance;

  beforeEach(async () => {
    const authServiceMock = { login: jest.fn() } as unknown as AuthService;

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        SessionService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should log in and navigate on success', fakeAsync(() => {
    const session: SessionInformation = {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'john',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    const logInSpy = jest.spyOn(sessionService, 'logIn');
    authService.login.mockReturnValue(of(session));

    const nativeElement = fixture.debugElement.nativeElement;
    const emailInput = nativeElement.querySelector('input[formControlName="email"]');
    const passwordInput = nativeElement.querySelector('input[formControlName="password"]');
    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = '12345';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    tick();
    fixture.detectChanges();

    expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: '12345' });
    expect(logInSpy).toHaveBeenCalledWith(session);
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  }));

  it('should handle login error', fakeAsync(() => {
    authService.login.mockReturnValue(throwError(() => new Error('login error')));

    const nativeElement = fixture.debugElement.nativeElement;
    const emailInput = nativeElement.querySelector('input[formControlName="email"]');
    const passwordInput = nativeElement.querySelector('input[formControlName="password"]');
    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = '12345';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    tick();
    fixture.detectChanges();

    expect(component.onError).toBe(true);
    const errorElement = nativeElement.querySelector('p.error');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toContain('An error occurred');
  }));

  it('should display validation errors for invalid fields', () => {
    const nativeElement = fixture.debugElement.nativeElement;
    const emailInput = nativeElement.querySelector('input[formControlName="email"]');
    const passwordInput = nativeElement.querySelector('input[formControlName="password"]');
    const submitButton = nativeElement.querySelector('button[type="submit"]');

    submitButton.click();
    fixture.detectChanges();

    expect(emailInput.classList).toContain('ng-invalid');
    expect(passwordInput.classList).toContain('ng-invalid');
    expect(submitButton.disabled).toBe(true);

    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = '12345';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(emailInput.classList).toContain('ng-valid');
    expect(passwordInput.classList).toContain('ng-valid');
    expect(submitButton.disabled).toBe(false);
  });
});
