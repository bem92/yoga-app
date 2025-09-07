// Tests E2E pour la création d'une session.
describe('Create session', () => {
  it('creates a session', () => {
    cy.mockLogin('admin') // Mock de l'authentification admin.
    cy.mockCreateSession() // Mock de l'API de création.
    cy.mockSessionsList() // Mock de la liste initiale.
    cy.mockTeachers() // Mock de la liste d'enseignants.
    cy.loginAs('admin')
    cy.wait('@getSessions')
    cy.intercept('GET', '**/api/session', { fixture: 'sessions.list.after-create.json' }).as(
      'getSessionsAfterCreation'
    )
    cy.get('[data-cy="create-session"]').click() // Accès au formulaire de création.
    cy.wait('@teachers')
    cy.get('[data-cy="name-input"]').type('Morning Flow')
    cy.get('[data-cy="description-input"]').type('Nice session')
    cy.get('[data-cy="date-input"]').type('2024-09-01')
    cy.get('[data-cy="teacher-select"]').click()
    cy.get('[data-cy="teacher-option-1"]').click()
    cy.get('[data-cy="save-session"]').click() // Soumission du formulaire.
    cy.wait(['@createSession', '@getSessionsAfterCreation'])
    cy.verifySessionCreated('Morning Flow') // Vérifie la présence de la nouvelle session.
  })
})
