import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { contractConfig, paymentContractConfig, getContractAddress } from '@/lib/contracts'

// Hook for reading MindVaultIP Core contract
export function useMindVaultIPContract() {
  const { address } = useAccount()
  
  // Read user's token balance
  const { data: balance, isLoading: balanceLoading, error: balanceError } = useReadContract({
    ...contractConfig,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Read token decimals
  const { data: decimals, isLoading: decimalsLoading } = useReadContract({
    ...contractConfig,
    functionName: 'decimals',
  })

  // Read allowance for a specific spender
  const getAllowance = (spender: string) => {
    return useReadContract({
      ...contractConfig,
      functionName: 'allowance',
      args: address && spender ? [address, spender as `0x${string}`] : undefined,
      query: {
        enabled: !!address && !!spender,
      },
    })
  }

  return {
    balance: balance ? formatEther(balance) : '0',
    balanceRaw: balance,
    decimals,
    isLoading: balanceLoading || decimalsLoading,
    error: balanceError,
    getAllowance,
  }
}

// Hook for payment contract interactions
export function usePaymentContract() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Transfer tokens from user to payment contract
  const transferToPayment = async (amount: string) => {
    try {
      const amountWei = parseEther(amount)
      await writeContract({
        ...paymentContractConfig,
        functionName: 'transferFrom',
        args: [
          // from: user's address (will be filled by wallet)
          // to: payment contract address
          getContractAddress('PAYMENT'),
          // value: amount in wei
          amountWei,
        ],
      })
    } catch (err) {
      console.error('Transfer error:', err)
      throw err
    }
  }

  return {
    transferToPayment,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  }
}

// Hook for contract utilities
export function useContractUtils() {
  const { address } = useAccount()
  
  // Check if user has sufficient balance
  const hasSufficientBalance = (requiredAmount: string, currentBalance: string) => {
    try {
      const required = parseFloat(requiredAmount)
      const current = parseFloat(currentBalance)
      return current >= required
    } catch {
      return false
    }
  }

  // Format token amount for display
  const formatTokenAmount = (amount: string, decimals: number = 18) => {
    try {
      const num = parseFloat(amount)
      if (num === 0) return '0'
      if (num < 0.0001) return '< 0.0001'
      return num.toFixed(4)
    } catch {
      return '0'
    }
  }

  // Check if address is valid
  const isValidAddress = (addr: string) => {
    return addr && addr.startsWith('0x') && addr.length === 42
  }

  return {
    hasSufficientBalance,
    formatTokenAmount,
    isValidAddress,
    userAddress: address,
  }
}

