import React, { useState } from 'react'
import { usePaymentContract, useMindVaultIPContract, useContractUtils, useETHPayment } from '@/hooks/useContract'
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
  const {
    payRegistrationFee,
    hasSufficientETH,
    ethBalance,
    hash: ethHash,
    error: ethError,
    isPending: ethIsPending,
    isConfirming: ethIsConfirming,
    isConfirmed: ethIsConfirmed,
    registrationFee
  } = useETHPayment()

  const [amount, setAmount] = useState('')
  const [paymentType, setPaymentType] = useState('eth') // 'eth' or 'token'
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    if (paymentType === 'eth') {
      // ETH payment for registration fee
      if (!hasSufficientETH()) {
        alert('Insufficient ETH balance for registration fee')
        return
      }

      setIsSubmitting(true)
      try {
        await payRegistrationFee()
      } catch (err) {
        console.error('ETH payment error:', err)
        throw err
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Token payment
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
        console.error('Token payment error:', err)
        throw err
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const isInsufficientBalance = paymentType === 'token' && amount && !hasSufficientBalance(amount, balance)
  const isInsufficientETH = paymentType === 'eth' && !hasSufficientETH()
  const canSubmit = isConnected && 
    ((paymentType === 'eth' && hasSufficientETH()) || 
     (paymentType === 'token' && amount && parseFloat(amount) > 0 && !isInsufficientBalance)) &&
    !isPending && !ethIsPending && !isSubmitting

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
        {/* Payment Type Selection */}
        <div className="space-y-3">
          <Label className="text-gray-300">Payment Method</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={paymentType === 'eth' ? 'default' : 'outline'}
              onClick={() => setPaymentType('eth')}
              className="flex-1"
            >
              ETH ({registrationFee} ETH)
            </Button>
            <Button
              type="button"
              variant={paymentType === 'token' ? 'default' : 'outline'}
              onClick={() => setPaymentType('token')}
              className="flex-1"
            >
              IDN Tokens
            </Button>
          </div>
        </div>

        {/* Balance Display */}
        <div className="bg-gray-800/50 p-3 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">ETH Balance</span>
            <span className="text-white font-semibold">{ethBalance} ETH</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">IDN Balance</span>
            <span className="text-white font-semibold">{formatTokenAmount(balance)} IDN</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {paymentType === 'token' && (
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
          )}

          {paymentType === 'eth' && (
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Registration Fee</span>
                <span className="text-white font-bold text-lg">{registrationFee} ETH</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Fixed fee for registering your innovation
              </p>
            </div>
          )}

          {/* Status Messages */}
          {(error || ethError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Payment failed: {(error || ethError)?.message}
              </AlertDescription>
            </Alert>
          )}

          {(hash || ethHash) && !(isConfirmed || ethIsConfirmed) && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Transaction submitted: {(hash || ethHash)?.slice(0, 10)}...
                {(isConfirming || ethIsConfirming) && ' (Confirming...)'}
              </AlertDescription>
            </Alert>
          )}

          {(isConfirmed || ethIsConfirmed) && (
            <Alert className="border-green-500/30 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                Payment successful! Transaction confirmed.
              </AlertDescription>
            </Alert>
          )}

          {isInsufficientETH && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Insufficient ETH balance. You need at least {registrationFee} ETH.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full glow-button"
          >
            {(isPending || ethIsPending || isSubmitting) ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {(isPending || ethIsPending) ? 'Submitting...' : 'Processing...'}
              </>
            ) : (isConfirming || ethIsConfirming) ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Confirming...
              </>
            ) : (
              paymentType === 'eth' ? `Pay ${registrationFee} ETH Registration Fee` : 'Make Payment'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

