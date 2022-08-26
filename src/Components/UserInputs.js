import { useState } from "react"
import { 
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
  uintCV,
  contractPrincipalCV
} from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  createAssetInfo
} from 'micro-stacks/transactions';
import { ContractCallButton } from "./ContractCallButton"

const minBurnAmount = 1000000

export const UserInputs = (props) => {
  const { currentStxAddress } = props
  const [tokenSelect, setTokenSelect] = useState("")
  const [burnAmountUser, setBurnAmountUser] = useState("");
  const [burnToken, setBurnToken ] = useState();

  const handleSetBurnAmountUser = (e) => {
    const re = /^[0-9.\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setBurnAmountUser(e.target.value);
    }
  }
  // Function will add hyphens at spaces for token  


  const handleSetBurnToken = (e) => {
    const selectedTokenAddress = e.target.value
    const token = props.userTokens.filter(token => token.tokenAddress === selectedTokenAddress)[0]
    setTokenSelect(token.tokenName)
    setBurnToken({
      name: token.tokenName,
      decimal: token.decimal,
      balance: token.tokenBalance,
      contractAddress: 'SP1360BMRNRYWMHP9MWVD2B0VYET8G6MC8N0DH1MQ',
      contractName: 'scarcity',
      functionName: 'mint',
      functionArguments: { 
          standard: standardPrincipalCV(currentStxAddress),
          contract: contractPrincipalCV(token.tokenAddress)
      },
      postConditions: {
        address: currentStxAddress,
        code: FungibleConditionCode.GreaterEqual, 
        assetInfo: createAssetInfo(token.tokenAddress.split('.')[0],token.tokenAddress.split('.')[1],token.tokenName),
      },
      buttonName: `🔥 Burn ${token.tokenName} 🔥`
    })
  }

  const handleResetInputs = () => {
    setBurnAmountUser("")
    setBurnToken(null)
    setTokenSelect("")
  }
  
  console.log(props.userTokens)

  return (
    <VStack justify='center'>
      <Text as='h4'>Balances (in micro units):</Text>
      <UnorderedList styleType='none'>
        { props.userTokens.map(token => {
          return (
            <ListItem key={token.tokenName}>
              {`${token.tokenName} : ${token.tokenBalance}`}
            </ListItem>
          )})
        }
      </UnorderedList>
      <HStack>
      <Select placeholder='Select Token to Burn' onChange={handleSetBurnToken}>
        { props.userTokens.map(token => {
          return <option key={token.tokenName} value={token.tokenAddress}>{token.tokenName}</option>
          })
        }
      </Select>
        <FormControl>
          <Input
            type='tel'
            disabled={tokenSelect === "" ? true : false } 
            placeholder='Amount - Min. 1000000'
            value={burnAmountUser}
            autoComplete='off'
            onChange={handleSetBurnAmountUser}>
          </Input>
        </FormControl>
      </HStack>
      { burnToken && burnAmountUser >= minBurnAmount ?  
      <ContractCallButton 
        currentStxAddress={currentStxAddress}
        token={burnToken} 
        burnAmountUser={burnAmountUser}
        handleResetInputFunc={ handleResetInputs }
      /> : '' }
    </VStack>
  )
}