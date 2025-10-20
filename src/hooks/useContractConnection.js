import { useState, useEffect, useCallback } from 'react';
import { getSignerContract } from '@/lib/contract';

/**
 * React hook for contract connection with automatic MetaMask detection
 * @returns {Object} Contract connection state and methods
 */
export function useContractConnection() {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if MetaMask is available
  const isMetaMaskAvailable = typeof window !== 'undefined' && !!window.ethereum;

  // Initialize with readonly contract
  useEffect(() => {
    if (window.contract) {
      setContract(window.contract);
    }
  }, []);

  // Connect to MetaMask and get signer contract
  const connect = useCallback(async () => {
    if (!isMetaMaskAvailable) {
      setError('MetaMask is not installed');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const signerContract = await getSignerContract();
      const signer = signerContract.signer;
      const address = await signer.getAddress();

      setContract(signerContract);
      setSigner(signer);
      setAccount(address);
      setIsConnected(true);

      console.log('✅ Wallet connected:', address);
    } catch (err) {
      console.error('❌ Wallet connection failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isMetaMaskAvailable]);

  // Execute contract method with signer
  const executeContractMethod = useCallback(async (methodName, ...args) => {
    if (!contract || !signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const result = await contract[methodName](...args);
      return result;
    } catch (err) {
      console.error(`❌ Contract method ${methodName} failed:`, err);
      throw err;
    }
  }, [contract, signer]);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskAvailable) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // Disconnected
        setContract(window.contract); // Reset to readonly
        setSigner(null);
        setAccount(null);
        setIsConnected(false);
      } else {
        // Account changed
        setAccount(accounts[0]);
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [isMetaMaskAvailable]);

  // Listen for network changes
  useEffect(() => {
    if (!isMetaMaskAvailable) return;

    const handleChainChanged = (chainId) => {
      console.log('Network changed:', chainId);
      // Optionally reconnect or show network warning
    };

    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [isMetaMaskAvailable]);

  return {
    contract,
    signer,
    isConnected,
    account,
    isLoading,
    error,
    isMetaMaskAvailable,
    connect,
    executeContractMethod
  };
}