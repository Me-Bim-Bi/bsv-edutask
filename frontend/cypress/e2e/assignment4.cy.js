describe('Adding and deleting todos', () => {
  // define variables that we need on multiple occasions
  let uid// user id
  let name// name of the user (firstName + ' ' + lastName)
  let email// email of the user
  let title = "me at the zoo"
  let url = "jNQXAC9IVRw"

  before(function () {
    // create a fabricated user from a fixture
    cy.fixture('user.json')
      .then((user) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:5000/users/create',
          form: true,
          body: user
        }).then((response) => {
          uid = response.body._id.$oid
          name = user.firstName + ' ' + user.lastName
          email = user.email
        })
      })
  })

  beforeEach(function () {
    // enter the main main page
    cy.visit('http://localhost:3000')
    cy.contains('div', 'Email Address')
      .find('input[type=text]')
      .type(email)
    // alternative, imperative way of detecting that input field
    //cy.get('.inputwrapper #email')
    //    .type(email)

    // submit the form on this page
    cy.get('form')
      .submit()
    cy.get('.inputwrapper #title')
      .type(title)
    cy.get('.inputwrapper #url')
      .type(url)
    cy.get('form')
      .submit()
    cy.get('.title-overlay')
      .click()
  })

  it('adding new tests here', () => {
    //

  })


  after(function () {
    // clean up by deleting the user from the database
    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${uid}`
    }).then((response) => {
      cy.log(response.body)
    })
  })
})