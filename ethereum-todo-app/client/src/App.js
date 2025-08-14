import React, { useState, useEffect } from 'react';
import {
  ChakraProvider, Box, Flex, Heading, useToast
} from '@chakra-ui/react';
import Auth from './components/Auth';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { BrowserProvider, Contract } from 'ethers';
import TodoContract from './contracts/TodoContract.json';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const loadBlockchainData = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const browserProvider = new BrowserProvider(window.ethereum);
        setProvider(browserProvider);

        const network = await browserProvider.getNetwork();
        const contractAddress = TodoContract.networks?.[network.chainId]?.address;

        if (contractAddress) {
          const signer = await browserProvider.getSigner();
          const todoContract = new Contract(contractAddress, TodoContract.abi, signer);
          setContract(todoContract);

          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            fetchTodos(todoContract, accounts[0]);
          }
        } else {
          toast({
            title: "Error",
            description: "Contract not deployed to this network",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load blockchain data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "No Ethereum provider",
        description: "Please install MetaMask!",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchTodos = async (contract, account) => {
    if (!contract || !account) return;

    try {
      setLoading(true);
      const todosFromContract = await contract.getTodos();
      // Filter out empty todos (adjust if needed depending on your contract)
      const filteredTodos = todosFromContract.filter(todo => todo.id.toString() !== '0' || todo.content !== '');
      setTodos(filteredTodos);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loadBlockchainData();

    // Listen for account changes and network changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0] || '');
        if (accounts[0] && contract) {
          fetchTodos(contract, accounts[0]);
        } else {
          setTodos([]);
        }
      };

      const handleChainChanged = () => {
        // Reload blockchain data when network changes
        loadBlockchainData();
        setTodos([]);
        setAccount('');
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [contract]);

  const handleDisconnect = () => {
    setAccount('');
    setTodos([]);
  };

  return (
    <ChakraProvider>
      <Box maxWidth="800px" margin="0 auto" padding="4">
        <Flex justifyContent="space-between" alignItems="center" mb="8">
          <Heading size="xl">Ethereum Todo App</Heading>
          <Auth 
            account={account} 
            setAccount={setAccount} 
            contract={contract}
            fetchTodos={fetchTodos}
            handleDisconnect={handleDisconnect}
          />
        </Flex>

        {account && contract ? (
          <>
            <TodoForm contract={contract} account={account} fetchTodos={fetchTodos} />
            <TodoList 
              todos={todos} 
              loading={loading} 
              contract={contract} 
              account={account} 
              fetchTodos={fetchTodos} 
            />
          </>
        ) : (
          <Box textAlign="center" py="10">
            <Heading size="md">Please connect your wallet to manage your todos</Heading>
          </Box>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default App;
