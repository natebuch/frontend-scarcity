import { useState, useEffect } from "react";
import { useAuth, useUser, useNetwork} from "@micro-stacks/react";
import { fetchAccountBalances } from 'micro-stacks/api';
import {
  standardPrincipalCV,
  uintCV,
  contractPrincipalCV
} from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  createAssetInfo
} from 'micro-stacks/transactions';
import { 
  Button,
  Spinner,
} from 'react-bootstrap';
import { UserInputs} from './Components/UserInputs';
import { TestInputs} from './Components/TestInputs';

//SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11.newyorkcitycoin-token-v2
//SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-token-v2

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
const minBurnAmount = 100

function App() {
  const {isSignedIn, handleSignIn, handleSignOut, isLoading} = useAuth();
  const {currentStxAddress, ...rest} = useUser();
  const { network } = useNetwork();
  const [testTokenOne, setTestTokenOne] = useState(null)
  const [testTokenTwo, setTestTokenTwo] = useState(null)
 

  useEffect(() => {
    if (isSignedIn && currentStxAddress) {
      fetchUserBalances()
      setTestTokenOne({
          contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          contractName: 'mint-test-token-one',
          functionName: 'mint',
          functionArguements: [uintCV(1000), standardPrincipalCV(currentStxAddress)],
          postConditions: [],
          variantType: "warning",
          buttonName: "Mint Test Token One"
      })
      setTestTokenTwo(
      {
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'mint-test-token-two',
        functionName: 'mint',
        functionArguements: [uintCV(1000), standardPrincipalCV(currentStxAddress)],
        postConditions: [],
        variantType: "danger",
        buttonName: "Mint Test Token Two"
      })
    } else {
      setTestTokenOne(null)
      setTestTokenTwo(null)
    }
  },[currentStxAddress,isSignedIn])

  async function fetchUserBalances() {
    const balances = await fetchAccountBalances({
      url: network.getCoreApiUrl(),
      principal: [ currentStxAddress ],
    })
    console.log(
      balances,
      network,
      currentStxAddress,
    )  
  };

  return (
    <div>
      <Button variant="primary" type="button" onClick={isSignedIn ? handleSignOut : handleSignIn}>
        {isLoading ? <div><Spinner animation="border"/> Loading... </div>: isSignedIn ? "Sign out" : "Connect Stacks Wallet"} 
      </Button>
        <div> 
          <h5>{ currentStxAddress }</h5>
          <h1>Scarcity</h1>
          { isSignedIn && currentStxAddress ?
          <UserInputs
            currentStxAddress={currentStxAddress}
          /> : "" }
        </div>
        { isSignedIn && currentStxAddress && network.bnsLookupUrl === "http://localhost:3999" ? 
          <div>
            {testTokenOne && <TestInputs token={testTokenOne}/> }
            {testTokenTwo && <TestInputs token={testTokenTwo}/> }
          </div> : ''
        }
    </div>
  );
}

export default App;
