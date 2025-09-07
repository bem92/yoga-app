// Tests E2E pour la page de profil utilisateur.
describe('Me page', () => {
  context('as regular user', () => {
    beforeEach(() => {
      cy.mockLogin('user')
      cy.mockSessionsList()
      cy.mockUser()
      cy.mockDeleteUser()
      cy.loginAs('user')
      cy.wait('@getSessions')
    })

    it('displays user info, supports back navigation and account deletion', () => {
      cy.get('[data-cy="nav-account"]').click() // Accès au profil.
      cy.contains('p', 'Name: Yoga USER')
      cy.contains('p', 'Email: user@yoga.com')

      cy.get('button[mat-icon-button]').click() // Bouton retour.
      cy.url().should('include', '/sessions')

      cy.get('[data-cy="nav-account"]').click()
      cy.get('button[color="warn"]').click() // Suppression du compte.
      cy.wait('@deleteMe')
      cy.location('pathname', { timeout: 10000 }).should('eq', '/')
      cy.get('[data-cy="nav-login"]').should('exist')
    })
  })

  context('as admin', () => {
    beforeEach(() => {
      cy.mockLogin('admin')
      cy.mockSessionsList()
      cy.intercept('GET', '**/api/user/**', { fixture: 'user.admin.json' }).as('getMeAdmin')
      cy.loginAs('admin')
      cy.wait('@getSessions')
    })

    it('shows admin info without deletion option', () => {
      cy.get('[data-cy="nav-account"]').click()
      cy.contains('p', 'You are admin')
      cy.get('button[color="warn"]').should('not.exist') // Pas de suppression pour admin.
    })
  })
})
