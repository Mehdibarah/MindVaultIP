import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from "@/components/wallet/WalletContext"
import { initializeI18n } from "@/utils/i18nConfig"
import ToastDismisser from "@/components/ToastDismisser"
import { useEffect } from "react"

function App() {
  // Initialize i18n configuration on app startup
  useEffect(() => {
    initializeI18n();
  }, []);

  return (
    <WalletProvider>
      <ToastDismisser />
      <Pages />
      <Toaster />
    </WalletProvider>
  )
}

export default App 