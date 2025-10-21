import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { setupWeb3Modal, wagmiConfig, queryClient } from './lib/wagmi'
import { logEnvironmentInfo, validateRequiredEnv } from './lib/diagnostics'

// Global error handler to catch unhandled errors
window.addEventListener('error', (event) => {
  console.warn('Global error caught:', event.error);
  // Prevent the error from crashing the app
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason);
  // Prevent the rejection from crashing the app
  event.preventDefault();
});

// Setup Web3Modal once
setupWeb3Modal()

// Log environment info at startup
logEnvironmentInfo()
const envValidation = validateRequiredEnv()
if (!envValidation.isValid) {
  console.warn('⚠️ Environment validation failed:', envValidation.missing)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </WagmiProvider>
) 