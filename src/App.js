import { useState, useEffect } from "react";
import { useAuth, useUser, useNetwork} from "@micro-stacks/react";
import { fetchReadOnlyFunction, fetchTransaction } from 'micro-stacks/api';
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
import { useEnvStore } from './index';

//DevNet
// const scarcityToken = {
//   address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
//   contractName: 'scarcity-token',
//   name: 'scarcity-token',
//   apiUrl: 'http://localhost:3999' 
// };

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
  const scarcityToken = useEnvStore((state) => state.env);
  const [ userTokens, setUserTokens ] = useState([]);
  const [ userInfo, setUserInfo ] = useState([]);
  const [ dataLoading, setDataLoading ] = useState(true);
  const [userNft, setUserNft] = useState();
  const [minBurnAmount, setMinBurnAmount] = useState();
  const [recentBurn, setRecentBurn] = useState(false)
  const [txStatus, setTxStatus] = useState()

  const handleRecentBurn = () => {
    setRecentBurn(true)
  }

  async function fetchWhitelistedAssets() { 
    const whitelistedAssets = await fetchReadOnlyFunction({
      network: network,
      contractAddress: scarcityToken.address,
      contractName: scarcityToken.contractName,
      functionArgs: [],
      functionName: 'get-whitelist',
      sender: currentStxAddress,
    });
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

  async function fetchMinBurnAmount() {
    const minBurnAmount = await fetchReadOnlyFunction({
      network: network,
      contractAddress: scarcityToken.address,
      contractName: scarcityToken.contractName,
      functionArgs: [],
      functionName: 'get-min-burn-amount',
      sender: currentStxAddress,

    });
    return Number(minBurnAmount)
  }
  
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

  async function fetchUserInfo() { 
    const userInfo = await fetchReadOnlyFunction({
      network: network,
      contractAddress: scarcityToken.address,
      contractName: scarcityToken.contractName,
      functionArgs: [standardPrincipalCV(currentStxAddress)],
      functionName: 'get-user-info',
      sender: currentStxAddress,
    });
    return userInfo
  };

  async function fetchUserAssets() {
    const url = `${scarcityToken.apiUrl}/extended/v1/tokens/nft/holdings?principal=${currentStxAddress}&asset_identifiers=${scarcityToken.address}.${scarcityToken.contractName}::${scarcityToken.name}`
    const data = await fetch(url)
    const response = await data.json()
    console.log('fetchUserAssets',response)
    if (response.results.length > 0) {
      return response.results[0].value.repr
    } 
  }
  
  // See if there is consistent way to get data to order
  useEffect(() => {
    const recentTxId = window.localStorage.getItem(currentStxAddress);
    async function buildTokenData() {
      const assetList = await fetchWhitelistedAssets()
      const userInfo = await fetchUserInfo()
      const userNft = await fetchUserAssets()
      const minBurnAmount = await fetchMinBurnAmount()
        assetList.map(asset => {
         return buildTokenObj(asset)
        })
      setUserInfo(userInfo)
      setUserNft(userNft) 
      setMinBurnAmount(minBurnAmount)
      setDataLoading(false)
    }

    async function checkRecentTxId() {
      const data = await fetchTransaction({
        txid: recentTxId, 
        url: scarcityToken.apiUrl,
      })
      return data.tx_status
    };

    if (isSignedIn && currentStxAddress) {
      if (recentTxId) {
        if (checkRecentTxId() === 'pending') {
          setTxStatus('pending')
        } else {
          window.localStorage.removeItem(currentStxAddress)  
          setTxStatus('complete')
        }
      } 
      buildTokenData()
    } else {
      setUserTokens([])
    }
  },[currentStxAddress, isSignedIn])
  
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
        { userTokens && !dataLoading ? <UserInputs
            scarcityToken={scarcityToken}
            currentStxAddress={currentStxAddress}
            userTokens={userTokens}
            userInfo={userInfo}
            userNft={userNft}
            minBurnAmount={minBurnAmount}
            handleRecentBurnFunc={handleRecentBurn}
          /> : 
          <div><Spinner/></div>
        }
        <pre>
          Burn whitelisted fungible tokens to mint a single Scarcity NFT.
        </pre>
        <pre>           
          A wallet will only possess a single Scarcity NFT that tracks the amount burned.
        </pre>
        <pre> 
          If a wallet performs multiple burn events, the existing NFT will be burned and new NFT will be minted.
        </pre>
        <pre> 
          Each time a new Scarcity NFT is minted, the total amount burned by that wallet will be tracked.
        </pre>
      </VStack>
    </Box>
    <Box position='fixed' bottom='0' p='3'>
      <HStack>
        { isSignedIn && currentStxAddress && network.bnsLookupUrl === "http://localhost:3999" ? 
          <HStack>
            <Text>Dev: </Text>
            { currentStxAddress && 
            <TestInputs currentStxAddress={currentStxAddress}
            /> }
          </HStack> : ''
        }
      </HStack>
    </Box>
  </Box>
  );
}

export default App;
