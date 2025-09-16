/// <reference types="cypress" />

describe('Constructor page', () => {
  const api = '**';

  it('adds bun and main to constructor and updates total', () => {
    cy.intercept('GET', `${api}/auth/user`, {
      statusCode: 401,
      body: { message: 'not authorized' }
    }).as('getUser');
    cy.intercept('GET', `${api}/ingredients`, { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.contains('Соберите бургер').should('be.visible');

    // Add bun from Булки section
    cy.contains('h3', 'Булки')
      .next('ul')
      .find('button')
      .contains('Добавить')
      .first()
      .click();

    // Add main from Начинки section
    cy.contains('h3', 'Начинки')
      .next('ul')
      .find('button')
      .contains('Добавить')
      .first()
      .click();

    cy.contains('Булка 1 (верх)').should('be.visible');
    cy.contains('Булка 1 (низ)').should('be.visible');

    cy.contains('250').should('be.visible');
  });

  it('creates order when user is authenticated and clears constructor', () => {
    // Prepare app state: add items first
    cy.intercept('GET', `${api}/auth/user`, { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('GET', `${api}/ingredients`, { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');

    // Add bun and main
    cy.contains('h3', 'Булки')
      .next('ul')
      .find('button')
      .contains('Добавить')
      .first()
      .click();
    cy.contains('h3', 'Начинки')
      .next('ul')
      .find('button')
      .contains('Добавить')
      .first()
      .click();

    // Set fake tokens before creating order
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'fake-refresh');
      win.document.cookie = 'accessToken=Bearer fake; path=/;';
    });

    cy.intercept('POST', `${api}/orders`, { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    cy.contains('идентификатор заказа').should('be.visible');
    cy.contains('12345').should('be.visible');

    // Close order modal to see constructor
    cy.get('[data-cy="modal-close"]').should('exist');
    cy.get('[data-cy="modal-root"]').should('exist');
    cy.get('[data-cy="modal-close"]').click({ force: true });
    cy.contains('идентификатор заказа').should('not.exist');

    // Constructor is cleared after successful order
    cy.contains('Выберите булки').should('be.visible');
    cy.contains('Выберите начинку').should('be.visible');

    // Cleanup tokens
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
      win.document.cookie = 'accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    });
  });

  it('opens ingredient modal from constructor and closes it with correct data', () => {
    cy.intercept('GET', `${api}/auth/user`, {
      statusCode: 401,
      body: { message: 'not authorized' }
    });
    cy.intercept('GET', `${api}/ingredients`, { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.get('a[href^="/ingredients/"]').first().click();
    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains('Булка 1').should('be.visible');
    // Close modal by navigating back
    cy.get('[data-cy="modal-close"]').should('exist').click({ force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
});


