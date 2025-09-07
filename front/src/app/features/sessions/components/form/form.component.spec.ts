// Import des modules nécessaires pour tester le composant de formulaire.
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { of } from 'rxjs';

// Composant testé.
import { FormComponent } from './form.component';

// Suite de tests pour FormComponent.
describe('FormComponent', () => {
  let component: FormComponent; // Instance du composant.
  let fixture: ComponentFixture<FormComponent>; // Enveloppe du composant.
  let sessionApiService: jest.Mocked<SessionApiService>; // Service API mocké.
  let matSnackBar: jest.Mocked<MatSnackBar>; // Service de notification mocké.
  let router: Router; // Router Angular.

  // Mock du service de session indiquant que l'utilisateur est admin.
  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  };
  // Mock du service API pour les sessions.
  const sessionApiServiceMock = {
    create: jest.fn(),
    update: jest.fn(),
    detail: jest.fn()
  } as unknown as jest.Mocked<SessionApiService>;
  // Mock du service des enseignants.
  const teacherServiceMock = {
    all: jest.fn().mockReturnValue(of([{ id: 1, firstName: 'John', lastName: 'Doe' }]))
  } as unknown as TeacherService;
  // Mock du MatSnackBar pour intercepter les messages.
  const matSnackBarMock = { open: jest.fn() } as unknown as MatSnackBar;

  // Configuration du module de test avant chaque test.
  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: TeacherService, useValue: teacherServiceMock },
        { provide: MatSnackBar, useValue: matSnackBarMock }
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent); // Création du composant.
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService) as jest.Mocked<SessionApiService>;
    matSnackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true); // Empêche la navigation réelle.
    jest.clearAllMocks();
    fixture.detectChanges(); // Initialisation du template.
  });

  // Vérifie la création du composant.
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test de création d'une session et d'affichage d'un message.
  it('should create a session and show feedback', fakeAsync(() => {
    sessionApiService.create.mockReturnValue(of({} as any)); // Simule une réponse OK.

    const nativeElement = fixture.debugElement.nativeElement;
    const nameInput = nativeElement.querySelector('input[formControlName="name"]');
    const dateInput = nativeElement.querySelector('input[formControlName="date"]');
    const descriptionInput = nativeElement.querySelector('textarea[formControlName="description"]');

    // Remplissage du formulaire.
    nameInput.value = 'Yoga';
    nameInput.dispatchEvent(new Event('input'));
    dateInput.value = '2023-08-22';
    dateInput.dispatchEvent(new Event('input'));
    component.sessionForm?.get('teacher_id')?.setValue(1);
    descriptionInput.value = 'Desc';
    descriptionInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    nativeElement.querySelector('form').dispatchEvent(new Event('submit')); // Soumission du formulaire.
    tick();
    fixture.detectChanges();

    // Vérifie l'appel au service et le message affiché.
    expect(sessionApiService.create).toHaveBeenCalledWith({
      name: 'Yoga',
      date: '2023-08-22',
      teacher_id: 1,
      description: 'Desc'
    });
    expect(matSnackBar.open).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
  }));

  // Test de mise à jour d'une session existante.
  it('should update a session when in edit mode', fakeAsync(() => {
    sessionApiService.update.mockReturnValue(of({} as any));
    component.onUpdate = true; // Active le mode édition.
    (component as any).id = '1';

    const nativeElement = fixture.debugElement.nativeElement;
    const nameInput = nativeElement.querySelector('input[formControlName="name"]');
    const dateInput = nativeElement.querySelector('input[formControlName="date"]');
    const descriptionInput = nativeElement.querySelector('textarea[formControlName="description"]');

    // Remplissage du formulaire avec de nouvelles valeurs.
    nameInput.value = 'Yoga';
    nameInput.dispatchEvent(new Event('input'));
    dateInput.value = '2023-08-23';
    dateInput.dispatchEvent(new Event('input'));
    component.sessionForm?.get('teacher_id')?.setValue(1);
    descriptionInput.value = 'Updated';
    descriptionInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    tick();
    fixture.detectChanges();

    // Vérifie l'appel au service de mise à jour et le message de confirmation.
    expect(sessionApiService.update).toHaveBeenCalledWith('1', {
      name: 'Yoga',
      date: '2023-08-23',
      teacher_id: 1,
      description: 'Updated'
    });
    expect(matSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
    expect(sessionApiService.create).not.toHaveBeenCalled();
  }));

  // Vérifie la redirection si l'utilisateur n'est pas administrateur.
  it('should redirect to sessions if user is not admin', () => {
    mockSessionService.sessionInformation.admin = false; // Force un utilisateur non admin.
    const localFixture = TestBed.createComponent(FormComponent);
    localFixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
    mockSessionService.sessionInformation.admin = true;
  });

  // Charge les détails d'une session lors de l'édition.
  it('should load session details when editing', fakeAsync(() => {
    const session = { id: 1, name: 'Yoga', date: '2023-08-22', teacher_id: 1, description: 'Desc' } as any;
    sessionApiService.detail.mockReturnValue(of(session));
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/update/1');
    const route = TestBed.inject(ActivatedRoute);
    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('1');

    const localFixture = TestBed.createComponent(FormComponent);
    const localComponent = localFixture.componentInstance;
    localFixture.detectChanges();
    tick();
    localFixture.detectChanges();

    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    expect(localComponent.onUpdate).toBe(true);
    expect(localComponent.sessionForm?.value).toEqual({
      name: 'Yoga',
      date: '2023-08-22',
      teacher_id: 1,
      description: 'Desc'
    });
  }));

  // Vérifie les erreurs de validation du formulaire.
  it('should display validation errors for invalid fields', () => {
    const nativeElement = fixture.debugElement.nativeElement;
    const nameInput = nativeElement.querySelector('input[formControlName="name"]');
    const dateInput = nativeElement.querySelector('input[formControlName="date"]');
    const teacherSelect = nativeElement.querySelector('mat-select');
    const descriptionInput = nativeElement.querySelector('textarea[formControlName="description"]');
    const submitButton = nativeElement.querySelector('button[type="submit"]');

    submitButton.click();
    component.sessionForm?.markAllAsTouched();
    fixture.detectChanges();

    // Les champs doivent être invalides au départ.
    expect(nameInput.classList).toContain('ng-invalid');
    expect(dateInput.classList).toContain('ng-invalid');
    expect(teacherSelect.classList).toContain('ng-invalid');
    expect(descriptionInput.classList).toContain('ng-invalid');
    expect(submitButton.disabled).toBe(true);

    // Remplit le formulaire pour corriger les erreurs.
    nameInput.value = 'Yoga';
    nameInput.dispatchEvent(new Event('input'));
    dateInput.value = '2023-08-22';
    dateInput.dispatchEvent(new Event('input'));
    component.sessionForm?.get('teacher_id')?.setValue(1);
    descriptionInput.value = 'Desc';
    descriptionInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Les champs doivent maintenant être valides.
    expect(nameInput.classList).toContain('ng-valid');
    expect(dateInput.classList).toContain('ng-valid');
    expect(teacherSelect.classList).toContain('ng-valid');
    expect(descriptionInput.classList).toContain('ng-valid');
    expect(submitButton.disabled).toBe(false);
  });
});
