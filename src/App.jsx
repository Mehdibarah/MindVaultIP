import './App.css'
import Pages from '@/pages/index.jsx'
import { Toaster } from '@/components/ui/toaster'
// Note: App.jsx uses Web3Providers from wagmi.tsx which wraps WagmiProvider
// But main.jsx already provides WagmiProvider, so we don't need Web3Providers here
// import { Web3Providers } from '@/lib/wagmi.tsx'
import { initializeI18n } from '@/utils/i18nConfig'
import { logPaymentConfig } from '@/utils/paymentConfig'
import { useEffect } from 'react'

// ⬇️ env را همین‌جا بخوان و لاگ بگیر
const FOUNDER = import.meta.env.VITE_FOUNDER_ADDRESS;
console.log('VITE_FOUNDER_ADDRESS (client):', FOUNDER);
window.__VITE_FOUNDER__ = FOUNDER; // برای چک از کنسول مرورگر

function App() {
  useEffect(() => {
    initializeI18n();
    // Log payment configuration for diagnostics
    logPaymentConfig();
  }, []);

  return (
    <>
      <Pages />
      <Toaster />
    </>
  )
}

export default App