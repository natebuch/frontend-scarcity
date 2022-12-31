import { useOpenContractCall } from "@micro-stacks/react";
import { Button } from "@chakra-ui/react";

export const TestTokenMintButton = (props) => {
  const { token } = props;
  const { openContractCall } = useOpenContractCall();

  const handleContractCall = async () => {
    await openContractCall({
      contractAddress: token.contractAddress,
      contractName: token.contractName,
      functionName: "mint",
      functionArgs: token.functionArguments,
      postConditions: token.postConditions,
      onFinish: async (data) => {
        console.log("finished contract call!", data.txId);
      },
    });
  };

  return (
    <Button onClick={() => handleContractCall()}>
      {props.token.buttonName}
    </Button>
  );
};
