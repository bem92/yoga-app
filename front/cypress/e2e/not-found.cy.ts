// Test E2E pour vérifier la page 404.
describe('Not found', () => {
  it('shows 404 page', () => {
    cy.visit('/route-inexistante', { failOnStatusCode: false }); // Visite d'une route inconnue.
    cy.get('[data-cy="not-found-title"]'); // Le titre de la page 404 doit être visible.
  });
});
