/// <reference types="cypress" />

context('Login', () => {
    // beforeEach(() => {
    //     cy.visit('http://localhost:3000/auth/login');
    // });

    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    });

    it('Should find "Entrar" button',
        () => { cy.get('button').contains('Entrar') }
    );

    it('Should find Register link',
        () => { cy.get('a').contains('Registre-se') }
    );
});