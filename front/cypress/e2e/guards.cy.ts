describe('Route guards', () => {
  it('redirects unauthenticated users to login', () => {
    cy.visit('/sessions');
    cy.url().should('include', '/login');
  });

  context('authenticated user', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          token: 'FAKE_JWT',
          type: 'Bearer',
          id: 1,
          username: 'yoga@studio.com',
          firstName: 'Yoga',
          lastName: 'Studio',
          admin: true,
        },
      }).as('login');
      cy.intercept('GET', '/api/session*', { statusCode: 200, body: [] }).as('getSessions');
    });

    it('prevents authenticated users from accessing auth pages', () => {
      cy.visit('/login');
      cy.get('[data-cy="login-email"]')
        .clear()
        .type('yoga@studio.com')
        .should('have.value', 'yoga@studio.com');
      cy.get('[data-cy="login-password"]')
        .clear()
        .type('test!1234')
        .should('have.value', 'test!1234');
      cy.get('[data-cy="login-submit"]').should('not.be.disabled').click();
      cy.wait('@login');
      cy.location('pathname', { timeout: 10000 }).should('eq', '/sessions');
      cy.wait('@getSessions');
      cy.window().then((win) => {
        win.history.pushState({}, '', '/login');
        win.dispatchEvent(new PopStateEvent('popstate'));
      });
      cy.location('pathname').should('not.eq', '/login');
    });
  });
});
