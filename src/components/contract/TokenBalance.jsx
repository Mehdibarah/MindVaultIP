import React from 'react'
import { useMindVaultIPContract, useContractUtils } from '@/hooks/useContract'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Wallet, Coins } from 'lucide-react'

export default function TokenBalance() {
  const { address, isConnected } = useAccount()
  const { balance, isLoading, error } = useMindVaultIPContract()
  const { formatTokenAmount } = useContractUtils()

  if (!isConnected || !address) {
    return (
      <Card className="bg-[#1a2332] border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Token Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">Connect your wallet to view token balance</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="bg-[#1a2332] border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Token Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-gray-400 text-sm">Loading balance...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-[#1a2332] border-red-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Token Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400 text-sm">Error loading balance: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  const formattedBalance = formatTokenAmount(balance)
  const hasTokens = parseFloat(balance) > 0

  return (
    <Card className="bg-[#1a2332] border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Token Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">IDN Tokens</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-lg">{formattedBalance}</span>
            <Badge variant={hasTokens ? "default" : "secondary"} className="text-xs">
              IDN
            </Badge>
          </div>
        </div>
        
        {hasTokens ? (
          <div className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
            ✓ You have IDN tokens
          </div>
        ) : (
          <div className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">
            ⚠ No IDN tokens found
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          Address: {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      </CardContent>
    </Card>
  )
}

