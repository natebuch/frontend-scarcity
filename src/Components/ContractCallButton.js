import { useState, useEffect} from "react"
import { useContractCall } from "@micro-stacks/react";
import { 
  Button,
} from '@chakra-ui/react';
import {
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
} from 'micro-stacks/transactions';
import {
  uintCV,
  noneCV,
  someCV,
} from 'micro-stacks/clarity';

export const ContractCallButton = (props) => {
  const { token, burnAmountUser, handleResetInputFunc, disabled, userInfo, userNft, currentStxAddress} = props;
  const nftIdFromUser = Number(userNft.slice(1)) 
  // gets NFT id from Stacks API based on user and scarcity contract


  const functionArgs = () => {
    if (userInfo) {
      return [
        uintCV(burnAmountUser*(Math.pow(10,token.decimal))),
        token.functionArguments.standard,
        someCV(uintCV(nftIdFromUser)),
        token.functionArguments.contract,
      ]; 
    } else {
      return [
        uintCV(burnAmountUser*(Math.pow(10,token.decimal))),
        token.functionArguments.standard,
        noneCV(),
        token.functionArguments.contract,
      ]
    }
  };

  const postConditions = () => {
    if (userInfo) {
      return [
        makeStandardFungiblePostCondition(
          token.postConditions.address,
          token.postConditions.codeFT,
          burnAmountUser*(Math.pow(10,token.decimal)),
          token.postConditions.assetInfoFT,
        ),
        makeStandardNonFungiblePostCondition(
          token.postConditions.address,
          token.postConditions.codeNFT,
          token.postConditions.assetInfoNFT,
          uintCV(nftIdFromUser),
        ),
      ]
    } else {
      return [
        makeStandardFungiblePostCondition(
          token.postConditions.address,
          token.postConditions.codeFT,
          burnAmountUser*(Math.pow(10,token.decimal)),
          token.postConditions.assetInfoFT,
        ),
      ]
    }
  };

  const storeTxAddress = (data) => {
    window.localStorage.setItem(currentStxAddress,data.txId);
    handleResetInputFunc();
  }

  const { handleContractCall } = useContractCall ({
    contractAddress: token.contractAddress,
    contractName: token.contractName,
    functionName: token.functionName,
    functionArgs: functionArgs(),
    postConditions: postConditions(),
    onFinish: async data => {
      console.log('finished contract call!', data);
      storeTxAddress(data)
    },
  });

  return (
    <Button onClick={ handleContractCall } isDisabled={ disabled }>
      {token ? token.buttonName : 'Burn'}
    </Button>
    )
}