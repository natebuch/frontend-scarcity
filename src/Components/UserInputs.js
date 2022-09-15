import { useState, useEffect } from "react"
import { 
  Button,
  VStack,
  HStack,
  Text,
  Select,
  Input,
  FormControl,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import {
  standardPrincipalCV,
  contractPrincipalCV,
} from 'micro-stacks/clarity';
import {
  fetchTransaction  
} from 'micro-stacks/api';
import {
  FungibleConditionCode,
  createAssetInfo,
  NonFungibleConditionCode
} from 'micro-stacks/transactions';
import { ContractCallButton } from "./ContractCallButton"

const minBurnAmount = 1

export const UserInputs = (props) => {
  const { currentStxAddress, userTokens, userInfo, userNft } = props
  const [tokenSelect, setTokenSelect] = useState("")
  const [burnAmountUser, setBurnAmountUser] = useState("");
  const [burnToken, setBurnToken ] = useState();
  const [txStatus, setTxStatus] = useState();

  const handleSetBurnAmountUser = (e) => {
    const re = /^[0-9.\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setBurnAmountUser(e.target.value);
    }
  }

  const handleSetBurnToken = (e) => {
    const selectedTokenAddress = e.target.value
    const token = userTokens.filter(token => token.tokenAddress === selectedTokenAddress)[0]
    setTokenSelect(token.tokenName)
    setBurnToken({
      name: token.tokenName,
      decimal: token.decimal,
      balance: token.tokenBalance,
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'scarcity-token',
      functionName: 'mint-scarcity',
      functionArguments: { 
          standard: standardPrincipalCV(currentStxAddress),
          contract: contractPrincipalCV(token.tokenAddress),
      },
      postConditions: {
        address: currentStxAddress,
        codeFT: FungibleConditionCode.GreaterEqual, 
        assetInfoFT: createAssetInfo(token.tokenAddress.split('.')[0],token.tokenAddress.split('.')[1],token.tokenName),
        codeNFT: NonFungibleConditionCode.DoesNotOwn,
        assetInfoNFT: createAssetInfo('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM','scarcity-token','scarcity-token')
      },
      buttonName: `🔥 Burn 🔥`
    })
  }

  const handleResetInputs = () => {
    setBurnAmountUser("")
  }

  useEffect(() => {
    const recentTxId = window.localStorage.getItem(currentStxAddress);
    async function checkRecentTxId() {
      const data = await fetchTransaction({
        txid: recentTxId, 
        url: 'http://localhost:3999',
      })
      setTxStatus(data.tx_status)
    };
    if (recentTxId) {
      checkRecentTxId()
      } else {
        window.localStorage.removeItem(currentStxAddress)
        setTxStatus('pending')
    }
  },[])

  return (
    <VStack>
      { userInfo ? 
      <HStack justify='space-between'>
        <Text>Burnt Amount: {userInfo["burnt-amount"] ? Number(userInfo["burnt-amount"])/(Math.pow(10, userTokens[0] && userTokens[0].decimal)) : ""}</Text>
        <Text>Scarcity NFT ID: {userInfo["current-nft-id"] ? Number(userInfo["current-nft-id"]) : ''}</Text>
      </HStack> : '' }
    <HStack borderWidth='2px' p='3'>
      <VStack >
        <Text fontSize='3xl'>Balances</Text>
        { userTokens.length > 1 ?
          <UnorderedList styleType='none'>
            { userTokens.map(token => {
              return (
                <ListItem key={token.tokenName}>
                  {token.tokenName}: {Number(token.tokenBalance)/(Math.pow(10,token.decimal))}
                </ListItem>
              )})
            }
          </UnorderedList> :
          <Text fontSize='sm'>No burnable assets</Text>
        }
        </VStack>
      <VStack p='3'>
        { txStatus === 'pending' ?
          <VStack> 
            <Text fontSize='sm'>
              There is a pending transaction for this address.
            </Text>
            <Text fontSize='sm'>
              Please wait until it is complete before burning.
            </Text>
            <Text fontSize='sm'>
              Refresh Page to Burn.
            </Text>
          </VStack>: (
          <>
            <Select onChange={handleSetBurnToken}>
              <option selected disabled value=''>Select Token to Burn</option>
              { userTokens.map(token => {
                return <option key={token.tokenName} value={token.tokenAddress}>{token.tokenName}</option>
                })
              }
            </Select>
              <FormControl>
                <Input
                  type='tel'
                  disabled={tokenSelect === "" ? true : false } 
                  placeholder='Amount - Min. 1'
                  value={burnAmountUser}
                  autoComplete='off'
                  onChange={handleSetBurnAmountUser}>
                </Input>
              </FormControl>
            { burnToken && burnAmountUser >= minBurnAmount ?  
              <ContractCallButton 
                userNft={userNft && userNft}
                userInfo={userInfo}
                currentStxAddress={currentStxAddress}
                token={burnToken} 
                burnAmountUser={burnAmountUser}
                handleResetInputFunc={ handleResetInputs }
                disabled={ burnToken && burnAmountUser >= minBurnAmount ? false : true}
              /> : 
              <Button disabled>Burn</Button>
            }
          </>)
        }
      </VStack>
    </HStack>
  </VStack>
  )
}