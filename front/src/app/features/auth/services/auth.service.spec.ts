import { TestBed } from '@angular/core/testing'; // Outils de test Angular
import { expect } from '@jest/globals'; // Assertions Jest
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Utilitaires HTTP mockés

import { AuthService } from './auth.service'; // Service à tester
import { RegisterRequest } from '../interfaces/registerRequest.interface'; // Interface pour l'inscription
import { LoginRequest } from '../interfaces/loginRequest.interface'; // Interface pour la connexion
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface'; // Informations de session

describe('AuthService', () => {
  let service: AuthService; // Instance du service testé
  let httpMock: HttpTestingController; // Contrôleur HTTP pour intercepter les requêtes

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] // Module fournissant un HttpClient mocké
    });
    service = TestBed.inject(AuthService); // Récupération du service
    httpMock = TestBed.inject(HttpTestingController); // Récupération du contrôleur HTTP
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'aucune requête n'est en attente
  });

  it('should send POST request to register endpoint', () => {
    const registerRequest: RegisterRequest = {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'secret'
    };

    service.register(registerRequest).subscribe((res) => {
      expect(res).toBeUndefined(); // L'API ne renvoie rien
    });

    const req = httpMock.expectOne('api/auth/register'); // Intercepte la requête
    expect(req.request.method).toBe('POST'); // Vérifie la méthode HTTP
    expect(req.request.body).toEqual(registerRequest); // Vérifie le corps
    req.flush(null); // Simule une réponse vide
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
      expect(res).toEqual(sessionInfo); // La réponse doit contenir les infos de session
    });

    const req = httpMock.expectOne('api/auth/login'); // Intercepte la requête
    expect(req.request.method).toBe('POST'); // Vérifie la méthode
    expect(req.request.body).toEqual(loginRequest); // Vérifie le corps
    req.flush(sessionInfo); // Simule la réponse du serveur
  });
});
