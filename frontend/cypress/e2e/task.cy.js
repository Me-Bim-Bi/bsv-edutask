// =========================================================================
// R8UC1 & R8UC2 – Add and Toggle Todo Items
// =========================================================================
describe('Manipulating the todo list (R8) - Add and Toggle', () => {
  let uid
  let name
  let email

  before(function () {
    cy.cleanupUser()
    cy.createUserFromFixture().then((user) => {
      uid = user.uid
      name = user.name
      email = user.email

      // login and create a single task for all tests
      cy.login(email)
      cy.get('h1').should('contain.text', name)
      cy.get('#title').type('Test task - Gibli')
      cy.get('#url').type('hgUGe1cf3So')
      cy.get('input[value="Create new Task"]').click()
      cy.contains('.title-overlay', 'Test task - Gibli').should('exist')
    })
  })

  beforeEach(function () {
    cy.login(email)
    cy.get('h1').should('contain.text', name)
    cy.contains('.title-overlay', 'Test task - Gibli').click({ force: true })
    cy.get('.popup-inner').should('be.visible')

    // reset: delete any extra todos (keep only the first one)
    cy.get('.todo-item').then(($items) => {
      if ($items.length > 1) {
        for (let i = $items.length - 1; i >= 1; i--) {
          cy.get('.todo-item').eq(i).find('.remover').click()
        }
        cy.get('.close-btn').click({ force: true })
        cy.contains('.title-overlay', 'Test task - Gibli').click({ force: true })
        cy.get('.popup-inner').should('be.visible')
      }
    })

    // reset: if first todo is checked, toggle it back to unchecked
    cy.get('.todo-item').first().find('.checker').then(($checker) => {
      if ($checker.hasClass('checked')) {
        cy.wrap($checker).click()
      }
    })
  })

  it('R8UC1.1 - should append a new todo item without affecting existing items', () => {
    cy.get('.todo-item').should('have.length', 1)
    cy.contains('Watch video').should('be.visible')

    cy.get('.popup-inner .inline-form input[type=text]')
      .type('Listen to the music')
    cy.get('.popup-inner .inline-form input[type=submit]')
      .click()

    cy.get('.todo-item').should('have.length', 2)
    cy.contains('Listen to the music').should('be.visible')
    cy.contains('Watch video').should('be.visible')
  })

  it('R8UC1.2 - should have the Add button disabled when input is empty', () => {
    cy.get('.popup-inner .inline-form input[type=text]')
      .should('have.value', '')

    cy.get('.popup-inner .inline-form input[type=submit]')
      .should('be.disabled')
  })

  it('R8UC1.3 - should not create a todo item when input is empty', () => {
    cy.get('.todo-item').should('have.length', 1)

    cy.get('.popup-inner .inline-form input[type=text]')
      .should('have.value', '')

    cy.get('.popup-inner .inline-form input[type=submit]')
      .click()

    cy.wait(1000)

    cy.get('.todo-item').should('have.length', 1)
    cy.contains('Watch video').should('be.visible')
  })

  it('R8UC2 - should toggle a todo item from active to done and back', () => {
    cy.get('.todo-item').first().find('.checker')
      .should('have.class', 'unchecked')

    cy.get('.todo-item').first().find('.checker').click()

    cy.get('.todo-item').first().find('.checker')
      .should('have.class', 'checked')
    cy.get('.todo-item').first().find('.editable')
      .should('have.css', 'text-decoration')
      .and('contain', 'line-through')

    cy.get('.todo-item').first().find('.checker').click()

    cy.get('.todo-item').first().find('.checker')
      .should('have.class', 'unchecked')
    cy.get('.todo-item').first().find('.editable')
      .should('have.css', 'text-decoration')
      .and('not.contain', 'line-through')
  })

  after(function () {
    cy.cleanupUser()
  })
})

// =========================================================================
// R8UC3 – Delete a Todo Item (separate describe to avoid beforeEach interference)
// =========================================================================
describe('Manipulating the todo list (R8) - Delete', () => {
  let uid
  let name
  let email

  before(function () {
    cy.cleanupUser()
    cy.createUserFromFixture().then((user) => {
      uid = user.uid
      name = user.name
      email = user.email
    })
  })

  it('R8UC3 - should delete a todo item from the list', () => {
    // login
    cy.login(email)
    cy.get('h1').should('contain.text', name)

    // create a fresh task
    cy.get('#title').type('Task for R8UC3 - Beethoven')
    cy.get('#url').type('W-fFHeTX70Q')
    cy.get('input[value="Create new Task"]').click()

    // open task for the first time
    cy.contains('.title-overlay', 'Task for R8UC3 - Beethoven').click({ force: true })
    cy.get('.popup-inner').should('be.visible')

    // precondition: "Watch video" exists
    cy.get('.todo-item').should('have.length', 1)
    cy.contains('Watch video').should('be.visible')

    // delete the todo item
    cy.get('.todo-item').first().find('.remover').click()

    // expected: item should be removed immediately from the list
    cy.get('.todo-item').should('have.length', 0)
    cy.contains('Watch video').should('not.exist')
  })

  after(function () {
    cy.cleanupUser()
  })
})