import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';

import { MeComponent } from './me.component';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  } as Partial<SessionService>;

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

  const mockUserService = {
    getById: () => of(mockUser)
  } as Partial<UserService>;

  const matSnackBarMock = { open: jest.fn() };

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

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('should display user information', () => {
    expect(component).toBeTruthy();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h1')?.textContent).toContain('User information');
    expect(element.textContent).toContain('Name: John DOE');
    expect(element.textContent).toContain('Email: john.doe@example.com');
    expect(element.textContent).toContain('You are admin');
  });
});
