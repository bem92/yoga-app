import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('logIn updates state and emits true', () => {
    const info: SessionInformation = {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'john',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    };
    const emitted: boolean[] = [];
    service.$isLogged().subscribe(value => emitted.push(value));

    service.logIn(info);

    expect(service.sessionInformation).toEqual(info);
    expect(service.isLogged).toBe(true);
    expect(emitted).toEqual([false, true]);
  });

  it('logOut resets state and emits false', () => {
    const info: SessionInformation = {
      token: 'token',
      type: 'Bearer',
      id: 1,
      username: 'john',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
    };
    service.logIn(info);

    const emitted: boolean[] = [];
    service.$isLogged().subscribe(value => emitted.push(value));

    service.logOut();

    expect(service.sessionInformation).toBeUndefined();
    expect(service.isLogged).toBe(false);
    expect(emitted).toEqual([true, false]);
  });
});
