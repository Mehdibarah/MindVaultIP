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

// Run contract fee check on startup (non-blocking)
void (async () => {
  try {
    // Wait a bit for wallet to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    await logFeeComparison();
  } catch (error) {
    console.error('[Main] Failed to check contract fee:', error);
  }
})();

// Global error handler to catch unhandled errors
window.addEventListener('error', (event) => {
  console.warn('Global error caught:', event.error);
  
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
  
  // Prevent the error from crashing the app
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason);
  
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