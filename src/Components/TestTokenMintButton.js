import { useContractCall } from "@micro-stacks/react";
import { 
  Button,
  Box,
  VStack,
} from '@chakra-ui/react';


export const TestTokenMintButton = (props) => {
    const { handleContractCall } = useContractCall ({
      contractAddress: props.token.contractAddress,
      contractName: props.token.contractName,
      functionName: 'mint',
      functionArgs: props.token.functionArguments,
      postConditions: props.token.postConditions,
    });

return (
  <Button onClick={ handleContractCall }>
    {props.token.buttonName}
  </Button>
)

}