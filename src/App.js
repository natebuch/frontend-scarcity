import { useState, useEffect } from "react";
import { useAuth, useUser, useNetwork, useContractCall} from "@micro-stacks/react";
import { fetchAccountBalances } from 'micro-stacks/api';
import {
  standardPrincipalCV,
  uintCV
} from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  createAssetInfo
} from 'micro-stacks/transactions';
import { 
  Button,
  Spinner
} from 'react-bootstrap';


// deployed: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.practice
// deployed: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.citycoin-token-trait
// deployed: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mint-test-token-two
// deployed: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mint-test-token-one
// deployed: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.scarcity-token

// const contractAddress =
// const contractName = 
// const mintTestTokenOne =
// const mintTestTokenTwo =
// const mintScarcity = 
// const burnScarcity 

const testTokenOne = {
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'mint-test-token-one',
  functionName: 'mint',
  functionArguements: [uintCV(1000), standardPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')],
  postConditions: [],
  variantType: "warning",
  buttonName: "Mint Test Token One"
}

const testTokenTwo = {
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'mint-test-token-two',
  functionName: 'mint',
  functionArguements: [uintCV(1000n), standardPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')],
  postConditions: [],
  variantType: "danger",
  buttonName: "Mint Test Token Two"
}

const mintNft = {
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractName: 'scarcity-token',
  functionName: 'mint',
  functionArguements: [
      uintCV(100n), 
      standardPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')
  ],
  postConditions: [makeContractFungiblePostCondition(
    'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 
    'test-token-one',
    FungibleConditionCode.Equal, 
    100n,
    createAssetInfo('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM','scarcity-token'))],
  variantType: "success",
  buttonName: "Burn to Mint"
}

function App() {
  const {isSignedIn, handleSignIn, handleSignOut, isLoading} = useAuth();
  const {currentStxAddress, ...rest} = useUser();
  const { network } = useNetwork();
  const [ callLoading, setCallLoading ] = useState(false);

  useEffect (() => {
    fetchUserBalances()
  },[])

  async function fetchUserBalances() {
    const balances = await fetchAccountBalances({
      url: network.getCoreApiUrl(),
      principal: [ currentStxAddress ],
    })
    console.log(
      balances,
      network
    )  
  };

  const ContractCallButton = (address,name,fname,fargs,postConditions,variantType,buttonName) => {
    const { handleContractCall } = useContractCall ({
      contractAddress: address,
      contractName: name,
      functionName: fname,
      functionArgs: fargs,
      postConditions: postConditions,
    });

    return <Button variant={variantType} onClick={handleContractCall}>
      {buttonName}
    </Button>
  }

  // const { handleContractCall2} = useContractCall ({
  //   contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  //   contractName: 'mint-test-token-two',
  //   functionName: 'mint',
  //   functionArgs: [uintCV(1000), standardPrincipalCV('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')],
  //   postConditions: [],
  // });

  return (
    <div>
      <Button variant="primary" type="button" onClick={isSignedIn ? handleSignOut : handleSignIn}>
        {isLoading ? <div><Spinner animation="border"/> Loading... </div>: isSignedIn ? "Sign out" : "Connect Stacks Wallet"} 
      </Button>
      <h5>{currentStxAddress}</h5>
      <h1>Scarcity</h1>
      { isSignedIn && network.bnsLookupUrl === "http://localhost:3999" ? 
        <div>
          {ContractCallButton(
            testTokenOne.contractAddress, 
            testTokenOne.contractName, 
            testTokenOne.functionName,
            testTokenOne.functionArguements,
            testTokenOne.postConditions,
            testTokenOne.variantType,
            testTokenOne.buttonName)}
            {ContractCallButton(
            testTokenTwo.contractAddress, 
            testTokenTwo.contractName, 
            testTokenTwo.functionName,
            testTokenTwo.functionArguements,
            testTokenTwo.postConditions,
            testTokenTwo.variantType,
            testTokenTwo.buttonName)}
            {ContractCallButton(
            mintNft.contractAddress, 
            mintNft.contractName, 
            mintNft.functionName,
            mintNft.functionArguements,
            mintNft.postConditions,
            mintNft.variantType,
            mintNft.buttonName)}
        </div> : ''
      }
    </div>
  );
}

export default App;
