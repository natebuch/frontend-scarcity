import { fetchReadOnlyFunction, fetchTransaction } from 'micro-stacks/api';
import {
  standardPrincipalCV
} from 'micro-stacks/clarity';

export async function fetchTxData(txId, url) {
  const txData = await fetchTransaction({
    txid: txId, 
    url: url
  })
  console.log(txData)
  return txData
};

export async function fetchWhitelistedAssets(network,contract,currentStxAddress) { 
  const whitelistedAssets = await fetchReadOnlyFunction({
    network: network,
    contractAddress: contract.address,
    contractName: contract.contractName,
    functionArgs: [],
    functionName: 'get-whitelist',
    sender: currentStxAddress,
  });
  return whitelistedAssets
};  

export async function fetchTokenBalance(network,asset,currentStxAddress) { 
  const tokenBalance = await fetchReadOnlyFunction({
    network: network,
    contractAddress: asset.split('.')[0],
    contractName: asset.split('.')[1],
    functionArgs: [standardPrincipalCV(currentStxAddress)],
    functionName: 'get-balance',
    sender: currentStxAddress,
  });
  return Number(tokenBalance)
}; 

export async function fetchMinBurnAmount(network,contract,currentStxAddress) {
  const minBurnAmount = await fetchReadOnlyFunction({
    network: network,
    contractAddress: contract.address,
    contractName: contract.contractName,
    functionArgs: [],
    functionName: 'get-min-burn-amount',
    sender: currentStxAddress,

  });
  return Number(minBurnAmount)
}

export async function fetchDecimal(network,asset,currentStxAddress) { 
  const decimal = await fetchReadOnlyFunction({
    network: network,
    contractAddress: asset.split('.')[0],
    contractName: asset.split('.')[1],
    functionArgs: [],
    functionName: 'get-decimals',
    sender: currentStxAddress,
  });
  return Number(decimal)
}; 

export async function fetchTokenName(network,asset,currentStxAddress) { 
  const tokenName = await fetchReadOnlyFunction({
    network: network,
    contractAddress: asset.split('.')[0],
    contractName: asset.split('.')[1],
    functionArgs: [],
    functionName: 'get-name',
    sender: currentStxAddress,
  });
  return tokenName
};

export async function fetchTokenSymbol(network,asset,currentStxAddress) { 
  const tokenSymbol = await fetchReadOnlyFunction({
    network: network,
    contractAddress: asset.split('.')[0],
    contractName: asset.split('.')[1],
    functionArgs: [],
    functionName: 'get-symbol',
    sender: currentStxAddress,
  });
  return tokenSymbol
};

export async function fetchUserInfo(network,contract,currentStxAddress) { 
  const userInfo = await fetchReadOnlyFunction({
    network: network,
    contractAddress: contract.address,
    contractName: contract.contractName,
    functionArgs: [standardPrincipalCV(currentStxAddress)],
    functionName: 'get-user-info',
    sender: currentStxAddress,
  });
  return userInfo
};

export async function fetchUserAssets(contract,currentStxAddress) {
  const url = `${contract.apiUrl}/extended/v1/tokens/nft/holdings?principal=${currentStxAddress}&asset_identifiers[]=${contract.address}.${contract.contractName}::${contract.name}`
  const data = await fetch(url)
  const response = await data.json()
  return response
}

// fetchWhitelistedAssets, fetchUserAssets, fetchUserInfo, fetchTokenSymbol, fetchTokenSymbol, fetchTokenName, fetchDecimal, fetchMinBurnAmount, fetchTokenBalance