import React from 'react'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { base } from './chains'

// Create query client (singleton)
export const queryClient = new QueryClient()

// Create wagmi config
export const config = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: 'MindVaultIP',
      headlessMode: false,
    }),
    walletConnect({
      projectId: import.meta.env.VITE_WC_PROJECT_ID || '1279cd8b19e9ce4ba19e81e410bc4552',
    }),
  ],
  transports: {
    [base.id]: http(
      import.meta.env.VITE_RPC_URL || 'https://mainnet.base.org'
    ),
  },
  ssr: false,
})

// Web3Modal setup function - call this only once
let web3ModalInitialized = false;

export function setupWeb3Modal() {
  // Prevent double initialization
  if (web3ModalInitialized) {
    console.warn('[Wagmi] Web3Modal already initialized, skipping...');
    return;
  }

  createWeb3Modal({
    wagmiConfig: config,
    projectId: import.meta.env.VITE_WC_PROJECT_ID || '1279cd8b19e9ce4ba19e81e410bc4552',
    chains: [base],
    enableAnalytics: false,
    enableOnramp: false,
    themeMode: 'dark',
    themeVariables: {
      '--wcm-z-index': '1000',
      '--wcm-accent-color': '#3b82f6',
      '--wcm-border-radius-master': '8px',
    },
    defaultChain: base,
    featuredWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Coinbase Wallet
    ],
  });

  web3ModalInitialized = true;
  console.log('[Wagmi] ✅ Web3Modal initialized');
}

// Web3Providers component
export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Export config and queryClient for use in hooks
export { config, queryClient }
