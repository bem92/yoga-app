import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all sessions', () => {
    const mockSessions: Session[] = [
      { id: 1, name: 's1', description: 'd1', date: new Date(), teacher_id: 1, users: [] }
    ];

    service.all().subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  it('should get session detail', () => {
    const mockSession: Session = { id: 1, name: 's1', description: 'd1', date: new Date(), teacher_id: 1, users: [] };

    service.detail('1').subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should create a session', () => {
    const newSession: Session = { name: 's1', description: 'd1', date: new Date(), teacher_id: 1, users: [] };

    service.create(newSession).subscribe((session) => {
      expect(session).toEqual(newSession);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    req.flush(newSession);
  });

  it('should update a session', () => {
    const updatedSession: Session = { name: 's1', description: 'd1', date: new Date(), teacher_id: 1, users: [] };

    service.update('1', updatedSession).subscribe((session) => {
      expect(session).toEqual(updatedSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedSession);
  });

  it('should participate to a session', () => {
    service.participate('1', '2').subscribe((res) => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne('api/session/1/participate/2');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should unparticipate from a session', () => {
    service.unParticipate('1', '2').subscribe((res) => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne('api/session/1/participate/2');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
