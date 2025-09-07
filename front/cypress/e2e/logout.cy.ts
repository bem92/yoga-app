// Tests E2E pour la déconnexion.
describe('Logout', () => {
  it('logs out the user', () => {
    cy.mockLogin('user')
    cy.mockSessionsList()
    cy.loginAs('user')
    cy.wait('@getSessions')
    cy.get('[data-cy="nav-logout"]').click() // Clique sur déconnexion.
    cy.get('[data-cy="nav-login"]').should('be.visible').click() // Le bouton de connexion apparaît.
    cy.get('[data-cy="login-email"]').should('exist') // Retour à la page de login.
  })
})
