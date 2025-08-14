import { useState } from 'react';
import { Flex, Input, Button, useToast } from '@chakra-ui/react';

export default function TodoForm({ contract, account, fetchTodos }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!contract) {
      toast({
        title: "Error",
        description: "Contract is not loaded yet. Please wait and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.createTodo(content);
      await tx.wait();
      setContent('');
      fetchTodos(contract, account);
      toast({
        title: "Todo created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating todo:", error);
      toast({
        title: "Error",
        description: "Failed to create todo",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex mb="4">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a new todo..."
          mr="2"
          isDisabled={!contract || loading}
        />
        <Button 
          type="submit" 
          colorScheme="teal" 
          isLoading={loading} 
          isDisabled={!contract || loading}
        >
          Add
        </Button>
      </Flex>
    </form>
  );
}
