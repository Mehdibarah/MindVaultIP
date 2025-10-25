import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { setupWeb3Modal, wagmiConfig, queryClient } from './lib/wagmi'

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
  
  // Prevent the rejection from crashing the app
  event.preventDefault();
});

// Setup Web3Modal once
setupWeb3Modal()

ReactDOM.createRoot(document.getElementById('root')).render(
  <div>
    <div className="p-4 bg-orange-600 text-white">
      🎯 MAIN.JSX LOADED - If you see this, main.jsx is working!
    </div>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </div>
) 