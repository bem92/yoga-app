// Import des utilitaires de test Angular pour créer le composant et son environnement.
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Import de la fonction d'assertion Jest.
import { expect } from '@jest/globals';

// Import du composant que nous allons tester.
import { NotFoundComponent } from './not-found.component';

// Début de la suite de tests pour le composant NotFoundComponent.
describe('NotFoundComponent', () => {
  // Déclaration des variables qui contiendront le composant et son "fixture" (enveloppe de test).
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  // beforeEach est exécuté avant chaque test pour configurer un module de test propre.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotFoundComponent ] // Déclare le composant dans le module de test.
    })
    .compileComponents(); // Compile les composants déclarés.

    fixture = TestBed.createComponent(NotFoundComponent); // Crée une instance du composant pour le test.
    component = fixture.componentInstance; // Récupère l'instance du composant.
    fixture.detectChanges(); // Déclenche la détection de changements pour initialiser le template.
  });

  // Test vérifiant que le message de page introuvable s'affiche.
  it('should render not found message', () => {
    expect(component).toBeTruthy(); // Vérifie que le composant est créé.
    const element: HTMLElement = fixture.nativeElement; // Récupère l'élément HTML rendu.
    expect(element.querySelector('h1')?.textContent).toContain('Page not found !'); // Vérifie la présence du texte attendu.
  });
});
