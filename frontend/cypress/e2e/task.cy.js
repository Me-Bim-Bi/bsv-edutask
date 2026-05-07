// =========================================================================
// R8UC1 & R8UC2 – Add and Toggle Todo Items (uses user1)
// =========================================================================
describe('Manipulating the todo list (R8) - Add and Toggle', () => {
  let name
  let email
  let task

  before(function () {
    //clean up user, create a new user and a new task with fixtures
    cy.fixture('task.json').as('taskData')
    cy.fixture('user.json').then((users) => {
      const user1 = users.user1
      cy.cleanupUser(user1.email)
      cy.createUser(user1).then((user) => {
        name = user.name
        email = user.email
      })
    })
    cy.get('@taskData').then((taskData) => {
      task = taskData
      cy.login(email)
      cy.get('h1').should('contain.text', name)
      cy.createTask(task)
    })
  })

  beforeEach(function () {
    //login the user and check if the task is created
    cy.login(email)
    cy.get('h1').should('contain.text', name)
    cy.contains('.title-overlay', task.title).click({ force: true })
    cy.get('.popup-inner').should('be.visible')

    // reset: delete any extra todos (keep only the first one)
    cy.get('.todo-item').then(($items) => {
      if ($items.length > 1) {
        for (let i = $items.length - 1; i >= 1; i--) {
          cy.get('.todo-item').eq(i).find('.remover').click()
        }
        cy.get('.close-btn').click({ force: true })
        cy.contains('.title-overlay', task.title).click({ force: true })
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
    //Check if only 1 todo item in the task
    cy.get('.todo-item').should('have.length', 1)
    cy.contains(task.todos).should('be.visible')

    //add a new todo item
    cy.get('.popup-inner .inline-form input[type=text]')
      .type(task.newTodo)
    cy.get('.popup-inner .inline-form input[type=submit]')
      .click()

    //check if the new todo item only appended and not affect to the existing items
    cy.get('.todo-item').should('have.length', 2)
    cy.contains(task.newTodo).should('be.visible')
    cy.contains(task.todos).should('be.visible')
  })

  it('R8UC1.2 - should have the Add button disabled when input is empty', () => {
    cy.get('.popup-inner .inline-form input[type=text]')
      .should('have.value', '')

    cy.get('.popup-inner .inline-form input[type=submit]')
      .should('be.disabled')
  })

  it('R8UC1.3 - should not create a todo item when input is empty', () => {
    //check it there is only 1 todo item in the task
    //try to submit an empty todo item
    //check if no empty todo item was created
    cy.get('.todo-item').should('have.length', 1)

    cy.get('.popup-inner .inline-form input[type=text]')
      .should('have.value', '')
    cy.get('.popup-inner .inline-form input[type=submit]')
      .click()
    cy.wait(1000)

    cy.get('.todo-item').should('have.length', 1)
    cy.contains(task.todos).should('be.visible')
  })

  it('R8UC2 - should toggle a todo item from active to done and back', () => {
    //toggle a todo item from active to done
    cy.get('.todo-item').first().find('.checker')
      .should('have.class', 'unchecked')

    cy.get('.todo-item').first().find('.checker').click()

    cy.get('.todo-item').first().find('.checker')
      .should('have.class', 'checked')
    cy.get('.todo-item').first().find('.editable')
      .should('have.css', 'text-decoration')
      .and('contain', 'line-through')

    //toggle a todo item from done to active
    cy.get('.todo-item').first().find('.checker').click()

    cy.get('.todo-item').first().find('.checker')
      .should('have.class', 'unchecked')
    cy.get('.todo-item').first().find('.editable')
      .should('have.css', 'text-decoration')
      .and('not.contain', 'line-through')
  })

  after(function () {
    cy.cleanupUser(email)
  })
})

// =========================================================================
// R8UC3 – Delete a Todo Item (uses user2)
// =========================================================================
describe('Manipulating the todo list (R8) - Delete', () => {
  let name
  let email
  let task

  before(function () {
    //clean up user, create a new user and a new task with fixtures
    cy.fixture('task.json').as('taskData')
    cy.fixture('user.json').then((users) => {
      const user2 = users.user2
      cy.cleanupUser(user2.email)
      cy.createUser(user2).then((user) => {
        name = user.name
        email = user.email
      })
    })
    cy.get('@taskData').then((taskData) => {
      task = taskData
      cy.login(email)
      cy.get('h1').should('contain.text', name)
      cy.createTask(task)
    })
  })

  it('R8UC3 - should delete a todo item from the list', () => {
    // open task (first time in this describe — no prior popup opens)
    cy.contains('.title-overlay', task.title).click({ force: true })
    cy.get('.popup-inner').should('be.visible')

    // precondition: default todo exists
    cy.get('.todo-item').should('have.length', 1)
    cy.contains(task.todos).should('be.visible')

    // delete the todo item
    cy.get('.todo-item').first().find('.remover').click()

    // expected: item should be removed immediately from the list
    cy.get('.popup-inner').then(($popup) => {
      const items = $popup.find('.todo-item')
      expect(items).to.have.length(0)
    })
  })

  after(function () {
    cy.cleanupUser(email)
  })
})