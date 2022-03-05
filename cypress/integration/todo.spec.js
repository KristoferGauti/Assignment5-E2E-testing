function getByTestId(testId) {
    return cy.get(`[data-testid="${testId}"]`);
}

function clearAllTodos() {
    getByTestId("todo-item").click({ multiple: true });
}

describe("📝 TODO app", () => {
    beforeEach(() => {
        cy.visit("/");
    });
    it("TODO list is empty", () => {
        getByTestId("todo-item").should("not.exist");
    });
    it("Add a new item to the list", () => {
        getByTestId("todo-input").type("Test TODO item {enter}");
        getByTestId("todo-item").should("exist");
    });
    it("Adds a second item to the list", () => {
        clearAllTodos();
        getByTestId("todo-input").type("Test TODO 1st item {enter}");
        getByTestId("todo-input").type("Test TODO 2nd item {enter}");
        getByTestId("todo-item").should("have.length", 2);
    });
    it("Removes one item from the list", () => {
        clearAllTodos();
        getByTestId("todo-input").type("Test TODO 1st item {enter}");
        getByTestId("todo-input").type("Test TODO 2nd item {enter}");
        getByTestId("todo-input").type("Test TODO 3rd item {enter}");
        getByTestId("todo-item")
            .then(($elems) => {
                return Cypress.$.makeArray($elems);
            })
            .then((todosList) => {
                const thirdTodoItem = todosList[todosList.length - 1];
                thirdTodoItem.click();
            });
        getByTestId("todo-item").should("have.length", 2);
    });
});
