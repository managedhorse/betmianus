// src/config.ts
import { http, createConfig } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';

const projectId = '30af56515c05013a5179f041e6756db7'; // Replace with your WalletConnect project ID

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});