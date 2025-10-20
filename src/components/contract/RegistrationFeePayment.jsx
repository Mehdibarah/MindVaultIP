import React, { useState } from 'react'
import { useETHPayment } from '@/hooks/useContract'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle, CreditCard, Zap } from 'lucide-react'

export default function RegistrationFeePayment({ onPaymentSuccess, onPaymentError }) {
  const { isConnected } = useAccount()
  const { 
    payRegistrationFee,
    hasSufficientETH,
    ethBalance,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
    registrationFee
  } = useETHPayment()

  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    if (!isConnected) {
      onPaymentError?.('Please connect your wallet first')
      return
    }

    if (!hasSufficientETH()) {
      onPaymentError?.('Insufficient ETH balance for registration fee')
      return
    }

    setIsProcessing(true)
    try {
      await payRegistrationFee()
    } catch (err) {
      console.error('Payment error:', err)
      onPaymentError?.(err.message || 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle payment success
  React.useEffect(() => {
    if (isConfirmed && hash) {
      onPaymentSuccess?.(hash)
    }
  }, [isConfirmed, hash, onPaymentSuccess])

  // Handle payment error
  React.useEffect(() => {
    if (error) {
      onPaymentError?.(error.message || 'Payment failed')
    }
  }, [error, onPaymentError])

  if (!isConnected) {
    return (
      <Card className="bg-[#1a2332] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Registration Fee
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to pay the registration fee
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const canPay = hasSufficientETH() && !isPending && !isProcessing && !isConfirming
  const isInsufficientBalance = !hasSufficientETH()

  return (
    <Card className="bg-[#1a2332] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Registration Fee
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fee Display */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Registration Fee</span>
            <span className="text-white font-bold text-lg">{registrationFee} ETH</span>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            One-time fee to register your innovation on the blockchain
          </p>
        </div>

        {/* Balance Display */}
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Your ETH Balance</span>
            <span className="text-white font-semibold">{ethBalance} ETH</span>
          </div>
        </div>

        {/* Status Messages */}
        {isInsufficientBalance && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Insufficient ETH balance. You need at least {registrationFee} ETH to register.
            </AlertDescription>
          </Alert>
        )}

        {hash && !isConfirmed && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Payment submitted: {hash.slice(0, 10)}...
              {isConfirming && ' (Confirming...)'}
            </AlertDescription>
          </Alert>
        )}

        {isConfirmed && (
          <Alert className="border-green-500/30 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-400">
              Payment successful! Registration fee paid.
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={!canPay}
          className="w-full glow-button"
        >
          {isPending || isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing Payment...
            </>
          ) : isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Confirming...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay {registrationFee} ETH Registration Fee
            </>
          )}
        </Button>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Payment is processed on Base network</p>
          <p>• Transaction fees apply (gas costs)</p>
          <p>• Registration is permanent and immutable</p>
        </div>
      </CardContent>
    </Card>
  )
}
