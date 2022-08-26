import { useContractCall } from "@micro-stacks/react";
import { 
  Button,
} from '@chakra-ui/react';
import {
  makeStandardFungiblePostCondition,
} from 'micro-stacks/transactions';

import {
  standardPrincipalCV,
  contractPrincipalCV,
  uintCV,
} from 'micro-stacks/clarity';

export const ContractCallButton = (props) => {
  const { token, burnAmountUser, handleResetInputFunc } = props
  const { handleContractCall } = useContractCall ({
    contractAddress: token.contractAddress,
    contractName: token.contractName,
    functionName: token.functionName,
    functionArgs: [
      uintCV(burnAmountUser*(Math.pow(10,token.decimal))),
      token.functionArguments.standard,
      token.functionArguments.contract,
    ],
    postConditions: [
      makeStandardFungiblePostCondition(
        token.postConditions.address,
        token.postConditions.code,
        burnAmountUser*(Math.pow(10,token.decimal)),
        token.postConditions.assetInfo,
      )
    ],
    onFinish: handleResetInputFunc
  });
    
    return (
    <Button onClick={ handleContractCall }>
      {token.buttonName}
    </Button>
    )
}