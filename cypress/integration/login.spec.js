/// <reference types="cypress" />

context('Login', () => {
    it('logging in user', () => {
        cy.visit('http://localhost:3000')

        cy.get('[name="email"]')
            .type('demo@testepagaleve.com')

        cy.get('[name="password"]')
            .type('12345678')

        cy.get('button').contains('Entrar')
            .click()

        cy.get('h4').contains('Contatos') // LOGIN SUCCESSFUL


    })
});