// *********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// *********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// Clean up a user by email
Cypress.Commands.add('cleanupUser', (email) => {
  cy.request({
    method: 'GET',
    url: `http://localhost:5000/users/bymail/${email}`,
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200 && response.body._id) {
      cy.request({
        method: 'DELETE',
        url: `http://localhost:5000/users/${response.body._id.$oid}`
      })
    }
  })
})

// Create a user from given data and return uid, name, email
Cypress.Commands.add('createUser', (userData) => {
  return cy.request({
    method: 'POST',
    url: 'http://localhost:5000/users/create',
    form: true,
    body: userData
  }).then((response) => {
    return {
      uid: response.body._id.$oid,
      name: userData.firstName + ' ' + userData.lastName,
      email: userData.email
    }
  })
})

// Login with a given email address
Cypress.Commands.add('login', (email) => {
  cy.visit('http://localhost:3000')
  cy.contains('div', 'Email Address')
    .find('input[type=text]')
    .type(email)
  cy.get('form').submit()
})

// Create a task via UI using task data object { title, url }
Cypress.Commands.add('createTask', (taskData) => {
  cy.get('#title').type(taskData.title)
  cy.get('#url').type(taskData.url)
  cy.get('input[value="Create new Task"]').click()
  cy.contains('.title-overlay', taskData.title).should('exist')
})

//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })