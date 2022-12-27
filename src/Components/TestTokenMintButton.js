import { useContractCall } from "@micro-stacks/react";
import { Button } from "@chakra-ui/react";

export const TestTokenMintButton = (props) => {
  const { token } = props;

  const { handleContractCall } = useContractCall({
    contractAddress: token.contractAddress,
    contractName: token.contractName,
    functionName: "mint",
    functionArgs: token.functionArguments,
    postConditions: token.postConditions,
  });

  return <Button onClick={handleContractCall}>{props.token.buttonName}</Button>;
};
