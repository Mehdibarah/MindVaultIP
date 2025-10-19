import { createConfig, http } from 'wagmi'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { base, mainnet } from 'wagmi/chains'

// Optimized wagmi config for faster connections
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
          '--w3m-z-index': '1000'
        }
      }
    }),
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
export function setupWeb3Modal() {
  createWeb3Modal({
    wagmiConfig,
    projectId: import.meta.env.VITE_WC_PROJECT_ID || '1279cd8b19e9ce4ba19e81e410bc4552',
    chains: [base, mainnet],
    enableAnalytics: false, // Disable analytics for faster loading
    enableOnramp: false, // Disable onramp for faster loading
    themeMode: 'dark',
    themeVariables: {
      '--w3m-z-index': '1000',
      '--w3m-accent': '#3b82f6',
      '--w3m-border-radius-master': '8px',
    },
    // Optimize modal behavior
    defaultChain: base,
    featuredWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Coinbase Wallet
    ],
  })
}

// Export base chain for easy access
export { base }
