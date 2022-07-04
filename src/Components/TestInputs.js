import { useContractCall } from "@micro-stacks/react";
import { 
  Button,
} from 'react-bootstrap';

export const TestInputs = (props) => {
  const { handleContractCall } = useContractCall ({
    contractAddress: props.token.contractAddress,
    contractName: props.token.contractName,
    functionName: props.token.functionName,
    functionArgs: props.token.functionArguements,
    postConditions: props.token.postConditions,
  });
  
    return (
    <Button variant={props.token.variantType} onClick={ handleContractCall }>
      {props.token.buttonName}
    </Button>
  )  
}