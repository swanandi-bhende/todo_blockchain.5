// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoContract {
    struct Todo {
        uint id;
        string content;
        bool completed;
        uint createdAt;
    }

    mapping(address => Todo[]) public todos;
    mapping(address => uint) public todoCount;

    event TodoCreated(uint id, string content, bool completed);
    event TodoToggled(uint id, bool completed);
    event TodoDeleted(uint id);

    function createTodo(string memory _content) public {
        uint count = todoCount[msg.sender];
        todos[msg.sender].push(Todo(count, _content, false, block.timestamp));
        todoCount[msg.sender]++;
        emit TodoCreated(count, _content, false);
    }

    function toggleTodo(uint _id) public {
        require(_id < todoCount[msg.sender], "Todo doesn't exist");
        Todo storage todo = todos[msg.sender][_id];
        todo.completed = !todo.completed;
        emit TodoToggled(_id, todo.completed);
    }

    function deleteTodo(uint _id) public {
        require(_id < todoCount[msg.sender], "Todo doesn't exist");
        delete todos[msg.sender][_id];
        emit TodoDeleted(_id);
    }

    function getTodos() public view returns (Todo[] memory) {
        Todo[] memory userTodos = new Todo[](todoCount[msg.sender]);
        for (uint i = 0; i < todoCount[msg.sender]; i++) {
            userTodos[i] = todos[msg.sender][i];
        }
        return userTodos;
    }
}