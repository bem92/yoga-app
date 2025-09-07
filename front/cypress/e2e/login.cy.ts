// Suite de tests End-to-End pour la page de connexion.
describe('Connexion', () => {
  // Cas de connexion réussie.
  it('se connecte avec succès', () => {
    cy.mockLogin('admin') // Mock de la requête de login avec un profil admin.
    cy.mockSessionsList() // Mock de la récupération des sessions.
    cy.visit('/login') // Ouverture de la page de connexion.
    cy.get('form').within(() => {
      // Remplit le formulaire avec les identifiants.
      cy.get('[data-cy="login-email"]').type('yoga@studio.com', { force: true })
      cy.get('[data-cy="login-password"]').type('test!1234', { force: true })
      cy.get('[data-cy="login-submit"]').click() // Soumission du formulaire.
    })
    cy.wait('@login') // Attente de l'appel réseau mocké.
    cy.wait('@getSessions') // Attente de la récupération des sessions.
    cy.url().should('include', '/sessions') // Vérifie la redirection vers la page des sessions.
    cy.get('[data-cy="nav-logout"]') // Vérifie que le bouton de déconnexion est présent.
  })

  // Cas d'erreur lorsque les identifiants sont incorrects.
  it('affiche une erreur avec de mauvaises informations', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Bad credentials' }
    }).as('login') // Interception de l'appel de login pour renvoyer une erreur.
    cy.visit('/login')
    cy.get('form').within(() => {
      cy.get('[data-cy="login-email"]').type('wrong@yoga.com', { force: true })
      cy.get('[data-cy="login-password"]').type('badpass', { force: true })
      cy.get('[data-cy="login-submit"]').click()
    })
    cy.wait('@login')
    cy.get('[data-cy="login-error"]') // Vérifie que le message d'erreur est affiché.
  })

  // Vérifie que le formulaire doit être valide pour activer le bouton de soumission.
  it("requiert un formulaire valide avant d'activer la soumission", () => {
    cy.visit('/login')
    cy.get('[data-cy="login-submit"]').should('be.disabled') // Bouton désactivé au départ.
    cy.get('[data-cy="login-email"]').type('not-an-email', { force: true })
    cy.get('[data-cy="login-password"]').type('12', { force: true })
    cy.get('[data-cy="login-submit"]').should('be.disabled') // Toujours désactivé avec des données invalides.
  })

  // Vérifie l'option d'affichage du mot de passe.
  it('bascule la visibilité du mot de passe', () => {
    cy.visit('/login')
    cy.get('[data-cy="login-password"]').should('have.attr', 'type', 'password')
    cy.get('button[mat-icon-button]').click() // Clique sur l'icône pour afficher/masquer.
    cy.get('[data-cy="login-password"]').should('have.attr', 'type', 'text')
  })
})
