import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
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

import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiService: jest.Mocked<SessionApiService>;
  let matSnackBar: jest.Mocked<MatSnackBar>;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  };
  const sessionApiServiceMock = {
    create: jest.fn(),
    update: jest.fn(),
    detail: jest.fn()
  } as unknown as jest.Mocked<SessionApiService>;
  const teacherServiceMock = {
    all: jest.fn().mockReturnValue(of([{ id: 1, firstName: 'John', lastName: 'Doe' }]))
  } as unknown as TeacherService;
  const matSnackBarMock = { open: jest.fn() } as unknown as MatSnackBar;

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

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService) as jest.Mocked<SessionApiService>;
    matSnackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    jest.clearAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a session and show feedback', fakeAsync(() => {
    sessionApiService.create.mockReturnValue(of({} as any));

    const nativeElement = fixture.debugElement.nativeElement;
    const nameInput = nativeElement.querySelector('input[formControlName="name"]');
    const dateInput = nativeElement.querySelector('input[formControlName="date"]');
    const descriptionInput = nativeElement.querySelector('textarea[formControlName="description"]');

    nameInput.value = 'Yoga';
    nameInput.dispatchEvent(new Event('input'));
    dateInput.value = '2023-08-22';
    dateInput.dispatchEvent(new Event('input'));
    component.sessionForm?.get('teacher_id')?.setValue(1);
    descriptionInput.value = 'Desc';
    descriptionInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    tick();
    fixture.detectChanges();

    expect(sessionApiService.create).toHaveBeenCalledWith({
      name: 'Yoga',
      date: '2023-08-22',
      teacher_id: 1,
      description: 'Desc'
    });
    expect(matSnackBar.open).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
  }));

  it('should update a session when in edit mode', fakeAsync(() => {
    sessionApiService.update.mockReturnValue(of({} as any));
    component.onUpdate = true;
    (component as any).id = '1';

    const nativeElement = fixture.debugElement.nativeElement;
    const nameInput = nativeElement.querySelector('input[formControlName="name"]');
    const dateInput = nativeElement.querySelector('input[formControlName="date"]');
    const descriptionInput = nativeElement.querySelector('textarea[formControlName="description"]');

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

    expect(sessionApiService.update).toHaveBeenCalledWith('1', {
      name: 'Yoga',
      date: '2023-08-23',
      teacher_id: 1,
      description: 'Updated'
    });
    expect(matSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
    expect(sessionApiService.create).not.toHaveBeenCalled();
  }));

  it('should redirect to sessions if user is not admin', () => {
    mockSessionService.sessionInformation.admin = false;
    const localFixture = TestBed.createComponent(FormComponent);
    localFixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
    mockSessionService.sessionInformation.admin = true;
  });

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

    expect(nameInput.classList).toContain('ng-invalid');
    expect(dateInput.classList).toContain('ng-invalid');
    expect(teacherSelect.classList).toContain('ng-invalid');
    expect(descriptionInput.classList).toContain('ng-invalid');
    expect(submitButton.disabled).toBe(true);

    nameInput.value = 'Yoga';
    nameInput.dispatchEvent(new Event('input'));
    dateInput.value = '2023-08-22';
    dateInput.dispatchEvent(new Event('input'));
    component.sessionForm?.get('teacher_id')?.setValue(1);
    descriptionInput.value = 'Desc';
    descriptionInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(nameInput.classList).toContain('ng-valid');
    expect(dateInput.classList).toContain('ng-valid');
    expect(teacherSelect.classList).toContain('ng-valid');
    expect(descriptionInput.classList).toContain('ng-valid');
    expect(submitButton.disabled).toBe(false);
  });
});
