import { useState } from "react"
import { 
  Form,
} from 'react-bootstrap';
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

const minBurnAmount = 100
const tokens = ['mia','nyc','testTokenOne','testTokenTwo']


export const UserInputs = (props) => {
  const { currentStxAddress } = props
  const [tokenSelect, setTokenSelect] = useState("")
  const [burnAmountUser, setBurnAmountUser] = useState("");
  const [burnToken, setBurnToken ] = useState(null);
  
  const mia = {
    name: 'mia',
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'scarcity-token',
    functionName: 'mint',
    functionArguements: { 
        standard: standardPrincipalCV(currentStxAddress),
        contract: contractPrincipalCV('SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-token-v2')
    },
    postConditions: {
      address: currentStxAddress,
      code: FungibleConditionCode.GreaterEqual, 
      assetInfo: createAssetInfo('SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R','miamicoin-token-v2','miamicitycoin'),
    },
    variantType: "success",
    buttonName: "BurnMIA to Mint"
  };

  const nyc = {
    name: 'nyc',
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'scarcity-token',
    functionName: 'mint',
    functionArguements: { 
      standard: standardPrincipalCV(currentStxAddress),
      contract: contractPrincipalCV('SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11.newyorkcitycoin-token-v2')
    },
    postConditions: {
        address: currentStxAddress,
        code: FungibleConditionCode.GreaterEqual, 
        assetInfo: createAssetInfo('SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11','newyorkcitycoin-token-v2','newyorkcitycoin'),
      },
    variantType: "success",
    buttonName: "BurnNYC to Mint"
  };

  const testTokenOne = {
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'scarcity-token',
    functionName: 'mint',
    functionArguements: { 
      standard: standardPrincipalCV(currentStxAddress),
      contract: contractPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mint-test-token-one')
    },
    postConditions: {
      address: currentStxAddress,
      code: FungibleConditionCode.GreaterEqual, 
      assetInfo: createAssetInfo('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM','mint-test-token-one','test-token-one'),
    },
    variantType: "success",
    buttonName: "BurnTestTokenOne to Mint" 
  };

const testTokenTwo = {
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'mint-test-token-two',
  functionName: 'mint',
  functionArguements: { 
    standard: standardPrincipalCV(currentStxAddress),
    contract: contractPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mint-test-token-two')
  },
  postConditions: {
    address: currentStxAddress,
    code: FungibleConditionCode.GreaterEqual, 
    assetInfo: createAssetInfo('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM','mint-test-token-two','test-token-two'),
  },
  variantType: "success",
  buttonName: "BurnTestTokenTwo to Mint" 
};

  const handleSetBurnAmountUser = (e) => {
    const burnAmount = parseInt(e.target.value)
    setBurnAmountUser(burnAmount)
  }

  const handleSetBurnToken = (e) => {
    setTokenSelect(e.target.value)
    switch(e.target.value) {
      case 'mia':
        setBurnToken(mia)
      break;
      case 'nyc':
        setBurnToken(nyc)
      break;
      case 'testTokenOne':
        setBurnToken(testTokenOne)
      break;
      case 'testTokenTwo':
        setBurnToken(testTokenTwo)
      break;
      default:
    }
  }

  const handleResetInputs = () => {
    setBurnAmountUser("")
    setBurnToken(null)
    setTokenSelect("")
  }
  
  const TokenSelect = () => {
    return (
      <Form.Select value={tokenSelect} aria-label="Coin Selector" onChange={handleSetBurnToken}>
        <option disabled value="">Select Coin to Burn</option>
        { tokens.map(token => {
          return <option key={token} value={token}>{token}</option>
          })
        }
      </Form.Select>
    )
  }

  return (
    <div>
      <TokenSelect/>
      <Form.Control value={burnAmountUser} disabled={tokenSelect === "" ? true : false } placeholder="100 min. required to burn" type="number" min='1' onChange={handleSetBurnAmountUser}/>
      { burnToken && burnAmountUser > minBurnAmount ?  
      <ContractCallButton 
        currentStxAddress={currentStxAddress}
        token={burnToken} 
        burnAmountUser={burnAmountUser}
        handleResetInputFunc={ handleResetInputs }
      /> : '' }
    </div>
  )
}