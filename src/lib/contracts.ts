import { Address } from 'viem'
import mindVaultIPCoreABI from './mindvaultipcoreABI.json'

// Contract addresses from environment variables
export const CONTRACT_ADDRESSES = {
  MIND_VAULT_IP_CORE: (import.meta.env.VITE_CONTRACT_ADDRESS || '0xB4be9e66c80fcbe317C5038baDca1') as Address,
  PAYMENT: (import.meta.env.VITE_PAYMENT_ADDRESS || '0x63A8000bD167183AA43629d7C315d0FCc14B95ea') as Address,
} as const

// Contract ABIs
export const CONTRACT_ABIS = {
  MIND_VAULT_IP_CORE: mindVaultIPCoreABI,
} as const

// Network configuration
export const NETWORK_CONFIG = {
  CHAIN_ID: Number(import.meta.env.VITE_CHAIN_ID || '8453'),
  NETWORK: import.meta.env.VITE_NETWORK || 'base',
} as const

// Contract configuration for wagmi
export const contractConfig = {
  address: CONTRACT_ADDRESSES.MIND_VAULT_IP_CORE,
  abi: CONTRACT_ABIS.MIND_VAULT_IP_CORE,
} as const

export const paymentContractConfig = {
  address: CONTRACT_ADDRESSES.PAYMENT,
  abi: CONTRACT_ABIS.MIND_VAULT_IP_CORE, // Assuming same ABI for now
} as const

// Helper function to get contract address
export function getContractAddress(contract: keyof typeof CONTRACT_ADDRESSES): Address {
  return CONTRACT_ADDRESSES[contract]
}

// Helper function to get contract ABI
export function getContractABI(contract: keyof typeof CONTRACT_ABIS) {
  return CONTRACT_ABIS[contract]
}

// Validate contract addresses
export function validateContractAddresses() {
  const errors: string[] = []
  
  if (!CONTRACT_ADDRESSES.MIND_VAULT_IP_CORE || CONTRACT_ADDRESSES.MIND_VAULT_IP_CORE === '0x') {
    errors.push('MIND_VAULT_IP_CORE contract address is not set')
  }
  
  if (!CONTRACT_ADDRESSES.PAYMENT || CONTRACT_ADDRESSES.PAYMENT === '0x') {
    errors.push('PAYMENT contract address is not set')
  }
  
  if (errors.length > 0) {
    console.warn('Contract configuration issues:', errors)
  }
  
  return errors.length === 0
}

// Initialize contract validation
if (typeof window !== 'undefined') {
  validateContractAddresses()
}

