import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'; // Outils de test Angular
import { ReactiveFormsModule } from '@angular/forms'; // Module pour les formulaires réactifs
import { Router } from '@angular/router'; // Service de navigation Angular
import { RouterTestingModule } from '@angular/router/testing'; // Module de test pour le Router
import { MatCardModule } from '@angular/material/card'; // Composant carte Material
import { MatFormFieldModule } from '@angular/material/form-field'; // Composant champ de formulaire Material
import { MatIconModule } from '@angular/material/icon'; // Icônes Material
import { MatInputModule } from '@angular/material/input'; // Champs de saisie Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Animations requises par Angular Material
import { of, throwError } from 'rxjs'; // Création d'observables pour simuler les appels HTTP
import { expect } from '@jest/globals'; // Fonction d'assertion Jest
import { SessionService } from 'src/app/services/session.service'; // Service de gestion de la session utilisateur
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface'; // Interface décrivant une session
import { AuthService } from '../../services/auth.service'; // Service d'authentification à mocker

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent; // Instance du composant testé
  let fixture: ComponentFixture<LoginComponent>; // Wrapper pour accéder au DOM et au composant
  let authService: jest.Mocked<AuthService>; // Version mockée du service d'authentification
  let sessionService: SessionService; // Service de session réel
  let router: Router; // Router Angular
  let navigateSpy: jest.SpyInstance; // Espion sur la navigation

  beforeEach(async () => {
    const authServiceMock = { login: jest.fn() } as unknown as AuthService; // Création d'un mock simple du service

    await TestBed.configureTestingModule({
      declarations: [LoginComponent], // Déclaration du composant à tester
      imports: [
        RouterTestingModule.withRoutes([]), // Router en mode test
        ReactiveFormsModule, // Gestion du formulaire de connexion
        BrowserAnimationsModule, // Nécessaire pour Angular Material
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        SessionService, // Fourniture du service réel
        { provide: AuthService, useValue: authServiceMock } // Injection du mock à la place du service réel
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent); // Création du composant
    component = fixture.componentInstance; // Récupération de l'instance
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>; // Récupération du mock injecté
    sessionService = TestBed.inject(SessionService); // Récupération du service réel
    router = TestBed.inject(Router); // Récupération du Router
    navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true); // Espion sur la méthode navigate
    fixture.detectChanges(); // Déclenche la détection de changements
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
    const logInSpy = jest.spyOn(sessionService, 'logIn'); // Espion sur la méthode logIn du service de session
    authService.login.mockReturnValue(of(session)); // Le service d'auth renvoie une session simulée

    const nativeElement = fixture.debugElement.nativeElement; // Accès au DOM
    const emailInput = nativeElement.querySelector('input[formControlName="email"]'); // Champ email
    const passwordInput = nativeElement.querySelector('input[formControlName="password"]'); // Champ mot de passe
    emailInput.value = 'test@example.com'; // On remplit l'email
    emailInput.dispatchEvent(new Event('input')); // On déclenche l'événement input
    passwordInput.value = '12345'; // On remplit le mot de passe
    passwordInput.dispatchEvent(new Event('input')); // On déclenche l'événement input
    fixture.detectChanges(); // Mise à jour de la vue

    nativeElement.querySelector('form').dispatchEvent(new Event('submit')); // Soumission du formulaire
    tick(); // Avance dans le temps pour les opérations asynchrones
    fixture.detectChanges(); // Mise à jour de la vue

    expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: '12345' }); // Vérifie que le service reçoit les bonnes données
    expect(logInSpy).toHaveBeenCalledWith(session); // Vérifie que la session est enregistrée
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']); // Vérifie la navigation
  }));

  it('should handle login error', fakeAsync(() => {
    authService.login.mockReturnValue(throwError(() => new Error('login error'))); // Le service renvoie une erreur

    const nativeElement = fixture.debugElement.nativeElement;
    const emailInput = nativeElement.querySelector('input[formControlName="email"]');
    const passwordInput = nativeElement.querySelector('input[formControlName="password"]');
    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = '12345';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    nativeElement.querySelector('form').dispatchEvent(new Event('submit')); // Tentative de connexion
    tick();
    fixture.detectChanges();

    expect(component.onError).toBe(true); // Le composant passe en mode erreur
    const errorElement = nativeElement.querySelector('p.error'); // Paragraphe d'erreur
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toContain('An error occurred'); // Message d'erreur attendu
  }));

  it('should display validation errors for invalid fields', () => {
    const nativeElement = fixture.debugElement.nativeElement;
    const emailInput = nativeElement.querySelector('input[formControlName="email"]'); // Champ email
    const passwordInput = nativeElement.querySelector('input[formControlName="password"]'); // Champ mot de passe
    const submitButton = nativeElement.querySelector('button[type="submit"]'); // Bouton de soumission

    submitButton.click(); // Soumet le formulaire sans valeurs
    fixture.detectChanges();

    expect(emailInput.classList).toContain('ng-invalid'); // Champ email invalide
    expect(passwordInput.classList).toContain('ng-invalid'); // Champ mot de passe invalide
    expect(submitButton.disabled).toBe(true); // Bouton désactivé

    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = '12345';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(emailInput.classList).toContain('ng-valid'); // Champs valides après saisie
    expect(passwordInput.classList).toContain('ng-valid');
    expect(submitButton.disabled).toBe(false); // Bouton activé
  });
});
