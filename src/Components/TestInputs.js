import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  VStack,
  Text,
} from "@chakra-ui/react";
import { TestTokenMintButton } from "./TestTokenMintButton";
import { TestTokenWhiteListButton } from "./TestTokenWhiteListButton";
import { standardPrincipalCV, uintCV } from "micro-stacks/clarity";

export const TestInputs = (props) => {
  const { stxAddress } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const testTokenOne = {
    fullAddress:
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mint-test-token-one",
    contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    contractName: "mint-test-token-one",
    functionName: "mint",
    functionArguments: [uintCV(1000000000), standardPrincipalCV(stxAddress)],
    postConditions: [],
    variantType: "warning",
    buttonName: "Mint Test Token One",
  };

  const testTokenTwo = {
    fullAddress:
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mint-test-token-two",
    contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    contractName: "mint-test-token-two",
    functionName: "mint",
    functionArguments: [uintCV(1000000000), standardPrincipalCV(stxAddress)],
    postConditions: [],
    variantType: "danger",
    buttonName: "Mint Test Token Two",
  };

  return (
    <>
      <Button onClick={onOpen}>Dev Tools</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Dev Tools
            <ModalCloseButton onClick={onClose} />
          </ModalHeader>
          <ModalBody>
            <Text>Mint tokens for testing.</Text>
            <VStack p="3">
              <TestTokenMintButton token={testTokenOne} />
              <TestTokenWhiteListButton token={testTokenOne} />
              <TestTokenMintButton token={testTokenTwo} />
              <TestTokenWhiteListButton token={testTokenTwo} />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
