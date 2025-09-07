// Importations des outils de test Angular et d'autres dépendances.
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

// Services et interfaces utilisés par le composant.
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';

// Composant à tester.
import { MeComponent } from './me.component';

// Début de la suite de tests pour MeComponent.
describe('MeComponent', () => {
  let component: MeComponent; // Instance du composant.
  let fixture: ComponentFixture<MeComponent>; // Conteneur de test.

  // Mock du SessionService avec des informations de session fictives.
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    } as any,
    logOut: jest.fn() // Espion pour la méthode logOut.
  } as Partial<SessionService>;

  // Utilisateur fictif renvoyé par le UserService.
  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    admin: true,
    password: '',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02')
  };

  // Mock du UserService avec méthodes getById et delete.
  const mockUserService = {
    getById: () => of(mockUser),
    delete: jest.fn().mockReturnValue(of(null))
  } as Partial<UserService>;

  // Mock de MatSnackBar pour éviter les appels réels.
  const matSnackBarMock = { open: jest.fn() };

  // Configuration du module de test avant chaque test.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        FlexLayoutModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: MatSnackBar, useValue: matSnackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent); // Création de la fixture.
    component = fixture.componentInstance; // Récupération du composant.
    fixture.detectChanges(); // Déclenchement du cycle de détection de changements.
  });

  afterEach(() => TestBed.resetTestingModule()); // Nettoyage après chaque test.

  // Vérifie l'affichage des informations utilisateur.
  it("devrait afficher les informations de l'utilisateur", () => {
    expect(component).toBeTruthy(); // Le composant existe.
    const element: HTMLElement = fixture.nativeElement; // Accès au DOM rendu.
    expect(element.querySelector('h1')?.textContent).toContain('User information');
    expect(element.textContent).toContain('Name: John DOE');
    expect(element.textContent).toContain('Email: john.doe@example.com');
    expect(element.textContent).toContain('You are admin');
  });

  // Vérifie que la méthode back() appelle l'historique du navigateur.
  it('devrait retourner en arrière via back()', () => {
    const backSpy = jest.spyOn(window.history, 'back'); // Espion sur la fonction historique.
    component.back();
    expect(backSpy).toHaveBeenCalled();
  });

  // Vérifie la suppression de l'utilisateur et la navigation vers l'accueil.
  it("devrait supprimer l'utilisateur et rediriger vers l'accueil", () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true); // Espion sur navigate.
    component.delete(); // Appel de la méthode delete du composant.
    expect(mockUserService.delete).toHaveBeenCalledWith('1'); // Vérifie l'appel du service.
    expect(matSnackBarMock.open).toHaveBeenCalled(); // Vérifie l'affichage d'un message.
    expect(mockSessionService.logOut).toHaveBeenCalled(); // Vérifie la déconnexion.
    expect(navigateSpy).toHaveBeenCalledWith(['/']); // Vérifie la navigation.
  });
});
