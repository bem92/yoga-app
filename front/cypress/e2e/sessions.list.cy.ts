// Tests E2E pour la page listant les sessions.
describe('Sessions list', () => {
  // Un administrateur doit voir les sessions ainsi que les actions disponibles.
  it('shows sessions for admin with actions', () => {
    cy.mockLogin('admin') // Mock de la connexion admin.
    cy.mockSessionsList() // Mock de la liste des sessions.
    cy.loginAs('admin') // Connexion via l'interface.
    cy.wait('@getSessions') // Attente des données.
    cy.get('[data-cy="session-title"]').eq(0).should('contain', 'Morning Yoga')
    cy.get('[data-cy="session-title"]').eq(1).should('contain', 'Evening Meditation')
    cy.get('[data-cy="create-session"]') // Bouton de création visible.
    cy.get('[data-cy="edit-button"]') // Bouton d'édition visible.
    cy.get('[data-cy="detail-button"]') // Bouton de détail visible.
  })

  // Un utilisateur simple ne doit pas voir les actions d'administration.
  it('hides admin actions for regular user', () => {
    cy.mockLogin('user')
    cy.mockSessionsList()
    cy.loginAs('user')
    cy.wait('@getSessions')
    cy.get('[data-cy="session-title"]').eq(0).should('contain', 'Morning Yoga')
    cy.get('[data-cy="session-title"]').eq(1).should('contain', 'Evening Meditation')
    cy.get('[data-cy="create-session"]').should('not.exist') // Pas de création.
    cy.get('[data-cy="edit-button"]').should('not.exist') // Pas d'édition.
  })
})
