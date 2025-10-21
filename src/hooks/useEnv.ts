import { useMemo } from 'react';
import { getEnvSummary } from '@/lib/diagnostics';

export function useEnv() {
  return useMemo(() => {
    const summary = getEnvSummary();
    
    return {
      ...summary,
      // Sanitized environment for UI checks
      isConfigured: summary.hasRpcUrl && summary.hasContractAddress,
      isDebug: summary.debug,
      mode: summary.mode,
      
      // Safe environment access
      rpcUrl: import.meta.env.VITE_RPC_URL || '',
      contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || '',
      chainId: import.meta.env.VITE_CHAIN_ID || '8453',
    };
  }, []);
}

export function useEnvValidation() {
  return useMemo(() => {
    const required = ['VITE_RPC_URL', 'VITE_CONTRACT_ADDRESS'];
    const missing = required.filter(key => !import.meta.env[key]);
    
    return {
      isValid: missing.length === 0,
      missing,
      hasAllRequired: missing.length === 0,
    };
  }, []);
}
