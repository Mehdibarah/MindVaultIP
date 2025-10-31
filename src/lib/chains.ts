import { base } from 'viem/chains'

// Export Base mainnet chain
export { base }

// Export Base chain constants
export const BASE_CHAIN_ID = 8453
export const BASE_CHAIN_HEX = '0x2105'

// Base chain configuration for wallet_addEthereumChain
export const BASE_CHAIN_CONFIG = {
  chainId: BASE_CHAIN_HEX,
  chainName: 'Base',
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
}
