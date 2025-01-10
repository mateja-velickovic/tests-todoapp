describe('Création de compte', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('Affiche le formulaire de création de compte', () => {
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('input[name="confirmation"]').should('exist');
    cy.contains('Créer un compte').should('exist');
  });

  it('Créer un utilisateur valide', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmation"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/login');
  });

  it('Créer un utilisateur déjà existant', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmation"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains('Un compte avec cet email existe déjà!').should('exist');
    cy.url().should('include', '/register');
  });

  it('Créer un utilisateur avec un mot de passe incorrect', () => {
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('123');
    cy.get('input[name="confirmation"]').type('123');
    cy.get('button[type="submit"]').click();

    cy.contains('Le mot de passe doit faire au moins 5 caractères').should('exist');
    cy.url().should('include', '/register');
  });

  it('Créer un utilisateur avec un email incorrect', () => {
    cy.get('input[name="email"]').type('2@');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmation"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains('Format email incorrect').should('exist');
    cy.url().should('include', '/register');
  });
});