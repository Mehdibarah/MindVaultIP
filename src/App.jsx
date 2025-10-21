import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from "@/components/wallet/WalletContext"
import { initializeI18n } from "@/utils/i18nConfig"
import { useEffect } from "react"
import DiagnosticsWidget from "@/components/DiagnosticsWidget"

function App() {
  // Initialize i18n configuration on app startup
  useEffect(() => {
    initializeI18n();
  }, []);

  return (
    <WalletProvider>
      <Pages />
      <Toaster />
      <DiagnosticsWidget />
    </WalletProvider>
  )
}

export default App 