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

// Clean up user by email (from fixture) — always works regardless of uid
Cypress.Commands.add('cleanupUser', function () {
  return cy.fixture('user.json').then((user) => {
    cy.request({
      method: 'GET',
      url: `http://localhost:5000/users/bymail/${user.email}`,
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
})

// Create a fresh user from fixture and return uid, name, email
Cypress.Commands.add('createUserFromFixture', function () {
  return cy.fixture('user.json').then((user) => {
    return cy.request({
      method: 'POST',
      url: 'http://localhost:5000/users/create',
      form: true,
      body: user
    }).then((response) => {
      return {
        uid: response.body._id.$oid,
        name: user.firstName + ' ' + user.lastName,
        email: user.email
      }
    })
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