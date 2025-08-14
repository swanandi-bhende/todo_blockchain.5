import { Button, Menu, MenuButton, MenuList, MenuItem, Avatar, Text, Flex } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { ethers } from 'ethers';

export default function Auth({ account, setAccount, contract, fetchTodos, handleDisconnect }) {
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        if (contract) {
          fetchTodos(contract, accounts[0]);
        }
      } catch (error) {
        console.error("User rejected request:", error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const switchAccount = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      setAccount(accounts[0]);
      fetchTodos(contract, accounts[0]);
    } catch (error) {
      console.error("Error switching accounts:", error);
    }
  };

  if (!account) {
    return <Button colorScheme="teal" onClick={connectWallet}>Connect Wallet</Button>;
  }

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <Flex alignItems="center">
          <Avatar
            size="sm"
            mr="2"
            name={account}
            src={`https://avatars.dicebear.com/api/jdenticon/${account}.svg`}
          />
          <Text>{`${account.slice(0, 6)}...${account.slice(-4)}`}</Text>
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={switchAccount}>Switch Account</MenuItem>
        <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
      </MenuList>
    </Menu>
  );
}
