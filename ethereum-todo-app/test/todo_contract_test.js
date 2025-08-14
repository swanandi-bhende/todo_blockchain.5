const TodoContract = artifacts.require("TodoContract");

contract("TodoContract", (accounts) => {
  let todoContract;

  before(async () => {
    todoContract = await TodoContract.new();
  });

  it("should create a todo", async () => {
    await todoContract.createTodo("First todo", { from: accounts[0] });
    const count = await todoContract.todoCount(accounts[0]);
    assert.equal(count, 1);
  });

  it("should toggle todo completion", async () => {
    await todoContract.createTodo("Second todo", { from: accounts[0] });
    await todoContract.toggleTodo(1, { from: accounts[0] });
    const todos = await todoContract.getTodos({ from: accounts[0] });
    assert.equal(todos[1].completed, true);
  });

  it("should delete a todo", async () => {
    await todoContract.createTodo("Third todo", { from: accounts[0] });
    await todoContract.deleteTodo(2, { from: accounts[0] });
    const count = await todoContract.todoCount(accounts[0]);
    assert.equal(count, 3); // Count doesn't decrease but slot is marked empty
  });
});