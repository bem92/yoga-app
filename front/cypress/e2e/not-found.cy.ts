describe('Not found', () => {
  it('shows 404 page', () => {
    cy.visit('/route-inexistante', { failOnStatusCode: false });
    cy.get('[data-cy="not-found-title"]');
  });
});
