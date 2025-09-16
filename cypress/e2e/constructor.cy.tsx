/// <reference types="cypress" />

describe('Constructor page', () => {
  const api = '**';

  beforeEach(() => {
    // Clear any existing data before each test
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  afterEach(() => {
    // Clean up fake tokens after each test
    cy.clearLocalStorage();
    cy.clearCookies();
  });

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

    // Check ingredients are added to constructor area specifically
    cy.get('[data-cy="constructor-area"]').within(() => {
      cy.contains('Булка 1 (верх)').should('be.visible');
      cy.contains('Булка 1 (низ)').should('be.visible');
    });

    // Check total price in constructor area
    cy.get('[data-cy="constructor-total"]').within(() => {
      cy.contains('250').should('be.visible');
    });
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
    });
    cy.setCookie('accessToken', 'Bearer fake');

    cy.intercept('POST', `${api}/orders`, { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');

    // Check order modal content specifically within modal
    cy.get('[data-cy="order-modal"]').within(() => {
      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('12345').should('be.visible');
    });

    // Close order modal to see constructor
    cy.get('[data-cy="order-modal"]').within(() => {
      cy.get('[data-cy="modal-close"]').should('exist').click({ force: true });
    });
    cy.get('[data-cy="order-modal"]').should('not.exist');

    // Constructor is cleared after successful order - check in constructor area
    cy.get('[data-cy="constructor-area"]').within(() => {
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
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
    
    // Check ingredient modal content specifically within modal
    cy.get('[data-cy="ingredient-modal"]').within(() => {
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Булка 1').should('be.visible');
    });
    
    // Close modal by clicking close button
    cy.get('[data-cy="modal-close"]').should('exist').click({ force: true });
    cy.get('[data-cy="ingredient-modal"]').should('not.exist');
  });
});


