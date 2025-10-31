/**
 * React hook for Base44 SIWE authentication
 */

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { signInWithEthereum, generateSIWEMessage, getAuthToken, clearAuthToken, isAuthenticated } from '@/utils/base44Auth';
import { base44 } from '@/services/base44Client';

export function useBase44Auth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check auth status on mount and when address changes
  useEffect(() => {
    const checkAuth = () => {
      const auth = getAuthToken();
      const isAuth = isAuthenticated() && auth?.address === address;
      setIsAuthenticatedState(isAuth);
    };

    checkAuth();
    
    // Listen for storage changes (e.g., from other tabs)
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [address]);

  // Sign in with Ethereum
  const signIn = useCallback(async () => {
    if (!address || !isConnected) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('[useBase44Auth] Initiating SIWE authentication...');
      
      // Generate SIWE message
      const nonce = Date.now().toString() + Math.random().toString(36).substring(7);
      const message = generateSIWEMessage(address, nonce);
      
      // Sign message with wallet using wagmi
      const signature = await signMessageAsync({ message });
      
      // Authenticate with Base44
      const authResult = await signInWithEthereum(address, signature, message);
      
      setIsAuthenticatedState(true);
      console.log('[useBase44Auth] Authentication successful');
      
      return authResult;
    } catch (err: any) {
      console.error('[useBase44Auth] Authentication failed:', err);
      setError(err.message || 'Authentication failed');
      setIsAuthenticatedState(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected, signMessageAsync]);

  // Sign out
  const signOut = useCallback(() => {
    clearAuthToken();
    setIsAuthenticatedState(false);
    setError(null);
  }, []);

  // Ensure authenticated (auto-login if needed)
  const ensureAuthenticated = useCallback(async () => {
    if (isAuthenticatedState) {
      return true;
    }

    if (!address || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      await signIn();
      return true;
    } catch (err) {
      console.error('[useBase44Auth] Auto-authentication failed:', err);
      return false;
    }
  }, [address, isConnected, isAuthenticatedState, signIn]);

  return {
    isAuthenticated: isAuthenticatedState,
    isLoading,
    error,
    signIn,
    signOut,
    ensureAuthenticated,
  };
}

