// Custom Cypress commands for the yoga app tests

// login mock + UI
Cypress.Commands.add('mockLogin', (role: 'admin'|'user'='admin') => {
  const fixture = role === 'admin' ? 'auth.admin.json' : 'auth.user.json'
  cy.intercept('POST', '**/api/auth/login', { fixture }).as('login')
})

Cypress.Commands.add('loginAs', (role: 'admin'|'user'='admin') => {
  cy.visit('/login')
  cy.get('form').within(() => {
    cy.get('[data-cy="login-email"]')
      .clear({ force: true })
      .type(role === 'admin' ? 'yoga@studio.com' : 'user@yoga.com', { force: true })
    cy.get('[data-cy="login-password"]').clear({ force: true }).type('test!1234', { force: true })
    cy.get('[data-cy="login-submit"]').should('be.enabled').click()
  })
  cy.wait('@login')
})

// mocks sessions
Cypress.Commands.add('mockSessionsList', () => {
  cy.intercept('GET', '**/api/session', { fixture: 'sessions.list.json' }).as('getSessions')
})
Cypress.Commands.add('mockSessionDetail', () => {
  cy.intercept('GET', '**/api/session/**', { fixture: 'session.detail.json' }).as('getSession')
})
Cypress.Commands.add('mockCreateSession', () => {
  cy.intercept('POST', '**/api/session', (req) => {
    const session = { id: 3, ...req.body }
    req.reply({ statusCode: 201, body: session })
  }).as('createSession')
})
Cypress.Commands.add('mockUpdateSession', () => {
  cy.intercept('PUT', '**/api/session/**', { statusCode: 200, body: { updated: true } }).as('updateSession')
})
Cypress.Commands.add('mockDeleteSession', () => {
  cy.intercept('DELETE', '**/api/session/**', { statusCode: 204 }).as('deleteSession')
})
Cypress.Commands.add('mockTeachers', () => {
  cy.intercept('GET', '**/api/teacher', { fixture: 'teachers.list.json' }).as('teachers')
})
Cypress.Commands.add('mockParticipate', () => {
  cy.intercept('POST', '**/api/session/**/participate/**', { statusCode: 200 }).as('participate')
})
Cypress.Commands.add('mockUnparticipate', () => {
  cy.intercept('DELETE', '**/api/session/**/participate/**', { statusCode: 200 }).as('unparticipate')
})

// mocks user profile
Cypress.Commands.add('mockUser', () => {
  cy.intercept('GET', '**/api/user/**', { fixture: 'user.me.json' }).as('getMe')
})
Cypress.Commands.add('mockDeleteUser', () => {
  cy.intercept('DELETE', '**/api/user/**', { statusCode: 200 }).as('deleteMe')
})

Cypress.Commands.add('verifySessionCreated', (sessionName: string) => {
  cy.url().should('include', '/sessions')
  cy.get('[data-cy="session-title"]').contains(sessionName).should('exist')
})

export {}
