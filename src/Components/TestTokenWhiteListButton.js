import { useOpenContractCall } from "@micro-stacks/react";
import { contractPrincipalCV, trueCV } from "micro-stacks/clarity";
import { Button } from "@chakra-ui/react";

export const TestTokenWhiteListButton = (props) => {
  const { token } = props;
  const { openContractCall, isRequestPending } = useOpenContractCall();

  const handleContractCall = async () => {
    await openContractCall({
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "scarcity-token",
      functionName: "set-whitelisted",
      functionArgs: [contractPrincipalCV(token.fullAddress), trueCV(true)],
      postConditions: token.postConditions,
      onFinish: async (data) => {
        console.log("finished contract call!", data.txId);
      },
    });
  };

  return (
    <Button onClick={() => handleContractCall()}>
      {isRequestPending ? "Pending Request" : `whitelist ${token.contractName}`}
    </Button>
  );
};
