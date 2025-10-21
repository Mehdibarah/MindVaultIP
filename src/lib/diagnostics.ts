// Environment and diagnostics utilities
export function logEnvironmentInfo() {
  if (typeof window === 'undefined') return;
  
  const viteEnvKeys = Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'));
  const envSummary = viteEnvKeys.reduce((acc, key) => {
    const value = import.meta.env[key];
    // Don't expose full values, just indicate presence and type
    acc[key] = value ? `${typeof value} (${value.length} chars)` : 'undefined';
    return acc;
  }, {} as Record<string, string>);
  
  console.log('🔧 Environment Diagnostics:', {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    viteEnvKeys,
    envSummary,
    userAgent: navigator.userAgent,
    location: window.location.href
  });
}

export function validateRequiredEnv() {
  const required = ['VITE_RPC_URL', 'VITE_CONTRACT_ADDRESS'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    return { isValid: false, missing };
  }
  
  return { isValid: true, missing: [] };
}

export function getEnvSummary() {
  return {
    hasRpcUrl: !!import.meta.env.VITE_RPC_URL,
    hasContractAddress: !!import.meta.env.VITE_CONTRACT_ADDRESS,
    hasChainId: !!import.meta.env.VITE_CHAIN_ID,
    mode: import.meta.env.MODE,
    debug: import.meta.env.VITE_DEBUG === '1'
  };
}
