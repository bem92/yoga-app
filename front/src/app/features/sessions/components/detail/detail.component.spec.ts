// Import des utilitaires Angular nécessaires pour simuler l'environnement du composant.
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

// Import des services et interfaces utilisés par le composant.
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from '../../../../interfaces/teacher.interface';

// Composant testé.
import { DetailComponent } from './detail.component';

// Début de la suite de tests pour DetailComponent.
describe('DetailComponent', () => {
  // Session simulée utilisée dans plusieurs tests.
  const mockSession: Session = {
    id: 1,
    name: 'morning session',
    description: 'Yoga for all levels',
    date: new Date('2022-01-01'),
    teacher_id: 1,
    users: [],
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2021-01-02')
  };

  // Enseignant simulé.
  const mockTeacher: Teacher = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe'
  } as Teacher;

  // Fonction utilitaire pour configurer le composant selon le rôle de l'utilisateur et la liste d'utilisateurs.
  async function setup(isAdmin: boolean, users: number[] = []): Promise<ComponentFixture<DetailComponent>> {
    // Mock du service de session indiquant si l'utilisateur est admin.
    const sessionServiceMock = { sessionInformation: { admin: isAdmin, id: 1 } } as Partial<SessionService>;
    // Mock du service API des sessions avec différentes méthodes simulées.
    const sessionApiServiceMock = {
      detail: jest.fn().mockReturnValue(of({ ...mockSession, users })),
      delete: jest.fn().mockReturnValue(of(null)),
      participate: jest.fn().mockReturnValue(of(null)),
      unParticipate: jest.fn().mockReturnValue(of(null))
    } as Partial<SessionApiService>;
    // Mock du service des enseignants.
    const teacherServiceMock = {
      detail: jest.fn().mockReturnValue(of(mockTeacher))
    } as Partial<TeacherService>;

    // Mock de la route activée pour fournir un paramètre id.
    const activatedRouteMock = {
      snapshot: { paramMap: convertToParamMap({ id: '1' }) }
    } as Partial<ActivatedRoute>;

    // Configuration du module de test avec les mocks et modules nécessaires.
    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        FlexLayoutModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(DetailComponent); // Création du composant.
    fixture.detectChanges(); // Initialisation du template.
    return fixture; // Retourne le fixture pour les tests.
  }

  // Après chaque test, on réinitialise le module de test pour éviter les interférences.
  afterEach(() => TestBed.resetTestingModule());

  // Vérifie l'affichage des détails de la session pour un administrateur.
  it('should render session details with delete button for admin', async () => {
    const fixture = await setup(true); // Utilisateur admin.
    const element: HTMLElement = fixture.nativeElement;
    const dateString = mockSession.date.toLocaleDateString('en-US', { dateStyle: 'long' });
    const createdString = mockSession.createdAt!.toLocaleDateString('en-US', { dateStyle: 'long' });
    const updatedString = mockSession.updatedAt!.toLocaleDateString('en-US', { dateStyle: 'long' });

    // Vérifications de l'affichage des différentes informations.
    expect(element.querySelector('h1')?.textContent).toContain('Morning Session');
    expect(element.textContent).toContain('John DOE');
    expect(element.textContent).toContain('Yoga for all levels');
    expect(element.textContent).toContain('0 attendees');
    expect(element.textContent).toContain(dateString);
    expect(element.textContent).toContain(createdString);
    expect(element.textContent).toContain(updatedString);
    expect(element.querySelector('button span.ml1')?.textContent).toContain('Delete');
  });

  // Vérifie que le clic sur Delete déclenche la suppression via le service.
  it('should call delete on sessionApiService when delete button clicked', async () => {
    const fixture = await setup(true);
    const sessionApi = TestBed.inject(SessionApiService) as any; // Service API mocké.
    const router = TestBed.inject(Router); // Router simulé.
    jest.spyOn(router, 'navigate').mockResolvedValue(true); // Empêche la navigation réelle.
    const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]') as HTMLButtonElement;
    deleteButton.click();
    expect(sessionApi.delete).toHaveBeenCalledWith('1'); // Vérifie l'appel du service.
  });

  // Vérifie l'appel à participate lorsque l'utilisateur rejoint une session.
  it('should call participate on sessionApiService when participate button clicked', async () => {
    const fixture = await setup(false, []); // Utilisateur non admin sans participation.
    const sessionApi = TestBed.inject(SessionApiService) as any;
    const participateButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>
    ).find(b => b.textContent?.includes('Participate'))!;
    participateButton.click();
    expect(sessionApi.participate).toHaveBeenCalledWith('1', '1');
  });

  // Vérifie l'appel à unParticipate lorsque l'utilisateur se retire d'une session.
  it('should call unParticipate on sessionApiService when unParticipate button clicked', async () => {
    const fixture = await setup(false, [1]); // L'utilisateur participe déjà.
    const sessionApi = TestBed.inject(SessionApiService) as any;
    const unParticipateButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>
    ).find(b => b.textContent?.includes('Do not participate'))!;
    unParticipateButton.click();
    expect(sessionApi.unParticipate).toHaveBeenCalledWith('1', '1');
  });

  // Vérifie que l'appel à back() fait revenir à la page précédente.
  it('should go back when back() is called', async () => {
    const fixture = await setup(true);
    const component = fixture.componentInstance;
    const backSpy = jest.spyOn(window.history, 'back'); // Espionne l'historique du navigateur.
    component.back();
    expect(backSpy).toHaveBeenCalled();
  });
});

