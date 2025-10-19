import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { base } from '@/lib/wagmi'
import { isAddress } from 'viem'

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const { address, isConnected, chainId } = useAccount()
  const { open } = useWeb3Modal()
  const { disconnect: wagmiDisconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)
  const [persistedAddress, setPersistedAddress] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState(null)

  // Guard SSR hydration - always call hooks in the same order
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load persisted wallet state - separate effect to avoid conditional hook calls
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mvip:wallet:address')
      if (stored && isAddress(stored)) {
        setPersistedAddress(stored)
      }
    }
  }, [])

  // Persist wallet state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (address && isConnected) {
        localStorage.setItem('mvip:wallet:address', address)
        setPersistedAddress(address)
      } else {
        localStorage.removeItem('mvip:wallet:address')
        setPersistedAddress(null)
      }
    }
  }, [address, isConnected])

  const connect = async () => {
    if (isConnected || isConnecting) return
    
    setIsConnecting(true)
    setConnectionError(null)
    
    try {
      // Add timeout for connection
      const connectionPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout. Please try again.'))
        }, 15000) // 15 second timeout
        
        // Listen for connection success
        const checkConnection = () => {
          if (isConnected) {
            clearTimeout(timeout)
            resolve()
          } else {
            setTimeout(checkConnection, 100)
          }
        }
        
        // Start checking for connection
        setTimeout(checkConnection, 100)
      })
      
      // Open the modal
      await open()
      
      // Wait for connection with timeout
      await connectionPromise
      
    } catch (error) {
      console.error('Connection error:', error)
      setConnectionError(error.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = async () => {
    try {
      await wagmiDisconnect()
      localStorage.removeItem('mvip:wallet:address')
      localStorage.removeItem('walletConnected')
      sessionStorage.clear()
      setPersistedAddress(null)
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  // Helper function to shorten address
  const shortAddress = (addr) => {
    if (!addr || !addr.startsWith('0x')) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Helper function to validate address
  const isValidAddress = (addr) => {
    return addr && isAddress(addr)
  }

  // Always call useMemo - hooks must be called in the same order every time
  const value = useMemo(() => ({
    address: mounted ? address : null,
    isConnected: mounted ? isConnected : false,
    chainId: mounted ? chainId : null,
    isBaseChain: mounted ? (chainId === base.id) : false,
    connect,
    disconnect,
    shortAddress,
    isValidAddress,
    persistedAddress, // For quick loading before wagmi hydrates
    mounted, // Expose mounted state for components that need it
    isConnecting, // Connection loading state
    connectionError, // Connection error state
  }), [address, isConnected, chainId, persistedAddress, mounted, isConnecting, connectionError])

  // Always render the provider, but with loading state until mounted
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
