describe('Session participation', () => {
  const teacher = { id: 1, firstName: 'John', lastName: 'Doe', createdAt: '2023-08-01', updatedAt: '2023-08-01' }
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
  const sessionWithUser = { ...sessionWithoutUser, users: [1, 2] }

  it('allows participate and unparticipate', () => {
    cy.mockLogin('user')
    cy.mockSessionsList()
    cy.mockParticipate()
    cy.mockUnparticipate()
    cy.intercept('GET', '**/api/session/**', { body: sessionWithoutUser }).as('getSession')
    cy.intercept('GET', '**/api/teacher/**', { body: teacher }).as('teacher')
    cy.loginAs('user')
    cy.wait('@getSessions')
    cy.get('[data-cy="detail-button"]').first().click()
    cy.wait(['@getSession', '@teacher'])
    cy.get('[data-cy="participate-button"]').should('be.visible')

    cy.intercept('GET', '**/api/session/**', { body: sessionWithUser }).as('getSessionAfterJoin')
    cy.get('[data-cy="participate-button"]').click()
    cy.wait(['@participate', '@getSessionAfterJoin'])
    cy.get('[data-cy="unparticipate-button"]').should('be.visible')

    cy.intercept('GET', '**/api/session/**', { body: sessionWithoutUser }).as('getSessionAfterLeave')
    cy.get('[data-cy="unparticipate-button"]').click()
    cy.wait(['@unparticipate', '@getSessionAfterLeave'])
    cy.get('[data-cy="participate-button"]').should('be.visible')
  })
})
