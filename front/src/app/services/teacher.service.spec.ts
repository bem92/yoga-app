import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should retrieve all teachers', () => {
    const mockTeachers: Teacher[] = [{ id: 1, firstName: 't', lastName: 't' } as Teacher];
    service.all().subscribe(res => {
      expect(res).toEqual(mockTeachers);
    });
    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
  });

  it('should retrieve teacher detail', () => {
    const mockTeacher: Teacher = { id: 1, firstName: 't', lastName: 't' } as Teacher;
    service.detail('1').subscribe(res => {
      expect(res).toEqual(mockTeacher);
    });
    const req = httpMock.expectOne('api/teacher/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeacher);
  });
});
