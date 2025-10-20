import React, { useState } from 'react'
import { usePaymentContract, useMindVaultIPContract, useContractUtils } from '@/hooks/useContract'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle, CreditCard } from 'lucide-react'

export default function PaymentForm() {
  const { address, isConnected } = useAccount()
  const { balance } = useMindVaultIPContract()
  const { hasSufficientBalance, formatTokenAmount } = useContractUtils()
  const { 
    transferToPayment, 
    hash, 
    error, 
    isPending, 
    isConfirming, 
    isConfirmed 
  } = usePaymentContract()

  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (!hasSufficientBalance(amount, balance)) {
      alert('Insufficient token balance')
      return
    }

    setIsSubmitting(true)
    try {
      await transferToPayment(amount)
    } catch (err) {
      console.error('Payment error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isInsufficientBalance = amount && !hasSufficientBalance(amount, balance)
  const canSubmit = isConnected && amount && parseFloat(amount) > 0 && !isInsufficientBalance && !isPending && !isSubmitting

  if (!isConnected) {
    return (
      <Card className="bg-[#1a2332] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to make payments
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#1a2332] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Make Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance Display */}
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Available Balance</span>
            <span className="text-white font-semibold">{formatTokenAmount(balance)} IDN</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount" className="text-gray-300">Amount (IDN)</Label>
            <Input
              id="amount"
              type="number"
              step="0.0001"
              min="0"
              placeholder="0.0000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-[#0B1220] border-gray-600 text-white focus:border-[#2F80FF] focus:ring-[#2F80FF]"
            />
            {isInsufficientBalance && (
              <p className="text-red-400 text-xs mt-1">Insufficient balance</p>
            )}
          </div>

          {/* Status Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Payment failed: {error.message}
              </AlertDescription>
            </Alert>
          )}

          {hash && !isConfirmed && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Transaction submitted: {hash.slice(0, 10)}...
                {isConfirming && ' (Confirming...)'}
              </AlertDescription>
            </Alert>
          )}

          {isConfirmed && (
            <Alert className="border-green-500/30 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                Payment successful! Transaction confirmed.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full glow-button"
          >
            {isPending || isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {isPending ? 'Submitting...' : 'Processing...'}
              </>
            ) : isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Confirming...
              </>
            ) : (
              'Make Payment'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

