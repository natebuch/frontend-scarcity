import { fetchReadOnlyFunction, fetchTransaction } from "micro-stacks/api";
import { standardPrincipalCV } from "micro-stacks/clarity";

export async function fetchTxData(txId, url) {
  const txData = await fetchTransaction({
    txid: txId,
    url: url,
  });
  console.log(txData);
  return txData;
}

export async function fetchWhitelistedAssets(network, contract, stxAddress) {
  const whitelistedAssets = await fetchReadOnlyFunction({
    network: network,
    contractAddress: contract.address,
    contractName: contract.contractName,
    functionArgs: [],
    functionName: "get-whitelist",
    sender: stxAddress,
  });
  return whitelistedAssets;
}

export async function fetchTokenBalance(network, asset, stxAddress) {
  const tokenBalance = await fetchReadOnlyFunction({
    network: network,
    contractAddress: asset.split(".")[0],
    contractName: asset.split(".")[1],
    functionArgs: [standardPrincipalCV(stxAddress)],
    functionName: "get-balance",
    sender: stxAddress,
  });
  return Number(tokenBalance);
}

export async function fetchMinBurnAmount(network, contract, stxAddress) {
  const minBurnAmount = await fetchReadOnlyFunction({
    network: network,
    contractAddress: contract.address,
    contractName: contract.contractName,
    functionArgs: [],
    functionName: "get-min-burn-amount",
    sender: stxAddress,
  });
  return Number(minBurnAmount);
}

export async function fetchDecimal(network, asset, stxAddress) {
  const decimal = await fetchReadOnlyFunction({
    network: network,
    contractAddress: asset.split(".")[0],
    contractName: asset.split(".")[1],
    functionArgs: [],
    functionName: "get-decimals",
    sender: stxAddress,
  });
  return Number(decimal);
}

export async function fetchTokenName(network, asset, stxAddress) {
  const tokenName = await fetchReadOnlyFunction({
    network: network,
    contractAddress: asset.split(".")[0],
    contractName: asset.split(".")[1],
    functionArgs: [],
    functionName: "get-name",
    sender: stxAddress,
  });
  return tokenName;
}

export async function fetchTokenSymbol(network, asset, stxAddress) {
  const tokenSymbol = await fetchReadOnlyFunction({
    network: network,
    contractAddress: asset.split(".")[0],
    contractName: asset.split(".")[1],
    functionArgs: [],
    functionName: "get-symbol",
    sender: stxAddress,
  });
  return tokenSymbol;
}

export async function fetchUserInfo(network, contract, stxAddress) {
  const userInfo = await fetchReadOnlyFunction({
    network: network,
    contractAddress: contract.address,
    contractName: contract.contractName,
    functionArgs: [standardPrincipalCV(stxAddress)],
    functionName: "get-user-info",
    sender: stxAddress,
  });
  return userInfo;
}

export async function fetchUserAssets(contract, stxAddress) {
  const url = `${contract.apiUrl}/extended/v1/tokens/nft/holdings?principal=${stxAddress}&asset_identifiers[]=${contract.address}.${contract.contractName}::${contract.name}`;
  const data = await fetch(url);
  const response = await data.json();
  return response;
}

// fetchWhitelistedAssets, fetchUserAssets, fetchUserInfo, fetchTokenSymbol, fetchTokenSymbol, fetchTokenName, fetchDecimal, fetchMinBurnAmount, fetchTokenBalance
