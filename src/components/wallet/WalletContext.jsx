import React, { createContext, useContext } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const { address, isConnected, chainId } = useAccount()
  const { open } = useWeb3Modal()
  const { disconnect: wagmiDisconnect } = useDisconnect()

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

  const value = {
    address,
    isConnected,
    chainId,
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
