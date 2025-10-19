import { createConfig, http } from 'wagmi'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { base, mainnet } from 'wagmi/chains'

// Single shared wagmi config
export const wagmiConfig = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: 'MindVaultIP' }),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID || '1279cd8b19e9ce4ba19e81e410bc4552' }),
  ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: false,
})

// Single shared query client
export const queryClient = new QueryClient()

// Web3Modal setup using the same wagmi config
export function setupWeb3Modal() {
  createWeb3Modal({
    wagmiConfig,
    projectId: import.meta.env.VITE_WC_PROJECT_ID || '1279cd8b19e9ce4ba19e81e410bc4552',
    chains: [base, mainnet],
  })
}

// Export base chain for easy access
export { base }
