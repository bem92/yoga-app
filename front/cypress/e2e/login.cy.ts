describe('Login', () => {
  it('logs in successfully', () => {
    cy.mockLogin('admin')
    cy.mockSessionsList()
    cy.visit('/login')
    cy.get('form').within(() => {
      cy.get('[data-cy="login-email"]').type('yoga@studio.com', { force: true })
      cy.get('[data-cy="login-password"]').type('test!1234', { force: true })
      cy.get('[data-cy="login-submit"]').click()
    })
    cy.wait('@login')
    cy.wait('@getSessions')
    cy.url().should('include', '/sessions')
    cy.get('[data-cy="nav-logout"]')
  })

  it('shows error on bad credentials', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Bad credentials' }
    }).as('login')
    cy.visit('/login')
    cy.get('form').within(() => {
      cy.get('[data-cy="login-email"]').type('wrong@yoga.com', { force: true })
      cy.get('[data-cy="login-password"]').type('badpass', { force: true })
      cy.get('[data-cy="login-submit"]').click()
    })
    cy.wait('@login')
    cy.get('[data-cy="login-error"]')
  })
})
