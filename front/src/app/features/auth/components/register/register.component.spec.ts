import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { AuthService } from '../../services/auth.service';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: Router;
  let navigateSpy: jest.SpyInstance;

  beforeEach(async () => {
    const authServiceMock = { register: jest.fn() } as unknown as AuthService;

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should register and navigate on success', fakeAsync(() => {
    authService.register.mockReturnValue(of(void 0));

    const nativeElement = fixture.debugElement.nativeElement;
    const firstNameInput = nativeElement.querySelector('input[formControlName="firstName"]');
    const lastNameInput = nativeElement.querySelector('input[formControlName="lastName"]');
    const emailInput = nativeElement.querySelector('input[formControlName="email"]');
    const passwordInput = nativeElement.querySelector('input[formControlName="password"]');

    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.value = 'Doe';
    lastNameInput.dispatchEvent(new Event('input'));
    emailInput.value = 'john@example.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = '30';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    tick();
    fixture.detectChanges();

    expect(authService.register).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: '30'
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  }));

  it('should display validation errors for invalid fields', () => {
    const nativeElement = fixture.debugElement.nativeElement;
    const firstNameInput = nativeElement.querySelector('input[formControlName="firstName"]');
    const lastNameInput = nativeElement.querySelector('input[formControlName="lastName"]');
    const emailInput = nativeElement.querySelector('input[formControlName="email"]');
    const passwordInput = nativeElement.querySelector('input[formControlName="password"]');
    const submitButton = nativeElement.querySelector('button[type="submit"]');

    submitButton.click();
    fixture.detectChanges();

    expect(firstNameInput.classList).toContain('ng-invalid');
    expect(lastNameInput.classList).toContain('ng-invalid');
    expect(emailInput.classList).toContain('ng-invalid');
    expect(passwordInput.classList).toContain('ng-invalid');
    expect(submitButton.disabled).toBe(true);

    firstNameInput.value = '1';
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.value = '1';
    lastNameInput.dispatchEvent(new Event('input'));
    emailInput.value = 'not-an-email';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = '1';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(firstNameInput.classList).toContain('ng-invalid');
    expect(lastNameInput.classList).toContain('ng-invalid');
    expect(emailInput.classList).toContain('ng-invalid');
    expect(passwordInput.classList).toContain('ng-invalid');
    expect(submitButton.disabled).toBe(true);

    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.value = 'Doe';
    lastNameInput.dispatchEvent(new Event('input'));
    emailInput.value = 'john@example.com';
    emailInput.dispatchEvent(new Event('input'));
      passwordInput.value = '30';
      passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(firstNameInput.classList).toContain('ng-valid');
    expect(lastNameInput.classList).toContain('ng-valid');
    expect(emailInput.classList).toContain('ng-valid');
    expect(passwordInput.classList).toContain('ng-valid');
    expect(submitButton.disabled).toBe(false);
  });
});

