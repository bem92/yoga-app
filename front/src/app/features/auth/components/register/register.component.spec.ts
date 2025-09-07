import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'; // Outils de test Angular
import { ReactiveFormsModule } from '@angular/forms'; // Gestion des formulaires réactifs
import { Router } from '@angular/router'; // Service de navigation
import { RouterTestingModule } from '@angular/router/testing'; // Router en mode test
import { MatCardModule } from '@angular/material/card'; // Carte Material
import { MatFormFieldModule } from '@angular/material/form-field'; // Champ de formulaire Material
import { MatInputModule } from '@angular/material/input'; // Champ de saisie Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Animations pour Angular Material
import { of, throwError } from 'rxjs'; // Création d'observables simulés
import { expect } from '@jest/globals'; // Assertions Jest

import { AuthService } from '../../services/auth.service'; // Service d'authentification mocké

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent; // Instance du composant
  let fixture: ComponentFixture<RegisterComponent>; // Accès au DOM et au composant
  let authService: jest.Mocked<AuthService>; // Service d'auth mocké
  let router: Router; // Router Angular
  let navigateSpy: jest.SpyInstance; // Espion sur la navigation

  beforeEach(async () => {
    const authServiceMock = { register: jest.fn() } as unknown as AuthService; // Mock simple du service

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent], // Déclaration du composant testé
      imports: [
        RouterTestingModule.withRoutes([]), // Router en mode test
        ReactiveFormsModule, // Formulaire réactif
        BrowserAnimationsModule, // Animations Material
        MatCardModule,
        MatFormFieldModule,
        MatInputModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock } // Injection du mock
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent); // Création du composant
    component = fixture.componentInstance; // Récupération de l'instance
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>; // Récupération du mock
    router = TestBed.inject(Router); // Router réel
    navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true); // Espion sur navigate
    fixture.detectChanges(); // Mise à jour de la vue
  });

  it('should register and navigate on success', fakeAsync(() => {
    authService.register.mockReturnValue(of(void 0)); // Le mock renvoie un observable complété

    const nativeElement = fixture.debugElement.nativeElement;
    const firstNameInput = nativeElement.querySelector('input[formControlName="firstName"]'); // Champ prénom
    const lastNameInput = nativeElement.querySelector('input[formControlName="lastName"]'); // Champ nom
    const emailInput = nativeElement.querySelector('input[formControlName="email"]'); // Champ email
    const passwordInput = nativeElement.querySelector('input[formControlName="password"]'); // Champ mot de passe

    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.value = 'Doe';
    lastNameInput.dispatchEvent(new Event('input'));
    emailInput.value = 'john@example.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = '30';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges(); // Mise à jour de la vue

    nativeElement.querySelector('form').dispatchEvent(new Event('submit')); // Soumission du formulaire
    tick(); // Avance dans le temps pour les opérations asynchrones
    fixture.detectChanges();

    expect(authService.register).toHaveBeenCalledWith({ // Vérifie l'appel avec les bonnes données
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: '30'
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/login']); // Vérifie la redirection
  }));

  it('should set error flag when registration fails', fakeAsync(() => {
    authService.register.mockReturnValue(throwError(() => new Error('fail'))); // Simulation d'une erreur

    const nativeElement = fixture.debugElement.nativeElement;
    nativeElement.querySelector('input[formControlName="firstName"]').value = 'John';
    nativeElement.querySelector('input[formControlName="firstName"]').dispatchEvent(new Event('input'));
    nativeElement.querySelector('input[formControlName="lastName"]').value = 'Doe';
    nativeElement.querySelector('input[formControlName="lastName"]').dispatchEvent(new Event('input'));
    nativeElement.querySelector('input[formControlName="email"]').value = 'john@example.com';
    nativeElement.querySelector('input[formControlName="email"]').dispatchEvent(new Event('input'));
    nativeElement.querySelector('input[formControlName="password"]').value = '30';
    nativeElement.querySelector('input[formControlName="password"]').dispatchEvent(new Event('input'));
    fixture.detectChanges();

    nativeElement.querySelector('form').dispatchEvent(new Event('submit')); // Soumission
    tick();
    fixture.detectChanges();

    expect(component.onError).toBe(true); // Le drapeau d'erreur est positionné
    expect(navigateSpy).not.toHaveBeenCalled(); // Aucune navigation ne se produit
  }));

  it('should display validation errors for invalid fields', () => {
    const nativeElement = fixture.debugElement.nativeElement;
    const firstNameInput = nativeElement.querySelector('input[formControlName="firstName"]'); // Champ prénom
    const lastNameInput = nativeElement.querySelector('input[formControlName="lastName"]'); // Champ nom
    const emailInput = nativeElement.querySelector('input[formControlName="email"]'); // Champ email
    const passwordInput = nativeElement.querySelector('input[formControlName="password"]'); // Champ mot de passe
    const submitButton = nativeElement.querySelector('button[type="submit"]'); // Bouton de soumission

    submitButton.click(); // Soumission sans données
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

