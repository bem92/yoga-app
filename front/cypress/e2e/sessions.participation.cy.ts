// Suite de tests E2E pour la participation à une session.
describe('Session participation', () => {
  // Mock d'un enseignant renvoyé par l'API.
  const teacher = { id: 1, firstName: 'John', lastName: 'Doe', createdAt: '2023-08-01', updatedAt: '2023-08-01' }
  // Session initiale où l'utilisateur n'est pas inscrit.
  const sessionWithoutUser = {
    id: 1,
    name: 'Morning Yoga',
    description: 'Start your day right',
    date: '2023-09-01',
    teacher_id: 1,
    users: [1],
    createdAt: '2023-08-01',
    updatedAt: '2023-08-01'
  }
  // Session après inscription de l'utilisateur.
  const sessionWithUser = { ...sessionWithoutUser, users: [1, 2] }

  // Test complet de participation puis de désinscription.
  it('allows participate and unparticipate', () => {
    cy.mockLogin('user') // Mock de l'authentification.
    cy.mockSessionsList() // Mock de la liste des sessions.
    cy.mockParticipate() // Mock de l'appel de participation.
    cy.mockUnparticipate() // Mock de l'appel de désinscription.
    cy.intercept('GET', '**/api/session/**', { body: sessionWithoutUser }).as('getSession') // Détail de session.
    cy.intercept('GET', '**/api/teacher/**', { body: teacher }).as('teacher') // Détail de l'enseignant.
    cy.loginAs('user') // Connexion de l'utilisateur.
    cy.wait('@getSessions') // Attente de la liste des sessions.
    cy.get('[data-cy="detail-button"]').first().click() // Ouvre le détail de la première session.
    cy.wait(['@getSession', '@teacher']) // Attente des détails.
    cy.get('[data-cy="participate-button"]').should('be.visible') // Bouton de participation visible.

    cy.intercept('GET', '**/api/session/**', { body: sessionWithUser }).as('getSessionAfterJoin')
    cy.get('[data-cy="participate-button"]').click() // Clique pour participer.
    cy.wait(['@participate', '@getSessionAfterJoin']) // Attente de la confirmation.
    cy.get('[data-cy="unparticipate-button"]').should('be.visible') // Bouton de désinscription visible.

    cy.intercept('GET', '**/api/session/**', { body: sessionWithoutUser }).as('getSessionAfterLeave')
    cy.get('[data-cy="unparticipate-button"]').click() // Clique pour se désinscrire.
    cy.wait(['@unparticipate', '@getSessionAfterLeave']) // Attente de la confirmation.
    cy.get('[data-cy="participate-button"]').should('be.visible') // Bouton de participation visible à nouveau.
  })
})
