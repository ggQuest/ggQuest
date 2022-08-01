import React from 'react';
import logo from './logo.svg';
import './App.css';
import RootApp from './components/RootApp';
import '@rainbow-me/rainbowkit/styles.css';

import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';


function App() {

  const ALCHEMY_ID = process.env.ALCHEMY_ID;
  const {chains, provider} = configureChains(
    [chain.mainnet, chain.polygon,chain.optimism, chain.arbitrum],
    [alchemyProvider({ apiKey: ALCHEMY_ID }),
      publicProvider()]
  )

  const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains
  });
  
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider theme={darkTheme()} chains={chains} coolMode>
        <RootApp/>
      </RainbowKitProvider>
    </WagmiConfig>
    
  );
}

export default App;
