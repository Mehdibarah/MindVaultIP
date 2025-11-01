/**
 * Contract Fee Checker Utility
 * Checks if contract registration fee matches frontend configuration
 */

import { createPublicClient, http } from 'viem';
import { base } from 'wagmi/chains';
// ✅ Using ethers v5 for parseEther (not viem)
import { ethers } from 'ethers';
// Helper to convert ethers BigNumber to string for comparison
const parseEther = (value: string): string => {
  return ethers.utils.parseEther(value).toString();
};
import { REGISTRATION_FEE } from '@/lib/contracts';
import { getContractAddress } from '@/lib/contracts';

/**
 * Check if contract fee matches frontend fee
 * Returns diagnostic information
 */
export async function checkContractFee(): Promise<{
  match: boolean;
  contractFee: string;
  frontendFee: string;
  difference: string;
  error?: string;
}> {
  try {
    const contractAddress = getContractAddress('MIND_VAULT_IP_CORE');
    if (!contractAddress) {
      return {
        match: false,
        contractFee: '0',
        frontendFee: REGISTRATION_FEE.AMOUNT,
        difference: REGISTRATION_FEE.AMOUNT,
        error: 'Contract address not configured',
      };
    }

    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    // Try to read fee from contract
    // Common function names: fee, registrationFee, regFee, REGISTRATION_FEE, getRegistrationFee
    const possibleFunctions = [
      'fee', // ✅ Try 'fee' first (most common in newer contracts)
      'registrationFee',
      'regFee',
      'REGISTRATION_FEE',
      'getRegistrationFee',
    ];

    let contractFeeWei: bigint | null = null;
    let functionName: string | null = null;

    for (const funcName of possibleFunctions) {
      try {
        const result = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: [
            {
              name: funcName,
              type: 'function',
              stateMutability: 'view',
              inputs: [],
              outputs: [{ type: 'uint256' }],
            },
          ],
          functionName: funcName,
        });

        contractFeeWei = result as bigint;
        functionName = funcName;
        break;
      } catch (err) {
        // Function doesn't exist, try next
        continue;
      }
    }

    if (!contractFeeWei) {
      return {
        match: false,
        contractFee: 'unknown',
        frontendFee: REGISTRATION_FEE.AMOUNT,
        difference: REGISTRATION_FEE.AMOUNT,
        error: 'Could not read fee from contract. Contract may not have a public fee function.',
      };
    }

    const contractFeeEth = Number(contractFeeWei) / 1e18;
    const frontendFeeNum = parseFloat(REGISTRATION_FEE.AMOUNT);
    // ✅ Using ethers v5 utils.parseEther - convert to string for comparison
    const frontendFeeWei = ethers.utils.parseEther(REGISTRATION_FEE.AMOUNT).toString();

    // Compare as strings (both contractFeeWei and frontendFeeWei are strings now)
    const match = contractFeeWei.toString() === frontendFeeWei;
    const difference = Math.abs(contractFeeEth - frontendFeeNum);

    return {
      match,
      contractFee: contractFeeEth.toString(),
      frontendFee: frontendFeeNum.toString(),
      difference: difference.toString(),
    };
  } catch (error: any) {
    return {
      match: false,
      contractFee: 'error',
      frontendFee: REGISTRATION_FEE.AMOUNT,
      difference: REGISTRATION_FEE.AMOUNT,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Log fee comparison to console
 * ✅ SAFE: Won't crash the app, handles all errors gracefully
 */
export async function logFeeComparison(): Promise<void> {
  try {
    console.log('[ContractFeeChecker] 🔍 Checking fee match...');
    
    const result = await checkContractFee();

    if (result.error) {
      // If contract doesn't have a public fee function, that's OK - UI uses fixed 0.001 ETH
      if (result.error.includes('Could not read fee')) {
        console.log('[ContractFeeChecker] ⚠️  Contract fee not readable (no public function)');
        console.log('[ContractFeeChecker]   Using fixed frontend fee:', result.frontendFee, 'ETH');
        console.log('[ContractFeeChecker]   This is normal if contract fee is immutable/hardcoded');
        return; // ✅ Early return - this is expected, not an error
      } else {
        console.warn('[ContractFeeChecker] ⚠️', result.error);
        return; // ✅ Return on error to prevent crash
      }
    }

    console.log('[ContractFeeChecker] 📊 Contract Fee:', result.contractFee, 'ETH');
    console.log('[ContractFeeChecker] 📤 Frontend Fee:', result.frontendFee, 'ETH');

    if (result.match) {
      console.log('[ContractFeeChecker] ✅ Fees match!');
    } else {
      console.warn('[ContractFeeChecker] ⚠️  FEES DO NOT MATCH!');
      console.warn('[ContractFeeChecker]   Contract expects:', result.contractFee, 'ETH');
      console.warn('[ContractFeeChecker]   Frontend sends:', result.frontendFee, 'ETH');
      console.warn('[ContractFeeChecker]   Difference:', result.difference, 'ETH');
      console.warn('[ContractFeeChecker]');
      console.warn('[ContractFeeChecker] 🔧 To fix:');
      // ✅ Using ethers v5 utils.parseEther - with error handling
      try {
        const fixFeeWei = ethers.utils.parseEther(result.frontendFee).toString();
        console.warn('[ContractFeeChecker]   1. If contract has setRegistrationFee(): call it with', fixFeeWei);
      } catch (parseError) {
        // If parseEther fails, just show ETH value
        console.warn('[ContractFeeChecker]   1. If contract has setRegistrationFee(): call it with fee =', result.frontendFee, 'ETH');
      }
      console.warn('[ContractFeeChecker]   2. If immutable: deploy new contract with fee =', result.frontendFee, 'ETH');
      console.warn('[ContractFeeChecker]   3. Update VITE_CONTRACT_ADDRESS in .env');
    }
  } catch (error) {
    // ✅ Silently handle any errors - don't crash the app
    // This is a diagnostic function, not critical for app functionality
    console.warn('[ContractFeeChecker] ⚠️  Fee check failed (non-critical, app continues):', error.message || String(error));
    // Don't throw - this function is called on startup and shouldn't break the app
  }
}

