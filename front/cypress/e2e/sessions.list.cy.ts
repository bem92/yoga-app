describe('Sessions list', () => {
  it('shows sessions for admin with actions', () => {
    cy.mockLogin('admin')
    cy.mockSessionsList()
    cy.loginAs('admin')
    cy.wait('@getSessions')
    cy.get('[data-cy="session-title"]').eq(0).should('contain', 'Morning Yoga')
    cy.get('[data-cy="session-title"]').eq(1).should('contain', 'Evening Meditation')
    cy.get('[data-cy="create-session"]')
    cy.get('[data-cy="edit-button"]')
    cy.get('[data-cy="detail-button"]')
  })

  it('hides admin actions for regular user', () => {
    cy.mockLogin('user')
    cy.mockSessionsList()
    cy.loginAs('user')
    cy.wait('@getSessions')
    cy.get('[data-cy="session-title"]').eq(0).should('contain', 'Morning Yoga')
    cy.get('[data-cy="session-title"]').eq(1).should('contain', 'Evening Meditation')
    cy.get('[data-cy="create-session"]').should('not.exist')
    cy.get('[data-cy="edit-button"]').should('not.exist')
  })
})
