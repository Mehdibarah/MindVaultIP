/**
 * Base44 SIWE Authentication
 * Signs in with Ethereum wallet and stores session token
 */

import { ethers } from 'ethers';

const AUTH_TOKEN_KEY = 'base44_auth_token';
const AUTH_ADDRESS_KEY = 'base44_auth_address';
const AUTH_EXPIRY_KEY = 'base44_auth_expiry';

/**
 * Generate SIWE message for Base44 authentication
 */
export function generateSIWEMessage(address, nonce) {
  const domain = window.location.hostname;
  const origin = window.location.origin;
  const now = new Date();
  const expiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  return `${domain} wants you to sign in with your Ethereum account:
${address}

This is a request to authenticate with Base44.

URI: ${origin}
Version: 1
Chain ID: 8453
Nonce: ${nonce}
Issued At: ${now.toISOString()}
Expiration Time: ${expiry.toISOString()}`;
}

/**
 * Sign in with Ethereum using signature (signature should be obtained via wagmi's signMessageAsync)
 */
export async function signInWithEthereum(address, signature, message) {
  try {
    console.log('[Base44Auth] Starting SIWE authentication for:', address);

    // Authenticate with Base44 using SIWE
    const authResponse = await authenticateWithBase44(address, message, signature);

    // Store auth token
    if (authResponse?.token) {
      const expiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
      localStorage.setItem(AUTH_TOKEN_KEY, authResponse.token);
      localStorage.setItem(AUTH_ADDRESS_KEY, address);
      localStorage.setItem(AUTH_EXPIRY_KEY, expiry.toString());
      
      console.log('[Base44Auth] Authentication successful, token stored');
      return authResponse;
    }

    throw new Error('No token received from Base44 authentication');
  } catch (error) {
    console.error('[Base44Auth] SIWE authentication failed:', error);
    throw error;
  }
}

/**
 * Authenticate with Base44 backend using SIWE signature
 */
async function authenticateWithBase44(address, message, signature) {
  const appId = "68f3baa1243cc437dcccaa8f";
  const apiUrl = `https://base44.app/api/apps/${appId}/auth/siwe`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify({
        address,
        message,
        signature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Authentication failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      token: data.token || data.accessToken,
      user: data.user,
      expiresAt: data.expiresAt,
    };
  } catch (error) {
    console.error('[Base44Auth] Base44 API authentication failed:', error);
    throw error;
  }
}

/**
 * Get stored auth token
 */
export function getAuthToken() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);
  const address = localStorage.getItem(AUTH_ADDRESS_KEY);

  // Check if token is expired
  if (token && expiry && Date.now() < parseInt(expiry, 10)) {
    return { token, address };
  }

  // Token expired or doesn't exist
  if (token) {
    clearAuthToken();
  }

  return null;
}

/**
 * Clear stored auth token
 */
export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ADDRESS_KEY);
  localStorage.removeItem(AUTH_EXPIRY_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getAuthToken();
}

/**
 * Get auth headers for API requests
 */
export function getAuthHeaders() {
  const auth = getAuthToken();
  if (!auth?.token) {
    return {};
  }

  return {
    'Authorization': `Bearer ${auth.token}`,
    'X-Wallet-Address': auth.address || '',
  };
}

