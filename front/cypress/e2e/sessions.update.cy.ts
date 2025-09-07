// Tests E2E pour la mise à jour d'une session.
describe('Update session', () => {
  it('updates a session', () => {
    cy.mockLogin('admin')
    cy.mockSessionDetail() // Mock des détails de la session.
    cy.mockUpdateSession() // Mock de l'appel de mise à jour.
    cy.mockSessionsList()
    cy.mockTeachers()
    cy.loginAs('admin')
    cy.wait('@getSessions')
    cy.get('[data-cy="edit-button"]').first().click() // Ouvre le formulaire d'édition.
    cy.wait(['@getSession', '@teachers'])
    cy.get('form').within(() => {
      cy.get('[data-cy="name-input"]').clear().type('Updated Yoga')
    })
    cy.get('[data-cy="save-session"]').click()
    cy.wait('@updateSession') // Vérifie l'appel de mise à jour.
  })
})
