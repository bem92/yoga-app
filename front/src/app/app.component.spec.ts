// Importation des modules Angular nécessaires pour simuler l'application dans le test.
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
// expect est importé pour pouvoir faire des assertions avec Jest.
import { expect } from '@jest/globals';

// Import du service de session que nous allons espionner/mocker.
import { SessionService } from './services/session.service';
// Composant principal de l'application à tester.
import { AppComponent } from './app.component';


// Suite de tests pour AppComponent.
describe('AppComponent', () => {
  // beforeEach est exécuté avant chaque test afin de configurer un module de test propre.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Modules nécessaires au composant.
      imports: [
        RouterTestingModule, // Fournit un Router simulé.
        HttpClientModule,
        MatToolbarModule
      ],
      // Déclaration du composant testé.
      declarations: [
        AppComponent
      ],
      // Fourniture d'une version mock du SessionService.
      providers: [
        {
          provide: SessionService,
          useValue: {
            // $isLogged renvoie un Observable simulant un utilisateur connecté.
            $isLogged: jest.fn().mockReturnValue(of(true)),
            // logOut est une fonction espionnée sans implémentation.
            logOut: jest.fn()
          }
        }
      ]
    }).compileComponents(); // Compilation du module de test.
  });

  // Test vérifiant la création du composant.
  it("devrait créer l'application", () => {
    const fixture = TestBed.createComponent(AppComponent); // Création d'une instance du composant.
    const app = fixture.componentInstance; // Récupération de l'instance.
    expect(app).toBeTruthy(); // Vérifie que l'instance existe.
  });

  // Test vérifiant l'appel à $isLogged du service de session.
  it('devrait retourner le statut de connexion depuis le SessionService', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const session = TestBed.inject(SessionService); // Injection du service mocké.
    app.$isLogged().subscribe(); // Appel de la méthode du composant.
    expect(session.$isLogged).toHaveBeenCalled(); // Vérifie que la méthode du service a été appelée.
  });

  // Test vérifiant la déconnexion et la redirection.
  it('devrait se déconnecter et rediriger vers la racine', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const session = TestBed.inject(SessionService) as any; // Récupère le service mocké.
    const router = TestBed.inject(Router); // Récupère le Router simulé.
    // Création d'un espion sur la méthode navigate du router.
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    app.logout(); // Appel de la méthode de déconnexion.
    expect(session.logOut).toHaveBeenCalled(); // Vérifie que logOut a été appelé.
    expect(navigateSpy).toHaveBeenCalledWith(['']); // Vérifie la navigation vers la racine.
  });
});
