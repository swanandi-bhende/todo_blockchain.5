import { List, ListItem, Flex, Checkbox, Text, IconButton, useToast } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

export default function TodoList({ todos, loading, contract, account, fetchTodos }) {
  const toast = useToast();

  const handleToggle = async (id) => {
    try {
      const tx = await contract.toggleTodo(id);
      await tx.wait();
      fetchTodos(contract, account);
    } catch (error) {
      console.error("Error toggling todo:", error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const tx = await contract.deleteTodo(id);
      await tx.wait();
      fetchTodos(contract, account);
      toast({
        title: "Todo deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        title: "Error",
        description: "Failed to delete todo",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Text>Loading todos...</Text>;
  }

  if (todos.length === 0) {
    return <Text>No todos yet. Add one above!</Text>;
  }

  return (
    <List spacing={3}>
      {todos.map((todo) => (
        <ListItem key={todo.id.toString()}>
          <Flex align="center">
            <Checkbox
              isChecked={todo.completed}
              onChange={() => handleToggle(todo.id)}
              mr="3"
              colorScheme="teal"
            />
            <Text
              flex="1"
              textDecoration={todo.completed ? "line-through" : "none"}
              opacity={todo.completed ? 0.6 : 1}
            >
              {todo.content}
            </Text>
            <IconButton
              icon={<CloseIcon />}
              aria-label="Delete todo"
              onClick={() => handleDelete(todo.id)}
              variant="ghost"
              colorScheme="red"
            />
          </Flex>
        </ListItem>
      ))}
    </List>
  );
}