// Import des outils Angular pour tester les appels HTTP sans toucher au réseau réel.
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
// Import de la fonction expect de Jest pour nos assertions.
import { expect } from '@jest/globals';

// Service et interface que nous testons.
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';

// Début de la suite de tests du UserService.
describe('UserService', () => {
  // Déclarations des variables utilisées dans les tests.
  let service: UserService;
  let httpMock: HttpTestingController; // Permet d'inspecter les requêtes HTTP réalisées.

  // Configuration du module de test avant chaque test.
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule] // Remplace HttpClient par une version mockée.
    });
    service = TestBed.inject(UserService); // Récupération du service à tester.
    httpMock = TestBed.inject(HttpTestingController); // Récupération du contrôleur HTTP.
  });

  // Vérifie qu'aucune requête HTTP inattendue n'est en attente après chaque test.
  afterEach(() => httpMock.verify());

  // Test de récupération d'un utilisateur par son ID.
  it('should get user by id', () => {
    const mockUser: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: '',
      admin: false,
      password: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    service.getById('1').subscribe(res => {
      expect(res).toEqual(mockUser); // Vérifie que la réponse correspond au mock.
    });
    const req = httpMock.expectOne('api/user/1'); // Attend un appel HTTP spécifique.
    expect(req.request.method).toBe('GET'); // Vérifie le verbe HTTP utilisé.
    req.flush(mockUser); // Simule la réponse du serveur.
  });

  // Test de suppression d'un utilisateur.
  it('should delete user by id', () => {
    service.delete('1').subscribe(res => {
      expect(res).toBeUndefined(); // La suppression ne renvoie rien.
    });
    const req = httpMock.expectOne('api/user/1'); // Vérifie l'URL appelée.
    expect(req.request.method).toBe('DELETE'); // Vérifie le verbe HTTP utilisé.
    req.flush(null); // Simule une réponse vide.
  });
});
