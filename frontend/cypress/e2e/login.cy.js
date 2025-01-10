describe('Se connecter à un compte', () => {
  beforeEach(() => {
    cy.visit('/register');

    cy.get('input[name="email"]').type('register@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmation"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.visit('/login');
  });

  it('Affiche le formulaire de connexion', () => {
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.contains('Connecter').should('exist');
  });

  it('Se connecter à un utilisateur existant', () => {
    cy.get('input[name="email"]').type('register@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/');
    cy.contains('Ajouter une tâche').should('exist');
  });

  it('Se connecter à un utilisateur non-existant', () => {
    cy.get('input[name="email"]').type('doesntexist@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/login');
    cy.contains('Utilisateur non trouvé').should('exist');
  });
});