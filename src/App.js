import { useState, useEffect } from "react";
import { useAuth, useUser, useNetwork} from "@micro-stacks/react";
import { fetchAccountBalances, fetchAccountTransactionsWithTransfers, fetchReadOnlyFunction } from 'micro-stacks/api';
import {
  standardPrincipalCV
} from 'micro-stacks/clarity';
import { 
  Box,
  Heading,
  HStack,
  VStack,
  Button,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { UserInputs} from './Components/UserInputs';
import { TestInputs} from './Components/TestInputs';

const scarcityToken = {
  address: 'SP1360BMRNRYWMHP9MWVD2B0VYET8G6MC8N0DH1MQ',
  contractName: 'scarcity',
};

//SP1360BMRNRYWMHP9MWVD2B0VYET8G6MC8N0DH1MQ.scarcity

const token = {
  tokenAddress: 'address',
  tokenName: 'name',
  tokenSymbol: 'symbol',
  tokenBalance: 1,
  decimal: 1,
};

function App() {
  const {isSignedIn, handleSignIn, handleSignOut, isLoading} = useAuth();
  const {currentStxAddress, ...rest} = useUser();
  const { network } = useNetwork();
  const [ userTokens, setUserTokens ] = useState([]);

  async function fetchWhitelistedAssets() { 
    const whitelistedAssets = await fetchReadOnlyFunction({
      network: network,
      contractAddress: scarcityToken.address,
      contractName: scarcityToken.contractName,
      functionArgs: [],
      functionName: 'get-whitelist',
      sender: currentStxAddress,
    });
    console.log('wl', whitelistedAssets)
    return whitelistedAssets
  };  

  async function fetchTokenBalance(contract) { 
    const tokenBalance = await fetchReadOnlyFunction({
      network: network,
      contractAddress: contract.split('.')[0],
      contractName: contract.split('.')[1],
      functionArgs: [standardPrincipalCV(currentStxAddress)],
      functionName: 'get-balance',
      sender: currentStxAddress,
    });
    return Number(tokenBalance)
  }; 
  
  async function fetchDecimal(contract) { 
    const decimal = await fetchReadOnlyFunction({
      network: network,
      contractAddress: contract.split('.')[0],
      contractName: contract.split('.')[1],
      functionArgs: [],
      functionName: 'get-decimals',
      sender: currentStxAddress,
    });
    return Number(decimal)
  }; 

  async function fetchTokenName(contract) { 
    const tokenName = await fetchReadOnlyFunction({
      network: network,
      contractAddress: contract.split('.')[0],
      contractName: contract.split('.')[1],
      functionArgs: [],
      functionName: 'get-name',
      sender: currentStxAddress,
    });
    return tokenName
  };

  async function fetchTokenSymbol(contract) { 
    const tokenSymbol = await fetchReadOnlyFunction({
      network: network,
      contractAddress: contract.split('.')[0],
      contractName: contract.split('.')[1],
      functionArgs: [],
      functionName: 'get-symbol',
      sender: currentStxAddress,
    });
    return tokenSymbol
  };

  async function buildTokenObj(contract) { 
    const name = await fetchTokenName(contract);
    const symbol = await fetchTokenSymbol(contract);
    const balance = await fetchTokenBalance(contract);
    const decimal = await fetchDecimal(contract)
    const obj = Object.create(token)
    obj.tokenAddress = contract
    obj.tokenName = name
    obj.tokenSymbol = symbol
    obj.tokenBalance = balance
    obj.decimal = decimal
    setUserTokens(userTokens => [...userTokens, obj]);
  };

  useEffect(() => {
    if (isSignedIn && currentStxAddress) {
      async function buildTokenData() {
        const assetList = await fetchWhitelistedAssets()
          assetList.map(asset => {
            buildTokenObj(asset)
          })
      }
      buildTokenData()      
    } else {
      setUserTokens([])
    }
  },[currentStxAddress,isSignedIn])

  console.log(userTokens)

  return (
  <Box>
    <Box p='3'>
      <HStack justify='space-between' spacing='2' w='100'>
        <Heading size='md'> SCARCITY </Heading>
        <HStack>
          <Heading size='xs'>{ currentStxAddress }</Heading>
          <Button onClick={isSignedIn ? handleSignOut : handleSignIn}>
            {isLoading ? <div><Spinner/> Loading... </div>: isSignedIn ? "Sign out" : "Connect Stacks Wallet"} 
          </Button>
        </HStack>
      </HStack>
    </Box>
    <Box>
      <VStack m='40px'>
        <Heading size='3xl'>🔥 SCARCITY PROJECT 🔥</Heading>
        { isSignedIn && currentStxAddress ?
          <UserInputs
            currentStxAddress={currentStxAddress}
            userTokens={userTokens}
          /> : "" }
      </VStack>
    </Box>
    <Box position='fixed' bottom='0' p='3'>
      <HStack>
        { isSignedIn && currentStxAddress && network.bnsLookupUrl === "http://localhost:3999" ? 
          <HStack>
            <Text>Dev: </Text>
            { currentStxAddress && <TestInputs currentStxAddress={currentStxAddress}/> }
          </HStack> : ''
        }
      </HStack>
    </Box>
  </Box>
  );
}

export default App;
