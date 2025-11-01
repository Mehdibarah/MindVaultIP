import { useState, useEffect } from 'react';

export function useIsFounder() {
  const [isFounder, setIsFounder] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFounderStatus = async () => {
      try {
        // Always set loading to false first for public access
        setLoading(false);
        
        // Request wallet connection
        if (typeof window !== 'undefined' && window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
              const address = accounts[0].toLowerCase();
              setConnectedAddress(address);
              
              // Get founder address from environment
              const founderAddress = import.meta.env.VITE_FOUNDER_ADDRESS?.toLowerCase();
              
              if (founderAddress && address === founderAddress) {
                setIsFounder(true);
                console.log('✅ User is founder:', address);
              } else {
                setIsFounder(false);
                console.log('👤 User is not founder:', address);
              }
            } else {
              setConnectedAddress(null);
              setIsFounder(false);
              console.log('🔌 No wallet connected - public access');
            }
          } catch (error) {
            console.error('❌ Error checking wallet connection:', error);
            setConnectedAddress(null);
            setIsFounder(false);
          }
        } else {
          setConnectedAddress(null);
          setIsFounder(false);
          console.log('🔌 No Ethereum provider found - public access');
        }
      } catch (error) {
        console.error('❌ Error in useIsFounder:', error);
        setConnectedAddress(null);
        setIsFounder(false);
      }
    };

    checkFounderStatus();

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          checkFounderStatus();
        } else {
          setConnectedAddress(null);
          setIsFounder(false);
          setLoading(false);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  return {
    isFounder,
    connectedAddress,
    loading
  };
}
