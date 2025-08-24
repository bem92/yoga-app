describe('Update session', () => {
  it('updates a session', () => {
    cy.mockLogin('admin')
    cy.mockSessionDetail()
    cy.mockUpdateSession()
    cy.mockSessionsList()
    cy.mockTeachers()
    cy.loginAs('admin')
    cy.wait('@getSessions')
    cy.get('[data-cy="edit-button"]').first().click()
    cy.wait(['@getSession', '@teachers'])
    cy.get('form').within(() => {
      cy.get('[data-cy="name-input"]').clear().type('Updated Yoga')
    })
    cy.get('[data-cy="save-session"]').click()
    cy.wait('@updateSession')
  })
})
