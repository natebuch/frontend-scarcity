import { useState, useEffect } from "react";
import { useAuth, useUser, useNetwork } from "@micro-stacks/react";
import {
  fetchWhitelistedAssets,
  fetchUserAssets,
  fetchUserInfo,
  fetchTokenSymbol,
  fetchTokenName,
  fetchDecimal,
  fetchMinBurnAmount,
  fetchTokenBalance,
} from "./API/blockchain";
import {
  Box,
  Heading,
  HStack,
  VStack,
  Button,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { sortBy } from "lodash";
import { UserInputs } from "./Components/UserInputs";
import { TestInputs } from "./Components/TestInputs";
import { useEnvStore } from "./index";

const token = {
  tokenAddress: "address",
  tokenName: "name",
  tokenSymbol: "symbol",
  tokenBalance: 1,
  decimal: 1,
};

function App() {
  const { isSignedIn, handleSignIn, handleSignOut, isLoading } = useAuth();
  const { currentStxAddress, ...rest } = useUser();
  const { network } = useNetwork();
  const scarcityToken = useEnvStore((state) => state.env);
  const [userTokens, setUserTokens] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [userAssets, setUserAssets] = useState();
  const [minBurnAmount, setMinBurnAmount] = useState();

  async function buildTokenObj(asset) {
    const name = await fetchTokenName(network, asset, currentStxAddress);
    const symbol = await fetchTokenSymbol(network, asset, currentStxAddress);
    const balance = await fetchTokenBalance(network, asset, currentStxAddress);
    const decimal = await fetchDecimal(network, asset, currentStxAddress);
    const obj = Object.create(token);
    obj.tokenAddress = asset;
    obj.tokenName = name;
    obj.tokenSymbol = symbol;
    obj.tokenBalance = balance;
    obj.decimal = decimal;
    setUserTokens((userTokens) => [...userTokens, obj]);
  }

  const signOutUser = () => {
    handleSignOut();
    setUserTokens([]);
  };

  useEffect(() => {
    async function buildTokenData(contract) {
      const assetList = await fetchWhitelistedAssets(
        network,
        contract,
        currentStxAddress
      );
      const userInfo = await fetchUserInfo(
        network,
        contract,
        currentStxAddress
      );
      const userAssets = await fetchUserAssets(contract, currentStxAddress);
      const minBurnAmount = await fetchMinBurnAmount(
        network,
        contract,
        currentStxAddress
      );
      assetList.map((asset) => {
        return buildTokenObj(asset);
      });
      setUserInfo(userInfo);
      setUserAssets(userAssets);
      setMinBurnAmount(minBurnAmount);
      setDataLoading(false);
    }
    buildTokenData(scarcityToken);
  }, [currentStxAddress, isSignedIn]);

  return (
    <Box>
      <Box p="3">
        <HStack justify="space-between" spacing="2" w="100">
          <Heading size="md"> SCARCITY </Heading>
          <HStack>
            <Heading size="xs">{currentStxAddress}</Heading>
            <Button
              onClick={isSignedIn ? signOutUser : handleSignIn}
              isLoading={isLoading}
              loadingText="Connecting ..."
            >
              {isSignedIn ? "Sign out" : "Connect Stacks Wallet"}
            </Button>
          </HStack>
        </HStack>
      </Box>
      <Box>
        <VStack m="40px">
          <Heading size="3xl">🔥 SCARCITY PROJECT 🔥</Heading>
          {userTokens && !dataLoading && currentStxAddress ? (
            <UserInputs
              scarcityToken={scarcityToken}
              currentStxAddress={currentStxAddress}
              userTokens={sortBy(userTokens, ["tokenName"])}
              userTokens2={userTokens}
              userInfo={userInfo}
              userAssets={userAssets}
              minBurnAmount={minBurnAmount}
            />
          ) : currentStxAddress ? (
            <VStack p="10">
              <Spinner />
            </VStack>
          ) : (
            <VStack p="10">
              <Text>Please connect wallet to continue.</Text>
            </VStack>
          )}
          <pre>
            Burn whitelisted fungible tokens to mint a single Scarcity NFT.
          </pre>
          <pre>
            A wallet will only possess a single Scarcity NFT that tracks the
            amount burned.
          </pre>
          <pre>
            If a wallet performs multiple burn events, the existing NFT will be
            burned and new NFT will be minted.
          </pre>
          <pre>
            Each time a new Scarcity NFT is minted, the total amount burned by
            that wallet will be tracked.
          </pre>
        </VStack>
      </Box>
      <Box position="fixed" bottom="0" p="3">
        <HStack>
          {isSignedIn &&
          currentStxAddress &&
          network.bnsLookupUrl === "http://localhost:3999" ? (
            <HStack>
              <Text>Dev: </Text>
              {currentStxAddress && (
                <TestInputs currentStxAddress={currentStxAddress} />
              )}
            </HStack>
          ) : (
            ""
          )}
        </HStack>
      </Box>
    </Box>
  );
}

export default App;
