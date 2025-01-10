describe('Gestion d\'une tâche', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
  });

  it('Créer une tâche', () => {
    cy.get('input[name="text"]').type('Voici une tâche');
    cy.get('button[type="submit"]').click();

    cy.contains('Voici une tâche').should('exist');
  });

  it('Supprimer une tâche', () => {
    const taskText = 'Voici une tâche spécifique';

    cy.intercept('POST', '/api/todo/add').as('createTodo');

    cy.get('input[name="text"]').type(taskText);
    cy.get('button[type="submit"]').click();

    cy.wait('@createTodo').then((interception) => {
      const responseBody = interception.response.body;
      if (!responseBody || !responseBody._id) {
        throw new Error('La réponse de la requête ne contient pas d\'ID de tâche');
      }
      const taskId = responseBody._id;

      cy.get(`#list li[data-id="${taskId}"]`)
          .should('be.visible');

      cy.get(`#list li[data-id="${taskId}"]`)
          .find('#trashicon')
          .click();

      cy.get('#list').should('not.contain', taskText);
    });
  });

  it('Compléter une tâche', () => {
    const taskText = 'Voici une tâche à compléter';

    cy.intercept('POST', '/api/todo/add').as('createTodo');

    cy.get('input[name="text"]').type(taskText);
    cy.get('button[type="submit"]').click();

    cy.wait('@createTodo').then((interception) => {
      const responseBody = interception.response.body;
      if (!responseBody || !responseBody._id) {
        throw new Error('La réponse de la requête ne contient pas d\'ID de tâche');
      }
      const taskId = responseBody._id;

      cy.get(`#list li[data-id="${taskId}"]`)
          .should('be.visible');

      cy.get(`#list li[data-id="${taskId}"]`)
          .find('input[type="checkbox"]')
          .check();

      cy.get(`#list li[data-id="${taskId}"]`)
          .should('have.class', 'bg-rose-500'); 
    });
  });
});