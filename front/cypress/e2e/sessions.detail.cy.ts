// Tests E2E pour la page de détail d'une session.
describe('Session detail', () => {
  it('renders details and deletes session as admin', () => {
    cy.mockLogin('admin')
    cy.mockSessionDetail() // Mock du détail de session.
    cy.mockSessionsList()
    cy.mockDeleteSession() // Mock de la suppression.
    cy.intercept('GET', '**/api/teacher/**', {
      body: { id: 1, firstName: 'John', lastName: 'Doe', createdAt: '2023-08-01', updatedAt: '2023-08-01' }
    }).as('teacher')
    cy.loginAs('admin')
    cy.wait('@getSessions')
    cy.get('[data-cy="detail-button"]').first().click() // Ouvre le détail de la session.
    cy.wait(['@getSession', '@teacher'])
    cy.get('[data-cy="session-title"]').should('contain', 'Morning Yoga')
    cy.get('[data-cy="delete-session"]').should('be.visible')
    cy.get('[data-cy="delete-session"]').click() // Supprime la session.
    cy.wait(['@deleteSession', '@getSessions'])
    cy.url().should('include', '/sessions') // Retour à la liste des sessions.
  })
})
