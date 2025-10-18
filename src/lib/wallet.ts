import { createConfig, http } from 'wagmi'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { base, mainnet } from 'wagmi/chains'

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

export const queryClient = new QueryClient()

export function setupWeb3Modal() {
  createWeb3Modal({
    wagmiConfig,
    projectId: import.meta.env.VITE_WC_PROJECT_ID || '1279cd8b19e9ce4ba19e81e410bc4552',
    chains: [base, mainnet],
  })
}
