// Import des utilitaires de test Angular pour simuler les requêtes HTTP.
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
// Fonction d'assertion de Jest.
import { expect } from '@jest/globals';

// Service et interface que nous testons.
import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';

// Suite de tests pour le TeacherService.
describe('TeacherService', () => {
  // Variables pour le service et le contrôleur HTTP mocké.
  let service: TeacherService;
  let httpMock: HttpTestingController;

  // Configuration du module de test avant chaque test.
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule] // Fournit un HttpClient mocké.
    });
    service = TestBed.inject(TeacherService); // Instancie le service.
    httpMock = TestBed.inject(HttpTestingController); // Instancie le contrôleur HTTP.
  });

  // Vérifie qu'il n'y a pas de requêtes en attente après chaque test.
  afterEach(() => httpMock.verify());

  // Test de récupération de tous les enseignants.
  it('should retrieve all teachers', () => {
    const mockTeachers: Teacher[] = [{ id: 1, firstName: 't', lastName: 't' } as Teacher];
    service.all().subscribe(res => {
      expect(res).toEqual(mockTeachers); // Vérifie que le service renvoie la liste attendue.
    });
    const req = httpMock.expectOne('api/teacher'); // Attend une requête sur cette URL.
    expect(req.request.method).toBe('GET'); // Doit être une requête GET.
    req.flush(mockTeachers); // Simule la réponse du serveur.
  });

  // Test de récupération du détail d'un enseignant.
  it('should retrieve teacher detail', () => {
    const mockTeacher: Teacher = { id: 1, firstName: 't', lastName: 't' } as Teacher;
    service.detail('1').subscribe(res => {
      expect(res).toEqual(mockTeacher); // Vérifie la valeur retournée.
    });
    const req = httpMock.expectOne('api/teacher/1'); // URL attendue.
    expect(req.request.method).toBe('GET'); // Requête GET.
    req.flush(mockTeacher); // Simule la réponse.
  });
});
