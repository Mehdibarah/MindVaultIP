import { useEffect, useState } from 'react'
import { useChainId, useSwitchChain, useAccount } from 'wagmi'
import { BASE_CHAIN_ID, BASE_CHAIN_HEX, BASE_CHAIN_CONFIG } from '@/lib/chains'

export function useEnsureBase() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { isConnected } = useAccount()
  const [isOnBase, setIsOnBase] = useState(false)

  useEffect(() => {
    const checkAndSwitchChain = async () => {
      if (!isConnected) {
        setIsOnBase(false)
        return
      }

      // Check if already on Base
      if (chainId === BASE_CHAIN_ID) {
        setIsOnBase(true)
        return
      }

      setIsOnBase(false)

      // Try to switch to Base using wagmi
      try {
        await switchChain({ chainId: BASE_CHAIN_ID })
        setIsOnBase(true)
        return
      } catch (error) {
        console.log('Wagmi switch failed, trying direct wallet request:', error)
      }

      // Fallback: Direct wallet request
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_CHAIN_HEX }],
          })
          setIsOnBase(true)
        }
      } catch (switchError: any) {
        // If chain doesn't exist (error 4902), add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [BASE_CHAIN_CONFIG],
            })
            setIsOnBase(true)
          } catch (addError) {
            console.error('Failed to add Base chain:', addError)
          }
        } else {
          console.error('Failed to switch to Base chain:', switchError)
        }
      }
    }

    checkAndSwitchChain()
  }, [chainId, isConnected, switchChain])

  return {
    isOnBase,
    chainId,
    isConnected,
  }
}
