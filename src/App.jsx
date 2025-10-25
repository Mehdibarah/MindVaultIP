import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from "@/components/wallet/WalletContext"
import { initializeI18n } from "@/utils/i18nConfig"
import { useEffect } from "react"

function App() {
  // Initialize i18n configuration on app startup
  useEffect(() => {
    initializeI18n();
  }, []);

  return (
    <div>
      <div className="p-4 bg-purple-600 text-white">
        🚀 APP COMPONENT LOADED - If you see this, App is working!
      </div>
      <WalletProvider>
        <Pages />
        <Toaster />
      </WalletProvider>
    </div>
  )
}

export default App 