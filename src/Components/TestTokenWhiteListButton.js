import { useOpenContractCall } from "@micro-stacks/react";
import { contractPrincipalCV, trueCV } from "micro-stacks/clarity";
import { Button } from "@chakra-ui/react";

export const TestTokenWhiteListButton = (props) => {
  const { token } = props;

  const { handleContractCall } = useOpenContractCall({
    contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    contractName: "scarcity-token",
    functionName: "set-whitelisted",
    functionArgs: [contractPrincipalCV(token.fullAddress), trueCV(true)],
    postConditions: token.postConditions,
  });

  console.log(props);
  return (
    <Button onClick={handleContractCall}>
      {`whitelist ${token.contractName}`}
    </Button>
  );
};
