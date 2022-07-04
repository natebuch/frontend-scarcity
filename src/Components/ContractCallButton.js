import { useContractCall } from "@micro-stacks/react";
import { 
  Button,
} from 'react-bootstrap';
import {
  makeStandardFungiblePostCondition,
} from 'micro-stacks/transactions';
import {
  uintCV,
} from 'micro-stacks/clarity';

export const ContractCallButton = (props) => {
  const { token, burnAmountUser, handleResetInputFunc } = props
  const { handleContractCall } = useContractCall ({
    contractAddress: token.contractAddress,
    contractName: token.contractName,
    functionName: token.functionName,
    functionArgs: [
      uintCV(burnAmountUser),
      token.functionArguements.standard,
      token.functionArguements.contract
    ],
    postConditions: [
      makeStandardFungiblePostCondition(
        token.postConditions.address,
        token.postConditions.code,
        burnAmountUser,
        token.postConditions.assetInfo
      )
    ]
  });

  const handleContractCallAndReset = () => {
    handleContractCall()
    handleResetInputFunc()
  }
  
    return (
    <Button variant={token.variantType} onClick={ handleContractCallAndReset }>
      {token.buttonName}
    </Button>
    )
}