/**
 * Payment Utilities
 * Handles payment transactions using ethers.js
 */

import { ethers } from 'ethers';
import { getPaymentConfig, PaymentConfig } from './paymentConfig';

export interface PaymentResult {
  success: boolean;
  hash?: string;
  error?: string;
}

/**
 * Gets the appropriate provider from window.ethereum
 * Handles MetaMask and other EIP-1193 compatible wallets
 */
function getProvider(): ethers.providers.Web3Provider | null {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  // Handle multiple providers (MetaMask, etc.)
  const ethereum = window.ethereum;
  
  // If there are multiple providers, prefer the currently selected one
  if (ethereum.providers && Array.isArray(ethereum.providers)) {
    // Return the first available provider
    return new ethers.providers.Web3Provider(ethereum.providers[0]);
  }
  
  // Single provider case
    return new ethers.providers.Web3Provider(ethereum);
}

/**
 * Requests network switch to the configured chain
 */
async function requestNetworkSwitch(chainId: number): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    return true;
  } catch (error: any) {
    // If the chain doesn't exist, try to add it
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${chainId.toString(16)}`,
            chainName: `Chain ${chainId}`,
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [getPaymentConfig().rpcUrl],
            blockExplorerUrls: [],
          }],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add chain:', addError);
        return false;
      }
    }
    console.error('Failed to switch chain:', error);
    return false;
  }
}

/**
 * Pays the registration fee
 */
export async function payRegistrationFee(): Promise<PaymentResult> {
  const config = getPaymentConfig();
  
  if (!config.enabled) {
    return {
      success: false,
      error: config.reason || 'Payment system is not configured',
    };
  }

  const provider = getProvider();
  if (!provider) {
    return {
      success: false,
      error: 'No wallet provider found. Please install MetaMask.',
    };
  }

  try {
    // Get the signer
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // Check if we're on the correct chain
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== config.chainId) {
      const switched = await requestNetworkSwitch(config.chainId);
      if (!switched) {
        return {
          success: false,
          error: `Please switch to chain ID ${config.chainId}`,
        };
      }
    }

    // Check balance
    const balance = await provider.getBalance(signerAddress);
    if (balance < config.regFeeWei) {
      return {
        success: false,
        error: 'Insufficient ETH balance for registration fee',
      };
    }

    // Send transaction with registration fee as simple ETH transfer
    // Set explicit gas limit to prevent MetaMask overestimation
    // Simple ETH transfers use ~21,000 gas - we set 25,000 for safety margin
    const tx = await signer.sendTransaction({
      to: config.to,
      value: config.regFeeWei, // 0.001 ETH registration fee
      gasLimit: 25000, // Explicit gas limit for simple ETH transfer (~21k + buffer)
      // No data field = simple ETH transfer (not a contract call)
    });

    console.log('[paymentUtils] Transaction sent:', tx.hash);
    console.log('[paymentUtils] Transaction link: https://basescan.org/tx/' + tx.hash);

    // Wait for transaction to be mined - at least 1 block
    console.log('[paymentUtils] Waiting for confirmation...');
    const receipt = await tx.wait();
    
    // ✅ CRITICAL: Only return success if receipt.status === 1
    if (!receipt || receipt.status !== 1) {
      return {
        success: false,
        error: 'Transaction failed or was reverted on blockchain. Status: ' + (receipt?.status || 'unknown'),
      };
    }

    console.log('[paymentUtils] ✅ Payment confirmed on blockchain:', {
      hash: receipt.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status
    });

    return {
      success: true,
      hash: receipt.hash,
    };
  } catch (error: any) {
    console.error('[paymentUtils] Payment error:', error);
    
    // Handle specific error types
    if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
      return {
        success: false,
        error: 'Transaction was rejected by user.',
      };
    } else if (error.code === 'TRANSACTION_REPLACED') {
      // Transaction was replaced (Speed Up/Cancel)
      if (error.cancelled) {
        return {
          success: false,
          error: 'Transaction was cancelled (replaced by user).',
        };
      } else {
        // Transaction was replaced but might have succeeded
        console.warn('[paymentUtils] Transaction replaced, waiting for replacement...');
        try {
          const rep = error.replacement;
          const repReceipt = await rep.wait();
          if (repReceipt.status === 1) {
            console.log('[paymentUtils] ✅ Replacement transaction confirmed:', repReceipt.hash);
            return {
              success: true,
              hash: repReceipt.hash,
            };
          } else {
            return {
              success: false,
              error: 'Replacement transaction failed or was reverted.',
            };
          }
        } catch (repError: any) {
          return {
            success: false,
            error: 'Replacement transaction failed: ' + (repError.message || 'Unknown error'),
          };
        }
      }
    } else if (error.code === 'CALL_EXCEPTION' || error.code === -32000) {
      return {
        success: false,
        error: 'Transaction execution failed. Please check contract requirements.',
      };
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      return {
        success: false,
        error: 'Insufficient ETH balance for transaction (fee + gas).',
      };
    }
    
    return {
      success: false,
      error: error.message || 'Payment failed',
    };
  }
}

/**
 * Gets the current wallet address if connected
 */
export async function getWalletAddress(): Promise<string | null> {
  const provider = getProvider();
  if (!provider) {
    return null;
  }

  try {
    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch {
    return null;
  }
}

/**
 * Gets the current chain ID
 */
export async function getCurrentChainId(): Promise<number | null> {
  const provider = getProvider();
  if (!provider) {
    return null;
  }

  try {
    const network = await provider.getNetwork();
    return Number(network.chainId);
  } catch {
    return null;
  }
}

/**
 * Checks if the wallet is connected to the correct chain
 */
export async function isCorrectChain(): Promise<boolean> {
  const config = getPaymentConfig();
  if (!config.enabled) {
    return false;
  }

  const currentChainId = await getCurrentChainId();
  return currentChainId === config.chainId;
}
