describe('Manipulating the todo list (R8)', () => {
  let uid
  let name
  let email

  before(function () {
    // cleanup and create user
    cy.cleanupUser()
    cy.createUserFromFixture().then((user) => {
      uid = user.uid
      name = user.name
      email = user.email

      // login and create a single task for all tests
      cy.login(email)
      cy.get('h1').should('contain.text', name)
      cy.get('#title').type('Test Task')
      cy.get('#url').type('dQw4w9WgXcQ')
      cy.get('input[value="Create new Task"]').click()
      cy.contains('.title-overlay', 'Test Task').should('exist')
    })
  })

  beforeEach(function () {
    // login and open the existing task
    cy.login(email)
    cy.get('h1').should('contain.text', name)
    cy.contains('.title-overlay', 'Test Task').click({ force: true })
    cy.get('.popup-inner').should('be.visible')

    // reset: delete any extra todos (keep only the first one)
    cy.get('.todo-item').then(($items) => {
      if ($items.length > 1) {
        for (let i = $items.length - 1; i >= 1; i--) {
          cy.get('.todo-item').eq(i).find('.remover').click()
        }
        // close and reopen popup to refresh the list
        cy.get('.close-btn').click({ force: true })
        cy.contains('.title-overlay', 'Test Task').click({ force: true })
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

  // =========================================================================
  // R8UC1.1 – Append a New Todo Item
  // =========================================================================
  it('R8UC1.1 - should append a new todo item without affecting existing items', () => {
    // precondition: default todo "Watch video" exists
    cy.get('.todo-item').should('have.length', 1)
    cy.contains('Watch video').should('be.visible')

    // add a new todo item
    cy.get('.popup-inner .inline-form input[type=text]')
      .type('Take notes on key concepts')
    cy.get('.popup-inner .inline-form input[type=submit]')
      .click()

    // expected: new item appended, existing item unchanged
    cy.get('.todo-item').should('have.length', 2)
    cy.contains('Take notes on key concepts').should('be.visible')
    cy.contains('Watch video').should('be.visible')
  })

  // =========================================================================
  // R8UC1.2 – Add Button Validation (Empty Input)
  // =========================================================================
  it('R8UC1.2 - should have the Add button disabled when input is empty', () => {
    // precondition: input field is empty
    cy.get('.popup-inner .inline-form input[type=text]')
      .should('have.value', '')

    // expected: Add button is disabled
    cy.get('.popup-inner .inline-form input[type=submit]')
      .should('be.disabled')
  })

  // =========================================================================
  // R8UC1.3 – Prevent Adding Empty Todo Item
  // =========================================================================
  it('R8UC1.3 - should not create a todo item when input is empty', () => {
    // precondition: default todo exists
    cy.get('.todo-item').should('have.length', 1)

    // ensure input is empty and attempt to click Add (force click even if disabled)
    cy.get('.popup-inner .inline-form input[type=text]')
      .should('have.value', '')
    cy.get('.popup-inner .inline-form input[type=submit]')
      .click({ force: true })

    // expected: no new todo item added, existing item unchanged
    cy.get('.todo-item').should('have.length', 1)
    cy.contains('Watch video').should('be.visible')
  })

  // =========================================================================
  // R8UC2 – Toggle Todo Item Status
  // =========================================================================
  it('R8UC2 - should toggle a todo item from active to done and back', () => {
    // precondition: "Watch video" is active (unchecked)
    cy.get('.todo-item').first().find('.checker')
      .should('have.class', 'unchecked')

    // toggle active → done
    cy.get('.todo-item').first().find('.checker').click()

    // expected: item is done (checked, struck through)
    cy.get('.todo-item').first().find('.checker')
      .should('have.class', 'checked')
    cy.get('.todo-item').first().find('.editable')
      .should('have.css', 'text-decoration')
      .and('contain', 'line-through')

    // toggle done → active
    cy.get('.todo-item').first().find('.checker').click()

    // expected: item is active again (unchecked, not struck through)
    cy.get('.todo-item').first().find('.checker')
      .should('have.class', 'unchecked')
    cy.get('.todo-item').first().find('.editable')
      .should('have.css', 'text-decoration')
      .and('not.contain', 'line-through')
  })

  // =========================================================================
  // R8UC3 – Delete a Todo Item
  // =========================================================================
  it('R8UC3 - should delete a todo item from the list', () => {
    // precondition: "Watch video" exists
    cy.get('.todo-item').should('have.length', 1)
    cy.contains('Watch video').should('be.visible')

    // delete the todo item
    cy.get('.todo-item').first().find('.remover').click()

    // expected: item removed, list no longer contains "Watch video"
    cy.get('.todo-item').should('have.length', 0)
    cy.contains('Watch video').should('not.exist')
  })

  after(function () {
    cy.cleanupUser()
  })
})