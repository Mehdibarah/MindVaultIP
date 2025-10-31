import { createConfig, http } from 'wagmi'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { base, mainnet } from 'wagmi/chains'

// Note: Ledger HID connector removed to avoid HID permission errors on page load
// Ledger Live is still available through WalletConnect in Web3Modal (no HID required)
export const wagmiConfig = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected({ 
      shimDisconnect: true,
      shimChainChangedDisconnect: true, // Faster chain switching
    }),
    coinbaseWallet({ 
      appName: 'MindVaultIP',
      appLogoUrl: undefined, // Skip logo loading for faster init
    }),
    walletConnect({ 
      projectId: import.meta.env.VITE_WC_PROJECT_ID || '1279cd8b19e9ce4ba19e81e410bc4552',
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'dark',
        themeVariables: {
          '--wcm-z-index': '1000'
        }
      }
    }),
    // Ledger support: Ledger Live is available through WalletConnect
    // HID connector removed to avoid permission errors on page load
  ],
  transports: {
    [base.id]: http(undefined, {
      batch: true, // Enable request batching for better performance
      retryCount: 3, // Retry failed requests
      retryDelay: 1000, // 1 second delay between retries
    }),
    [mainnet.id]: http(undefined, {
      batch: true,
      retryCount: 3,
      retryDelay: 1000,
    }),
  },
  ssr: true,
  storage: typeof window !== 'undefined' ? localStorage : undefined,
  // Add connection timeout and retry settings
  multiInjectedProviderDiscovery: true, // Better provider detection
})

// Optimized query client for faster wallet operations
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - reduce refetch frequency
      gcTime: 1000 * 60 * 10, // 10 minutes - keep data longer
      retry: 2, // Reduce retry attempts for faster failures
      retryDelay: 1000, // 1 second between retries
      refetchOnWindowFocus: false, // Disable refetch on window focus
      refetchOnMount: false, // Disable refetch on component mount
    },
    mutations: {
      retry: 1, // Reduce mutation retries
      retryDelay: 500, // Faster retry for mutations
    },
  },
})

// Optimized Web3Modal setup for faster connections
let web3ModalInitialized = false;

export function setupWeb3Modal() {
  // Prevent double initialization
  if (web3ModalInitialized) {
    console.warn('[Wagmi] Web3Modal already initialized, skipping...');
    return;
  }

  createWeb3Modal({
    wagmiConfig,
    projectId: import.meta.env.VITE_WC_PROJECT_ID || '1279cd8b19e9ce4ba19e81e410bc4552',
    chains: [base, mainnet],
    enableAnalytics: false, // Disable analytics for faster loading
    enableOnramp: false, // Disable onramp for faster loading
    themeMode: 'dark',
    themeVariables: {
      '--wcm-z-index': '1000',
      '--wcm-accent-color': '#3b82f6',
      '--wcm-border-radius-master': '8px',
    },
    // Optimize modal behavior
    defaultChain: base,
    featuredWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Coinbase Wallet
      '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927', // Ledger Live
    ],
  })

  web3ModalInitialized = true;
  console.log('[Wagmi] ✅ Web3Modal initialized');
}

// Export base chain for easy access
export { base }
