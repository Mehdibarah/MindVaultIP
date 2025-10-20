import { useState, useEffect, useCallback } from 'react';
import { 
  initializeEthers, 
  getContractInstance, 
  getPaymentContractInstance,
  switchToBaseNetwork,
  getCurrentAccount,
  getCurrentNetwork,
  isWalletConnected,
  onAccountsChanged,
  onChainChanged,
  getContractBalance,
  transferTokens,
  sendETHPayment,
  getAllowance,
  CONTRACT_CONFIG
} from '@/lib/ethersContract';

/**
 * React hook for ethers.js contract integration
 * @returns {Object} Contract utilities and state
 */
export function useEthersContract() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null);
  const [paymentContract, setPaymentContract] = useState(null);

  // Initialize contract connection
  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { provider, signer, isConnected: connected, network: net } = await initializeEthers();
      
      setIsConnected(connected);
      setAccount(await signer.getAddress());
      setNetwork(net);
      
      // Initialize contract instances
      const contractInstance = getContractInstance(signer);
      const paymentContractInstance = getPaymentContractInstance(signer);
      
      setContract(contractInstance);
      setPaymentContract(paymentContractInstance);

      return { provider, signer, contractInstance, paymentContractInstance };
    } catch (err) {
      setError(err.message);
      setIsConnected(false);
      setAccount(null);
      setNetwork(null);
      setContract(null);
      setPaymentContract(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Switch to Base network
  const switchNetwork = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await switchToBaseNetwork();
      // Reconnect after network switch
      await connect();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [connect]);

  // Get contract balance
  const getBalance = useCallback(async (address = account) => {
    if (!address || !contract) return '0';
    
    try {
      return await getContractBalance(address);
    } catch (err) {
      setError(err.message);
      return '0';
    }
  }, [account, contract]);

  // Transfer tokens
  const transfer = useCallback(async (to, amount) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setIsLoading(true);
    setError(null);

    try {
      const result = await transferTokens(to, amount);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  // Send ETH payment
  const sendPayment = useCallback(async (amount) => {
    if (!paymentContract) throw new Error('Payment contract not initialized');
    
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendETHPayment(amount);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [paymentContract]);

  // Get allowance
  const getTokenAllowance = useCallback(async (owner, spender) => {
    if (!contract) return '0';
    
    try {
      return await getAllowance(owner, spender);
    } catch (err) {
      setError(err.message);
      return '0';
    }
  }, [contract]);

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await isWalletConnected();
        if (connected) {
          const currentAccount = await getCurrentAccount();
          const currentNetwork = await getCurrentNetwork();
          
          setAccount(currentAccount);
          setNetwork(currentNetwork);
          setIsConnected(connected);
          
          if (currentNetwork?.isBase) {
            // Auto-connect if on correct network
            await connect();
          }
        }
      } catch (err) {
        console.warn('Failed to check initial connection:', err);
      }
    };

    checkConnection();
  }, [connect]);

  // Listen for account changes
  useEffect(() => {
    const unsubscribeAccounts = onAccountsChanged((newAccount) => {
      setAccount(newAccount);
      setIsConnected(newAccount !== null);
      
      if (newAccount) {
        // Reconnect with new account
        connect().catch(console.error);
      } else {
        setContract(null);
        setPaymentContract(null);
        setNetwork(null);
      }
    });

    return unsubscribeAccounts;
  }, [connect]);

  // Listen for network changes
  useEffect(() => {
    const unsubscribeChain = onChainChanged((chainId) => {
      const isBase = chainId === CONTRACT_CONFIG.chainId;
      
      if (isBase && account) {
        // Reconnect if switched to Base network
        connect().catch(console.error);
      } else if (!isBase) {
        setError(`Please switch to Base network (Chain ID: ${CONTRACT_CONFIG.chainId})`);
        setContract(null);
        setPaymentContract(null);
      }
    });

    return unsubscribeChain;
  }, [account, connect]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    // State
    isConnected,
    account,
    network,
    isLoading,
    error,
    contract,
    paymentContract,
    
    // Actions
    connect,
    switchNetwork,
    getBalance,
    transfer,
    sendPayment,
    getTokenAllowance,
    
    // Utilities
    isBaseNetwork: network?.isBase || false,
    contractAddress: CONTRACT_CONFIG.address,
    paymentAddress: CONTRACT_CONFIG.paymentAddress,
    chainId: CONTRACT_CONFIG.chainId,
    
    // Error handling
    clearError: () => setError(null)
  };
}

export default useEthersContract;
