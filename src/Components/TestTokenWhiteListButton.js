import { useContractCall } from "@micro-stacks/react";
import {
  contractPrincipalCV,
  trueCV
} from 'micro-stacks/clarity';
import { 
  Button,
} from '@chakra-ui/react';

export const TestTokenWhiteListButton = (props) => {
    const { handleContractCall } = useContractCall ({
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'scarcity-token',
      functionName: 'set-whitelisted',
      functionArgs: [contractPrincipalCV(props.token.fullAddress),trueCV(true)],
      postConditions: props.token.postConditions,
    });

return (
  <Button onClick={ handleContractCall }>
    {`whitelist ${props.token.contractName}`}
  </Button>
)

}