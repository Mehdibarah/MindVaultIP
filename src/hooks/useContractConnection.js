import { useState, useEffect, useCallback } from 'react';
import { getContract, connectWithMetaMask, getConnectionStatus } from '@/lib/contract';

/**
 * React hook for contract connection with automatic MetaMask detection
 * @returns {Object} Contract connection state and methods
 */
export function useContractConnection() {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [network, setNetwork] = useState(null);

  // Initialize contract connection
  const initializeContract = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const contractInstance = await getContract();
      setContract(contractInstance);

      // Check connection status
      const status = await getConnectionStatus();
      setIsMetaMaskAvailable(status.isMetaMaskAvailable);
      setIsConnected(status.isConnected);
      setAddress(status.address);
      setNetwork(status.network);

      console.log('Contract initialized:', {
        hasContract: !!contractInstance,
        isMetaMaskAvailable: status.isMetaMaskAvailable,
        isConnected: status.isConnected,
        address: status.address
      });
    } catch (err) {
      console.error('Failed to initialize contract:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Connect to MetaMask
  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await connectWithMetaMask();
      setContract(result.contract);
      setSigner(result.signer);
      setProvider(result.provider);
      setAddress(result.address);
      setIsConnected(true);
      setIsMetaMaskAvailable(true);

      // Get network info
      if (result.provider) {
        const networkInfo = await result.provider.getNetwork();
        setNetwork({
          name: networkInfo.name,
          chainId: Number(networkInfo.chainId)
        });
      }

      console.log('MetaMask connected:', {
        address: result.address,
        hasSigner: !!result.signer,
        network: network
      });
    } catch (err) {
      console.error('Failed to connect to MetaMask:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [network]);

  // Disconnect from MetaMask
  const disconnect = useCallback(() => {
    setContract(null);
    setSigner(null);
    setProvider(null);
    setAddress(null);
    setIsConnected(false);
    setNetwork(null);
    setError(null);
    
    console.log('Disconnected from MetaMask');
  }, []);

  // Check if contract method requires signer
  const requiresSigner = useCallback((methodName) => {
    // Common write methods that require signer
    const writeMethods = [
      'transfer', 'transferFrom', 'approve', 'mint', 'burn', 
      'setApprovalForAll', 'safeTransferFrom', 'deposit', 'withdraw'
    ];
    
    return writeMethods.some(method => 
      methodName.toLowerCase().includes(method.toLowerCase())
    );
  }, []);

  // Execute contract method with automatic signer handling
  const executeContractMethod = useCallback(async (methodName, ...args) => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    const needsSigner = requiresSigner(methodName);
    
    if (needsSigner && !isConnected) {
      throw new Error(`Method "${methodName}" requires MetaMask connection. Please connect your wallet first.`);
    }

    try {
      const method = contract[methodName];
      if (typeof method !== 'function') {
        throw new Error(`Method "${methodName}" not found on contract`);
      }

      const result = await method(...args);
      return result;
    } catch (err) {
      console.error(`Failed to execute contract method "${methodName}":`, err);
      setError(err.message);
      throw err;
    }
  }, [contract, isConnected, requiresSigner]);

  // Listen for account changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) {
      return;
    }

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnect();
      } else {
        // User switched accounts
        initializeContract();
      }
    };

    const handleChainChanged = (chainId) => {
      console.log('Chain changed:', chainId);
      // Reinitialize contract when chain changes
      initializeContract();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [initializeContract, disconnect]);

  // Initialize on mount
  useEffect(() => {
    initializeContract();
  }, [initializeContract]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    // State
    contract,
    signer,
    provider,
    address,
    isConnected,
    isMetaMaskAvailable,
    isLoading,
    error,
    network,
    
    // Actions
    connect,
    disconnect,
    executeContractMethod,
    refresh: initializeContract,
    
    // Utilities
    requiresSigner,
    clearError: () => setError(null)
  };
}

export default useContractConnection;
