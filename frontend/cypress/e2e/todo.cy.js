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

    // Intercepter la requête de création de tâche
    cy.intercept('POST', '/api/todo/add').as('createTodo');

    // Créer la tâche
    cy.get('input[name="text"]').type(taskText);
    cy.get('button[type="submit"]').click();

    // Attendre la réponse de la requête et récupérer l'ID de la tâche
    cy.wait('@createTodo').then((interception) => {
      const responseBody = interception.response.body;
      if (!responseBody || !responseBody._id) {
        throw new Error('La réponse de la requête ne contient pas d\'ID de tâche');
      }
      const taskId = responseBody._id;

      // Vérifier que la tâche est visible
      cy.get(`#list li[data-id="${taskId}"]`)
          .should('be.visible');

      // Supprimer la tâche
      cy.get(`#list li[data-id="${taskId}"]`)
          .find('#trashicon')
          .click();

      // Vérifier que la tâche a été supprimée
      cy.get('#list').should('not.contain', taskText);
    });
  });
});