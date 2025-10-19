import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { base } from '@/lib/wagmi'

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const { address, isConnected, chainId } = useAccount()
  const { open } = useWeb3Modal()
  const { disconnect: wagmiDisconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)

  // Guard SSR hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const connect = () => {
    if (!isConnected) {
      open()
    }
  }

  const disconnect = async () => {
    try {
      await wagmiDisconnect()
      localStorage.removeItem('walletConnected')
      sessionStorage.clear()
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  // Return null until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  const value = {
    address,
    isConnected,
    chainId,
    isBaseChain: chainId === base.id,
    connect,
    disconnect,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
