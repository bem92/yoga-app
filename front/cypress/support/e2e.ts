import './commands'
import '@cypress/code-coverage/support'

// Ne fais AUCUN login global ici. Pas de beforeEach qui tape des inputs.
declare global {
  namespace Cypress {
    interface Chainable {
      mockLogin(role?: 'admin'|'user'): Chainable<void>
      loginAs(role?: 'admin'|'user'): Chainable<void>
      mockSessionsList(): Chainable<void>
      mockSessionDetail(): Chainable<void>
      mockCreateSession(): Chainable<void>
      mockUpdateSession(): Chainable<void>
      mockDeleteSession(): Chainable<void>
      mockTeachers(): Chainable<void>
      mockParticipate(): Chainable<void>
      mockUnparticipate(): Chainable<void>
      mockUser(): Chainable<void>
      mockDeleteUser(): Chainable<void>
    }
  }
}

export {}
