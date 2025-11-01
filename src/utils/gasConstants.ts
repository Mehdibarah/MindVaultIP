// ✅ Using ethers v5 for parseEther (not viem)
import { ethers } from 'ethers';

// Registration fee from environment variable with fallback
export const REG_FEE = (import.meta?.env?.VITE_REG_FEE_ETH ?? "0.001").toString();

// Base network gas constants for mobile MetaMask compatibility
export const BASE_SAFE_GAS = 150000n;      // enough headroom for mobile
export const MAX_FEE_GWEI = 5n;            // ~cheap on Base
export const MAX_PRIO_GWEI = 1n;

// Helper to convert gwei to wei
export const toWei = (gwei: bigint): bigint => gwei * 1_000_000_000n;

// Base network chain IDs
export const BASE_MAINNET_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;

// Check if chain is Base network
export function isBaseNetwork(chainId: number | bigint | undefined): boolean {
  if (!chainId) return false;
  const id = typeof chainId === 'bigint' ? Number(chainId) : chainId;
  return id === BASE_MAINNET_CHAIN_ID || id === BASE_SEPOLIA_CHAIN_ID;
}

// Get safe gas parameters for Base network
export function getBaseGasParams(chainId?: number | bigint) {
  const isBase = isBaseNetwork(chainId);
  
  if (!isBase) {
    return {}; // Let wallet estimate for non-Base networks
  }
  
  return {
    gas: BASE_SAFE_GAS,
    maxFeePerGas: toWei(MAX_FEE_GWEI),
    maxPriorityFeePerGas: toWei(MAX_PRIO_GWEI),
  };
}

// Get registration fee in wei (returns bigint for compatibility)
export function getRegistrationFeeWei(): bigint {
  // ✅ ethers v5: utils.parseEther returns BigNumber, convert to bigint
  const bn = ethers.utils.parseEther(REG_FEE);
  return BigInt(bn.toString());
}
