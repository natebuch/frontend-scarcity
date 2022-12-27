import { useState, useEffect } from "react";
import {
  Button,
  VStack,
  HStack,
  Text,
  Select,
  Input,
  FormControl,
  UnorderedList,
  ListItem,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { standardPrincipalCV, contractPrincipalCV } from "micro-stacks/clarity";
import {
  FungibleConditionCode,
  createAssetInfo,
  NonFungibleConditionCode,
} from "micro-stacks/transactions";
import { fetchTxData } from "../API/blockchain";
import { ContractCallButton } from "./ContractCallButton";
import { shortenAddress } from "@stacks-os/utils";

export const UserInputs = (props) => {
  const {
    scarcityToken,
    currentStxAddress,
    userTokens,
    userInfo,
    userAssets,
    minBurnAmount,
  } = props;
  const [tokenSelect, setTokenSelect] = useState("");
  const [burnAmountUser, setBurnAmountUser] = useState("");
  const [burnToken, setBurnToken] = useState();
  const [currentTx, setCurrentTx] = useState(false);
  const [txStatus, setTxStatus] = useState("");

  const handleSetBurnAmountUser = (e) => {
    const re = /^[0-9.\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      setBurnAmountUser(e.target.value);
    }
  };

  const handlePendingTxStatus = (txId) => {
    setCurrentTx(txId);
  };

  const handleSetBurnToken = (e) => {
    const selectedTokenAddress = e.target.value;
    const token = userTokens.filter(
      (token) => token.tokenAddress === selectedTokenAddress
    )[0];
    setTokenSelect(token.tokenName);
    setBurnToken({
      name: token.tokenName,
      decimal: token.decimal,
      balance: token.tokenBalance,
      contractAddress: scarcityToken.address,
      contractName: scarcityToken.contractName,
      functionArguments: {
        standard: standardPrincipalCV(currentStxAddress),
        contract: contractPrincipalCV(token.tokenAddress),
      },
      postConditions: {
        address: currentStxAddress,
        codeFT: FungibleConditionCode.GreaterEqual,
        assetInfoFT: createAssetInfo(
          token.tokenAddress.split(".")[0],
          token.tokenAddress.split(".")[1],
          token.tokenName
        ),
        codeNFT: NonFungibleConditionCode.DoesNotOwn,
        assetInfoNFT: createAssetInfo(
          scarcityToken.address,
          scarcityToken.name,
          scarcityToken.name
        ),
      },
      buttonName: `🔥 Burn 🔥`,
    });
  };

  const handleResetInputs = () => {
    setBurnAmountUser("");
  };

  useEffect(() => {
    async function checkTx() {
      const txId = window.localStorage.getItem("scarcityTx");
      if (txId) {
        const txData = await fetchTxData(txId, scarcityToken.apiUrl);
        if (txData.tx_status === "pending") {
          setTxStatus("pending");
        } else {
          setTxStatus("");
          window.localStorage.removeItem("scarcityTx");
        }
      } else {
        setTxStatus("");
      }
    }
    checkTx();
  }, [currentTx]);

  return (
    <VStack>
      {userInfo ? (
        <HStack justify="space-between">
          <Text>
            Total Burnt Amount:{" "}
            {userInfo["burnt-amount"]
              ? Number(userInfo["burnt-amount"]) /
                Math.pow(10, userTokens[0] && userTokens[0].decimal)
              : ""}
          </Text>
          <Text>
            Scarcity NFT ID:{" "}
            {userInfo["nft-id"] ? Number(userInfo["nft-id"]) : "no token"}
          </Text>
        </HStack>
      ) : (
        ""
      )}
      <HStack borderWidth="2px" p="3">
        <VStack>
          {userTokens.length > 0 ? (
            <>
              <Text fontSize="3xl">Balance</Text>
              <UnorderedList styleType="none">
                {userTokens.map((token) => {
                  return (
                    <ListItem key={token.tokenName}>
                      {token.tokenName}:{" "}
                      {Number(token.tokenBalance) / Math.pow(10, token.decimal)}
                    </ListItem>
                  );
                })}
              </UnorderedList>
            </>
          ) : (
            <>
              <Text fontSize="3xl">Balance</Text>
              <Text fontSize="sm">No burnable assets</Text>
            </>
          )}
        </VStack>
        <VStack p="3">
          {txStatus === "pending" ? (
            <VStack>
              <Text fontSize="sm">
                There is a pending transaction for this address.
              </Text>
              <Link
                href={`https://explorer.stacks.co/txid/${window.localStorage.getItem(
                  "scarcityTx"
                )}?chain=mainnet`}
                isExternal
              >
                <HStack>
                  <Text fontSize="sm">
                    {shortenAddress(window.localStorage.getItem("scarcityTx"))}
                  </Text>
                  <ExternalLinkIcon mx="2px" />
                </HStack>
              </Link>
              <Text fontSize="sm">Refresh Page to Burn.</Text>
            </VStack>
          ) : (
            <VStack>
              <Select onChange={handleSetBurnToken}>
                <option selected disabled value="">
                  Select Token to Burn
                </option>
                {userTokens.map((token) => {
                  if (token.tokenBalance >= minBurnAmount) {
                    return (
                      <option key={token.tokenName} value={token.tokenAddress}>
                        {token.tokenName}
                      </option>
                    );
                  }
                })}
              </Select>
              <FormControl>
                <Input
                  type="tel"
                  disabled={tokenSelect === "" ? true : false}
                  placeholder={`Amount - Min. ${minBurnAmount}`}
                  value={burnAmountUser}
                  autoComplete="off"
                  onChange={handleSetBurnAmountUser}
                ></Input>
              </FormControl>
              {burnToken && burnAmountUser >= minBurnAmount ? (
                <ContractCallButton
                  userAssets={userAssets && userAssets}
                  userInfo={userInfo}
                  currentStxAddress={currentStxAddress}
                  token={burnToken}
                  burnAmountUser={burnAmountUser}
                  handleResetInputFunc={handleResetInputs}
                  handlePendingTxStatus={handlePendingTxStatus}
                />
              ) : (
                <Button disabled>Burn</Button>
              )}
            </VStack>
          )}
        </VStack>
      </HStack>
    </VStack>
  );
};
