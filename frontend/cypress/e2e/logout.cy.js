describe('Se déconnecter d\'un compte', () => {
  beforeEach(() => {
    cy.visit('/register');
    cy.get('input[name="email"]').type('logout@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmation"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.visit('/login');
    cy.get('input[name="email"]').type('logout@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.visit('/');
  });

  it('Se déconnecter du compte actuel', () => {
     cy.get('img[alt="Profile"]').click({ force: true });

    cy.contains('Déconnection').click();

    cy.url().should('include', '/');
  });
});