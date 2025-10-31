/**
 * Payment Configuration Utility
 * Validates environment variables and provides payment configuration
 */

import { isAddress, getAddress } from 'viem';

export interface PaymentConfig {
  enabled: boolean;
  reason?: string;
  chainId: number;
  regFeeWei: bigint;
  to: string;
  rpcUrl: string;
  contract?: string;
}

/**
 * Validates if a string is a valid checksum Ethereum address
 */
function isValidAddress(address: string): boolean {
  try {
    return isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Converts ETH amount to Wei
 */
function ethToWei(ethAmount: string | number): bigint {
  const eth = typeof ethAmount === 'string' ? parseFloat(ethAmount) : ethAmount;
  return BigInt(Math.floor(eth * 1e18));
}

/**
 * Gets payment configuration from environment variables
 * Returns configuration with enabled=true only if all required envs are valid
 */
export function getPaymentConfig(): PaymentConfig {
  // Check if payments are explicitly enabled
  const paymentsEnabled = import.meta.env.VITE_PAYMENTS_ENABLED === 'true';
  
  if (!paymentsEnabled) {
    return {
      enabled: false,
      reason: 'Payments are disabled (VITE_PAYMENTS_ENABLED is not "true")',
      chainId: 0,
      regFeeWei: 0n,
      to: '',
      rpcUrl: '',
    };
  }

  // Validate payment address
  const paymentAddress = import.meta.env.VITE_PAYMENT_ADDRESS;
  if (!paymentAddress || !isValidAddress(paymentAddress)) {
    return {
      enabled: false,
      reason: 'Invalid or missing payment address (VITE_PAYMENT_ADDRESS)',
      chainId: 0,
      regFeeWei: 0n,
      to: '',
      rpcUrl: '',
    };
  }

  // Validate chain ID
  const chainIdStr = import.meta.env.VITE_CHAIN_ID;
  const chainId = chainIdStr ? parseInt(chainIdStr, 10) : 0;
  if (!chainId || isNaN(chainId) || chainId <= 0) {
    return {
      enabled: false,
      reason: 'Invalid or missing chain ID (VITE_CHAIN_ID)',
      chainId: 0,
      regFeeWei: 0n,
      to: '',
      rpcUrl: '',
    };
  }

  // Validate registration fee
  const regFeeEth = import.meta.env.VITE_REG_FEE_ETH;
  const regFee = regFeeEth ? parseFloat(regFeeEth) : 0;
  if (!regFee || regFee <= 0 || isNaN(regFee)) {
    return {
      enabled: false,
      reason: 'Invalid or missing registration fee (VITE_REG_FEE_ETH)',
      chainId: 0,
      regFeeWei: 0n,
      to: '',
      rpcUrl: '',
    };
  }

  // Validate RPC URL
  const rpcUrl = import.meta.env.VITE_RPC_URL;
  if (!rpcUrl || typeof rpcUrl !== 'string') {
    return {
      enabled: false,
      reason: 'Invalid or missing RPC URL (VITE_RPC_URL)',
      chainId: 0,
      regFeeWei: 0n,
      to: '',
      rpcUrl: '',
    };
  }

  // Optional contract address
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const contract = contractAddress && isValidAddress(contractAddress) ? getAddress(contractAddress) : undefined;

  // All validations passed
  return {
    enabled: true,
    chainId,
    regFeeWei: ethToWei(regFee),
    to: getAddress(paymentAddress),
    rpcUrl,
    contract,
  };
}

/**
 * Debug helper to log payment configuration
 */
export function logPaymentConfig(): void {
  const config = getPaymentConfig();
  console.log('[payments]', config);
  
  if (!config.enabled) {
    console.warn('[payments] Payment system disabled:', config.reason);
  } else {
    console.log('[payments] Payment system enabled');
  }
}
