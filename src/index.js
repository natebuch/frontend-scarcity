//React
import React from "react";
import ReactDOM from "react-dom/client";

//Microstack
import * as MicroStacks from "@micro-stacks/react";
import { StacksMocknet, StacksMainnet } from "micro-stacks/network";

//Manage Global State
import create from "zustand";

//General
import App from "./App";
import reportWebVitals from "./reportWebVitals";

//Styling
import { ChakraProvider } from "@chakra-ui/react";

//Networks
// const network = new StacksMocknet();
const network = "mainnet";

// DevNet
const scarcityTokenDev = {
  address: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  contractName: "scarcity-token",
  name: "scarcity-token",
  apiUrl: "http://localhost:3999",
};

// MainNet
const scarcityTokenMain = {
  address: "SP1360BMRNRYWMHP9MWVD2B0VYET8G6MC8N0DH1MQ",
  contractName: "scarcity-v2",
  name: "scarcity-token",
  apiUrl: "https://stacks-node-api.mainnet.stacks.co",
};

console.log(network);
const defineStore = () => {
  if (network.bnsLookupUrl === "http://localhost:3999") {
    const useStore = create(() => ({
      env: scarcityTokenDev,
    }));
    return useStore;
  } else {
    const useStore = create(() => ({
      env: scarcityTokenMain,
    }));
    return useStore;
  }
};

export const useEnvStore = defineStore();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MicroStacks.ClientProvider
    appName="Scarcity"
    appIconUrl="🔥"
    network={network}
  >
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </MicroStacks.ClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
