// src/AppKitProvider.jsx
import React from 'react';
import { createAppKit } from '@reown/appkit/react';

import { sepolia, baseSepolia } from '@reown/appkit/networks';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';


const queryClient = new QueryClient();


const projectId = import.meta.env.VITE_PROJECT_ID;


const metadata = {
  name: 'spug',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit',
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
};


const networks = [sepolia, baseSepolia];


const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});


createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, 
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': "'Slackey', cursive", 
    '--w3m-accent': '#FFBED9', 
    '--w3m-color-mix': '#FFBC42', 
    '--w3m-color-mix-strength': 30,
    '--w3m-font-size-master': '8px',
    '--w3m-border-radius-master': '4px',
},
});


export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
