import { useState } from "react"
import { useContractCall } from "@micro-stacks/react";
import { 
  Stack,
  Text,
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
import { useEnvStore } from '../index';

export const ContractCallButton = (props) => {
  const { token, burnAmountUser, handleResetInputFunc, disabled, userInfo, handlePendingTxStatus} = props;
  const scarcityToken = useEnvStore((state) => state.env);
  // gets NFT id from Stacks API based on user and scarcity contract

  const defineContractFunction = () => {
    if (userInfo) {
      return 'mint-burn-scarcity'
    } else {
      return 'initial-mint-scarcity'
    }
  }
  
  const functionArgs = () => {
    if (userInfo) {
      return [
        uintCV(burnAmountUser*(Math.pow(10,token.decimal))),
        uintCV(userInfo["nft-id"]),
        token.functionArguments.standard,
        token.functionArguments.contract,
      ]; 
    } else {
      return [
        uintCV(burnAmountUser*(Math.pow(10,token.decimal))),
        token.functionArguments.standard,
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
            uintCV(Number(userInfo["nft-id"])),
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

  const { handleContractCall } = useContractCall ({
    contractAddress: token.contractAddress,
    contractName: token.contractName,
    functionName: defineContractFunction(),
    functionArgs: functionArgs(),
    postConditions: postConditions(),
    onFinish: async data => {
      console.log('finished contract call!', data.txId);
      window.localStorage.setItem('scarcityTx', data.txId); 
      handlePendingTxStatus();
      handleResetInputFunc();
    }
  });

  return (
    <Button onClick={ handleContractCall } isDisabled={ disabled }>
      {token ? token.buttonName : 'Burn'}
    </Button>
  ) 
}