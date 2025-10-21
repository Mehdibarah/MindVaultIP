import { ethers } from 'ethers';

/**
 * Environment helper functions for payment system
 */

// Get contract address
export function getContractAddress(): string {
  return (import.meta.env.VITE_CONTRACT_ADDRESS || '').trim();
}

// Get payment address
export function getPaymentAddress(): string {
  return (import.meta.env.VITE_PAYMENT_ADDRESS || '').trim();
}

// Check if payments are enabled
export function paymentsEnabled(): boolean {
  const enabled = (import.meta.env.VITE_PAYMENTS_ENABLED || '').trim().toLowerCase();
  return enabled === 'true';
}

// Get registration fee as string
export function getRegFeeString(): string {
  return (import.meta.env.VITE_REG_FEE_ETH || '').trim();
}

// Get registration fee as number
export function getRegFee(): number {
  const feeStr = getRegFeeString();
  const fee = parseFloat(feeStr);
  return isNaN(fee) ? 0 : fee;
}

// Get chain ID
export function getChainId(): number {
  const chainId = import.meta.env.VITE_CHAIN_ID;
  const parsed = parseInt(chainId || '8453', 10);
  return isNaN(parsed) ? 8453 : parsed;
}

// Get RPC URL
export function getRpcUrl(): string {
  return (import.meta.env.VITE_RPC_URL || '').trim();
}

// Validate payment address
export function isValidPaymentAddress(): boolean {
  const address = getPaymentAddress();
  return address.length === 42 && ethers.utils.isAddress(address);
}

// Validate registration fee
export function isValidRegFee(): boolean {
  const fee = getRegFee();
  return fee > 0;
}

// Debug environment values
export function debugEnv() {
  return {
    contractAddress: getContractAddress(),
    paymentAddress: getPaymentAddress(),
    paymentsEnabled: paymentsEnabled(),
    regFeeString: getRegFeeString(),
    regFee: getRegFee(),
    chainId: getChainId(),
    rpcUrl: getRpcUrl(),
    isValidPaymentAddress: isValidPaymentAddress(),
    isValidRegFee: isValidRegFee(),
  };
}
