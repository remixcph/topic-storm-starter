import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();

    cy.findByRole("link", { name: /topics/i }).click();
    cy.findByRole("button", { name: /logout/i }).click();
    cy.findByRole("link", { name: /log in/i });
  });

  it("should allow you to make a topic", () => {
    const testTopic = {
      title: faker.lorem.words(1),
      description: faker.lorem.sentences(1),
    };
    cy.login();

    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /topics/i }).click();
    cy.findByText("No topics yet");

    cy.findByRole("link", { name: /\+ new topic/i }).click();

    cy.findByRole("textbox", { name: /title/i }).type(testTopic.title);
    cy.findByRole("textbox", { name: /description/i }).type(
      testTopic.description
    );
    cy.findByRole("button", { name: /save/i }).click();

    cy.findByRole("button", { name: /delete/i }).click();

    cy.findByText("No topics yet");
  });
});
