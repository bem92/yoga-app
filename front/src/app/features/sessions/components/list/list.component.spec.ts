import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';

import { ListComponent } from './list.component';

describe('ListComponent', () => {

  const mockSessions: Session[] = [{
    id: 1,
    name: 'Morning Session',
    description: 'Yoga for all levels',
    date: new Date('2022-01-01'),
    teacher_id: 1,
    users: []
  }];

  async function setup(isAdmin: boolean): Promise<ComponentFixture<ListComponent>> {
    const sessionServiceMock = { sessionInformation: { admin: isAdmin } } as Partial<SessionService>;
    const sessionApiServiceMock = { all: () => of(mockSessions) } as Partial<SessionApiService>;

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        FlexLayoutModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: SessionApiService, useValue: sessionApiServiceMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(ListComponent);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => TestBed.resetTestingModule());

  it('should render sessions with create and detail buttons for admin', async () => {
    const fixture = await setup(true);
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelectorAll('.items .item').length).toBe(mockSessions.length);
    expect(element.querySelector('mat-card-header button')?.textContent).toContain('Create');
    expect(element.querySelector('.item mat-card-actions button')?.textContent).toContain('Detail');
  });

  it('should hide create button for non-admin user', async () => {
    const fixture = await setup(false);
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('mat-card-header button')).toBeNull();
    expect(element.querySelectorAll('.item mat-card-actions button').length).toBe(1);
    expect(element.querySelector('.item mat-card-actions button')?.textContent).toContain('Detail');
  });
});

