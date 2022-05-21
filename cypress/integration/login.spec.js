/// <reference types="cypress" />

context('Login', () => {
    it('logging in user', () => {
        cy.visit('http://localhost:3000/auth/login')

        cy.get('[name="email"]')
            .type('demo@testepagaleve.com')

        cy.get('[name="password"]')
            .type('12345678')

        cy.get('button').contains('Entrar')
            .click()

        cy.url()
            .should('include', '#contacts') // LOGIN SUCCESSFUL

    })
});