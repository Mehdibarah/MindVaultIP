import './autoErrorMonitor.js'
import './autoHealer.js'

// ✅ Filter console errors/warnings BEFORE React loads (to catch MetaMask/Sentry errors early)
(() => {
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Filter MetaMask errors
    if (message.includes('Unauthorized to perform action') ||
        message.includes('code: 4100') ||
        message.includes('api.cx.metamask.io') ||
        message.includes('accounts.api.cx.metamask.io') ||
        message.includes('getPublicKey') ||
        message.includes('getAccessToken') ||
        message.includes('Error fetching access token') ||
        message.includes('MetaMask - RPC Error') ||
        (message.includes('Failed to load resource') && (message.includes('metamask.io') || message.includes('accounts.api.cx.metamask.io')))) {
      return; // Silently ignore
    }
    
    // Filter Sentry errors
    if (message.includes('Cannot read properties of null') ||
        message.includes('transformResponse') ||
        message.includes('bootstrap-BnsX9yKQ.js') ||
        message.includes('sentry') ||
        message.includes('Sentry')) {
      return; // Silently ignore
    }
    
    // Filter ENS errors
    if (message.includes('ChainDoesNotSupportContract') ||
        message.includes('ensUniversalResolver') ||
        message.includes('Chain "Base" does not support') ||
        message.includes('Error fetching ENS name')) {
      return; // Silently ignore
    }
    
    // Filter network errors from MetaMask/Sentry APIs (404, 403, etc.)
    if (message.includes('Failed to load resource') && 
        (message.includes('metamask.io') || 
         message.includes('accounts.api.cx.metamask.io') ||
         message.includes('sentry'))) {
      return; // Silently ignore
    }
    
    // Call original for other errors
    originalError.apply(console, args);
  };
  
  console.warn = function(...args) {
    const message = args.join(' ');
    
    // Filter MetaMask warnings
    if (message.includes('Unauthorized to perform action') ||
        message.includes('MetaMask - RPC Error') ||
        message.includes('api.cx.metamask.io') ||
        message.includes('accounts.api.cx.metamask.io') ||
        message.includes('getPublicKey') ||
        message.includes('getAccessToken') ||
        message.includes('Error fetching access token') ||
        (message.includes('Failed to load resource') && (message.includes('metamask.io') || message.includes('accounts.api.cx.metamask.io')))) {
      return; // Silently ignore
    }
    
    // Filter Sentry warnings
    if (message.includes('Cannot read properties of null') ||
        message.includes('transformResponse') ||
        message.includes('bootstrap-BnsX9yKQ.js') ||
        message.includes('sentry')) {
      return; // Silently ignore
    }
    
    // Filter ENS warnings
    if (message.includes('ChainDoesNotSupportContract') ||
        message.includes('ensUniversalResolver') ||
        message.includes('Error fetching ENS name')) {
      return; // Silently ignore
    }
    
    // Call original for other warnings
    originalWarn.apply(console, args);
  };
})();

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
// Use wagmi.ts (optimized version) instead of wagmi.tsx
import { setupWeb3Modal, wagmiConfig, queryClient } from './lib/wagmi'
import { logSupabaseEnv } from './lib/storageDiagnostics'
import { logFeeComparison } from './utils/contractFeeChecker'

// Runtime guard: Block Coinbase metrics/beacons if any stray libs attempt to send them
if (typeof window !== 'undefined') {
  const origBeacon = navigator.sendBeacon?.bind(navigator);
  navigator.sendBeacon = (url, data) => {
    try {
      const u = typeof url === 'string' ? url : url?.toString?.();
      if (u && u.includes('coinbase.com')) return true; // swallow
    } catch {}
    return origBeacon ? origBeacon(url, data) : false;
  };
}

