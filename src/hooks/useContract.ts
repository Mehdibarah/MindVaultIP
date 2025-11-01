import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useSendTransaction } from 'wagmi' // ✅ useChainId removed - not used
import { useAccount, useBalance } from 'wagmi'
// ✅ Using ethers v5 - parseEther and formatEther are in utils (NOT viem)
import { ethers } from 'ethers'
// Helper functions to convert viem-style calls to ethers v5
const parseEther = (value: string): bigint => {
  const bn = ethers.utils.parseEther(value);
  return BigInt(bn.toString()); // Convert ethers BigNumber to native bigint for viem compatibility
};
const formatEther = (value: bigint | string): string => {
  return ethers.utils.formatEther(value.toString());
};
import { contractConfig, paymentContractConfig, getContractAddress, REGISTRATION_FEE } from '@/lib/contracts'
// ✅ TypeScript: Add type declaration for JS module
// @ts-ignore - JS module without type definitions
import { useEthersContract } from './useEthersContract'

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
    balance: balance ? formatEther(balance.toString()) : '0', // ✅ Convert bigint to string
    balanceRaw: balance,
    decimals,
    isLoading: balanceLoading || decimalsLoading,
    error: balanceError,
    getAllowance,
    formatTokenAmount: (amount: string) => {
      if (!amount || amount === '0') return '0'
      const num = parseFloat(amount)
      if (num < 0.0001) return '< 0.0001'
      return num.toFixed(4)
    }
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

// Hook for ETH payments (registration fees)
export function useETHPayment() {
  const { address } = useAccount()
  // ✅ chainId removed - not used
  const { data: ethBalance } = useBalance({ address })
  const { sendTransaction, data: hash, error, isPending } = useSendTransaction()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Send ETH payment for registration
  const payRegistrationFee = async () => {
    try {
      // Ensure value is always 0.001 ETH (1000000000000000 wei)
      const value = parseEther(REGISTRATION_FEE.AMOUNT)
      const paymentAddress = getContractAddress('PAYMENT')
      
      // Send as simple ETH transfer
      // Set explicit gas limit for simple ETH transfer to prevent MetaMask overestimation
      // Simple ETH transfers use ~21,000 gas - we set 25,000 for safety margin
      await sendTransaction({
        to: paymentAddress as `0x${string}`,
        value: value, // 0.001 ETH registration fee
        gas: 25000n, // Explicit gas limit for simple ETH transfer (~21k + buffer)
        // No data field = simple ETH transfer (not a contract call)
      })
      
      console.log('[useETHPayment] Payment transaction sent:', {
        to: paymentAddress,
        value: value.toString(),
        amount: REGISTRATION_FEE.AMOUNT + ' ETH',
        gas: '25000'
      })
    } catch (err) {
      console.error('[useETHPayment] Payment error:', err)
      throw err
    }
  }

  // Check if user has sufficient ETH balance for registration
  const hasSufficientETH = () => {
    if (!ethBalance) return false
    const required = parseEther(REGISTRATION_FEE.AMOUNT)
    return ethBalance.value >= required
  }

  // Get formatted ETH balance
  const getFormattedETHBalance = () => {
    return ethBalance ? formatEther(ethBalance.value) : '0'
  }

  return {
    payRegistrationFee,
    hasSufficientETH,
    getFormattedETHBalance,
    ethBalance: ethBalance ? formatEther(ethBalance.value) : '0',
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    registrationFee: REGISTRATION_FEE.AMOUNT,
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
  const formatTokenAmount = (amount: string) => { // ✅ decimals parameter removed - not used
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

// Combined hook that provides both wagmi and ethers.js functionality
export function useCombinedContract() {
  const wagmiContract = useMindVaultIPContract()
  const wagmiPayment = usePaymentContract()
  const ethersContract = useEthersContract()

  return {
    // Wagmi functionality (preferred for most operations)
    wagmi: {
      balance: wagmiContract.balance,
      balanceRaw: wagmiContract.balanceRaw,
      decimals: wagmiContract.decimals,
      isLoading: wagmiContract.isLoading,
      error: wagmiContract.error,
      getAllowance: wagmiContract.getAllowance,
      formatTokenAmount: wagmiContract.formatTokenAmount,
      transferToPayment: wagmiPayment.transferToPayment,
      isPending: wagmiPayment.isPending,
      hash: wagmiPayment.hash,
    },
    
    // Ethers.js functionality (for direct contract interaction)
    ethers: {
      isConnected: ethersContract.isConnected,
      account: ethersContract.account,
      network: ethersContract.network,
      isLoading: ethersContract.isLoading,
      error: ethersContract.error,
      contract: ethersContract.contract,
      paymentContract: ethersContract.paymentContract,
      connect: ethersContract.connect,
      switchNetwork: ethersContract.switchNetwork,
      getBalance: ethersContract.getBalance,
      transfer: ethersContract.transfer,
      sendPayment: ethersContract.sendPayment,
      getTokenAllowance: ethersContract.getTokenAllowance,
      isBaseNetwork: ethersContract.isBaseNetwork,
      contractAddress: ethersContract.contractAddress,
      paymentAddress: ethersContract.paymentAddress,
      chainId: ethersContract.chainId,
      clearError: ethersContract.clearError,
    },
    
    // Utility functions
    isConnected: wagmiContract.isLoading ? false : !!wagmiContract.balance || ethersContract.isConnected,
    hasError: !!(wagmiContract.error || ethersContract.error),
    getErrorMessage: () => wagmiContract.error?.message || ethersContract.error || null,
  }
}

