import { TestBed } from '@angular/core/testing'; // Outils de test Angular
import { expect } from '@jest/globals'; // Assertions Jest

import { SessionService } from './session.service'; // Service à tester
import { SessionInformation } from '../interfaces/sessionInformation.interface'; // Informations de session

describe('SessionService', () => {
  let service: SessionService; // Instance du service

  beforeEach(() => {
    TestBed.configureTestingModule({}); // Pas de dépendances particulières
    service = TestBed.inject(SessionService); // Récupération du service
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // Vérifie l'instanciation
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
    service.$isLogged().subscribe(value => emitted.push(value)); // On collecte les valeurs émises

    service.logIn(info); // Appel de la méthode à tester

    expect(service.sessionInformation).toEqual(info); // La session doit être stockée
    expect(service.isLogged).toBe(true); // L'utilisateur est connecté
    expect(emitted).toEqual([false, true]); // Flux: initialement false puis true
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
    service.logIn(info); // On connecte d'abord l'utilisateur

    const emitted: boolean[] = [];
    service.$isLogged().subscribe(value => emitted.push(value)); // On collecte les valeurs

    service.logOut(); // Déconnexion

    expect(service.sessionInformation).toBeUndefined(); // Les infos sont supprimées
    expect(service.isLogged).toBe(false); // L'état connecté devient faux
    expect(emitted).toEqual([true, false]); // Flux: true puis false
  });
});
