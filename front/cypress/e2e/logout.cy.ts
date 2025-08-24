describe('Logout', () => {
  it('logs out the user', () => {
    cy.mockLogin('user')
    cy.mockSessionsList()
    cy.loginAs('user')
    cy.wait('@getSessions')
    cy.get('[data-cy="nav-logout"]').click()
    cy.get('[data-cy="nav-login"]').should('be.visible').click()
    cy.get('[data-cy="login-email"]').should('exist')
  })
})