// Run Supabase diagnostics on startup (non-blocking)
void (async () => {
  try {
    logSupabaseEnv();
    // Note: listConnectedBuckets() removed - anon key doesn't have permission to list buckets
    // await listConnectedBuckets();
  } catch (error) {
    console.error('[Main] Failed to run Supabase diagnostics:', error);
  }
})();

// Run contract fee check on startup (non-blocking, safe - won't crash app)
void (async () => {
  try {
    // Wait a bit for wallet/provider to be ready
    await new Promise(resolve => setTimeout(resolve, 3000));
    // ✅ logFeeComparison is now safe and won't throw
    await logFeeComparison();
  } catch (error) {
    // ✅ Even if logFeeComparison throws (shouldn't happen), silently handle it
    console.warn('[Main] Contract fee check skipped (non-critical):', error.message || error);
    // Don't crash the app - this is just a diagnostic
  }
})();

// Global error handler to catch unhandled errors
window.addEventListener('error', (event) => {
  // Only log if it's not a filtered error
  const shouldLog = !event.error?.message?.includes('Unauthorized to perform action') &&
                    event.error?.code !== 4100 &&
                    !event.error?.stack?.includes('api.cx.metamask.io') &&
                    !event.error?.stack?.includes('accounts.api.cx.metamask.io') &&
                    !event.error?.message?.includes('ChainDoesNotSupportContract') &&
                    !event.error?.stack?.includes('sentry') &&
                    !event.error?.stack?.includes('bootstrap-BnsX9yKQ.js');
  
  if (shouldLog) {
    console.warn('Global error caught:', event.error);
  }
  
  // Handle specific error types
  if (event.error?.message?.includes('Cross-Origin-Opener-Policy') || 
      event.error?.message?.includes('COOP')) {
    console.warn('COOP error - this is a browser security policy issue, can be safely ignored');
    event.preventDefault();
    return;
  }

  // Handle Ledger HID permission errors (expected when Ledger connector tries to scan without user gesture)
  if (event.error?.message?.includes('TransportOpenUserCancelled') ||
      event.error?.message?.includes('Must be handling a user gesture') ||
      event.error?.message?.includes('requestDevice') ||
      event.error?.name === 'TransportOpenUserCancelled') {
    // Silently ignore - Ledger will request permission when user actually connects
    event.preventDefault();
    return;
  }

  // Handle MetaMask RPC permission errors (MetaMask extension trying to access its own APIs)
  if (event.error?.message?.includes('Unauthorized to perform action') ||
      event.error?.code === 4100 ||
      event.error?.message?.includes('metaMask') ||
      event.error?.message?.includes('RPC Error') ||
      event.error?.stack?.includes('api.cx.metamask.io') ||
      event.error?.stack?.includes('accounts.api.cx.metamask.io') ||
      event.error?.message?.includes('getPublicKey') ||
      event.error?.message?.includes('getAccessToken')) {
    // Silently ignore - MetaMask extension permission issues, not related to our app
    event.preventDefault();
    return;
  }

  // Handle Sentry/null data errors (Sentry trying to process null responses)
  if (event.error?.message?.includes('Cannot read properties of null') ||
      event.error?.stack?.includes('sentry') ||
      event.error?.stack?.includes('transformResponse') ||
      event.error?.stack?.includes('bootstrap-BnsX9yKQ.js')) {
    // Silently ignore - Sentry/internal error handling issues
    event.preventDefault();
    return;
  }

  // Handle ENS errors on Base network (Base doesn't support ENS)
  if (event.error?.message?.includes('ChainDoesNotSupportContract') ||
      event.error?.message?.includes('ensUniversalResolver') ||
      event.error?.message?.includes('Chain "Base" does not support') ||
      event.error?.message?.includes('Error fetching ENS name')) {
    // Silently ignore - Base network doesn't support ENS, this is expected
    event.preventDefault();
    return;
  }
  
  // Handle network errors from MetaMask/Sentry APIs
  if (event.message?.includes('Failed to load resource') && 
      (event.message?.includes('metamask.io') || 
       event.message?.includes('accounts.api.cx.metamask.io') ||
       event.message?.includes('sentry'))) {
    // Silently ignore - MetaMask/Sentry API network errors (404, 403, etc.)
    event.preventDefault();
    return;
  }
  
  // Prevent the error from crashing the app
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  // Only log if it's not a filtered error
  const shouldLog = !event.reason?.message?.includes('Unauthorized to perform action') &&
                    event.reason?.code !== 4100 &&
                    !event.reason?.stack?.includes('api.cx.metamask.io') &&
                    !event.reason?.stack?.includes('accounts.api.cx.metamask.io') &&
                    !event.reason?.message?.includes('ChainDoesNotSupportContract') &&
                    !event.reason?.stack?.includes('sentry') &&
                    !event.reason?.stack?.includes('bootstrap-BnsX9yKQ.js');
  
  if (shouldLog) {
    console.warn('Unhandled promise rejection:', event.reason);
  }
  
  // Handle specific rejection types
  if (event.reason?.message?.includes('Cross-Origin-Opener-Policy') || 
      event.reason?.message?.includes('COOP')) {
    console.warn('COOP promise rejection - this is a browser security policy issue, can be safely ignored');
    event.preventDefault();
    return;
  }

  // Handle Ledger HID permission errors (expected when Ledger connector tries to scan without user gesture)
  if (event.reason?.message?.includes('TransportOpenUserCancelled') ||
      event.reason?.message?.includes('Must be handling a user gesture') ||
      event.reason?.message?.includes('requestDevice') ||
      event.reason?.name === 'TransportOpenUserCancelled') {
    // Silently ignore - Ledger will request permission when user actually connects
    event.preventDefault();
    return;
  }

  // Handle MetaMask RPC permission errors (MetaMask extension trying to access its own APIs)
  if (event.reason?.message?.includes('Unauthorized to perform action') ||
      event.reason?.code === 4100 ||
      event.reason?.message?.includes('metaMask') ||
      event.reason?.message?.includes('RPC Error') ||
      event.reason?.stack?.includes('api.cx.metamask.io') ||
      event.reason?.stack?.includes('accounts.api.cx.metamask.io') ||
      event.reason?.message?.includes('getPublicKey') ||
      event.reason?.message?.includes('getAccessToken')) {
    // Silently ignore - MetaMask extension permission issues, not related to our app
    event.preventDefault();
    return;
  }

  // Handle Sentry/null data errors (Sentry trying to process null responses)
  if (event.reason?.message?.includes('Cannot read properties of null') ||
      event.reason?.stack?.includes('sentry') ||
      event.reason?.stack?.includes('transformResponse') ||
      event.reason?.stack?.includes('bootstrap-BnsX9yKQ.js')) {
    // Silently ignore - Sentry/internal error handling issues
    event.preventDefault();
    return;
  }

  // Handle ENS errors on Base network (Base doesn't support ENS)
  if (event.reason?.message?.includes('ChainDoesNotSupportContract') ||
      event.reason?.message?.includes('ensUniversalResolver') ||
      event.reason?.message?.includes('Chain "Base" does not support') ||
      event.reason?.message?.includes('Error fetching ENS name')) {
    // Silently ignore - Base network doesn't support ENS, this is expected
    event.preventDefault();
    return;
  }
  
  // Handle network errors from MetaMask/Sentry APIs
  if (event.reason?.message?.includes('Failed to load resource') && 
      (event.reason?.message?.includes('metamask.io') || 
       event.reason?.message?.includes('accounts.api.cx.metamask.io') ||
       event.reason?.message?.includes('sentry'))) {
    // Silently ignore - MetaMask/Sentry API network errors (404, 403, etc.)
    event.preventDefault();
    return;
  }
  
  // Prevent the rejection from crashing the app
  event.preventDefault();
});

// Setup Web3Modal once (non-blocking)
void setupWeb3Modal()

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </WagmiProvider>
) 