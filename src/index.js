import React from 'react';
import ReactDOM from 'react-dom/client';
import { MicroStacksProvider } from '@micro-stacks/react';
import { StacksMocknet, StacksMainnet } from 'micro-stacks/network';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react';

const authOptions = {
  appDetails: {
    name: 'Scarcity',
    icon: '/my-app-icon.png',
  },

}

const network = new StacksMocknet()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <MicroStacksProvider authOptions={authOptions} network={network}>
        <App />
    </MicroStacksProvider>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
