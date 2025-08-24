describe('Register', () => {
  it('registers a new user', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      fixture: 'auth.user.json'
    }).as('register')
    cy.visit('/register')
    cy.get('form').within(() => {
      cy.get('[data-cy="register-first-name"]').type('John', { force: true })
      cy.get('[data-cy="register-last-name"]').type('Doe', { force: true })
      cy.get('[data-cy="register-email"]').type('john@doe.com', { force: true })
      cy.get('[data-cy="register-password"]').type('test!1234', { force: true })
      cy.get('[data-cy="register-submit"]').click()
    })
    cy.wait('@register')
    cy.url().should('include', '/login')
  })

  it('shows validation errors', () => {
    cy.visit('/register')
    cy.get('form').within(() => {
      cy.get('[data-cy="register-email"]').type('invalid', { force: true }).blur({ force: true }).should('have.class','ng-invalid')
      cy.get('[data-cy="register-first-name"]').focus({ force: true }).blur({ force: true })
      cy.get('[data-cy="register-submit"]').should('be.disabled')
    })
  })
})
