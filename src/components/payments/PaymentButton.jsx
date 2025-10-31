import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useETHPayment } from '@/hooks/useContract';
import { useAccount, useChainId } from 'wagmi';
import { getPaymentConfig } from '@/utils/paymentConfig';
import { base } from '@/lib/chains';

export default function PaymentButton({ 
  onPaymentSuccess, 
  onPaymentError,
  className = "bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-black font-semibold"
}) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const {
    payRegistrationFee,
    hash: txHash,
    isPending,
    isConfirming,
    isConfirmed,
    error: txError,
    registrationFee,
  } = useETHPayment();
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const paymentConfig = getPaymentConfig();
    setConfig(paymentConfig);
  }, []);

  // Check if on correct network
  const isCorrectNetwork = chainId === base.id || chainId === config?.chainId;

  // Call success callback as soon as we get the transaction hash
  // Proceed with registration immediately - don't wait for blockchain confirmation
  useEffect(() => {
    if (txHash) {
      // Transaction hash is available - proceed with registration immediately
      console.log('[PaymentButton] Payment transaction hash received:', txHash);
      onPaymentSuccess?.(txHash);
    }
  }, [txHash, onPaymentSuccess]);

  // Handle transaction errors
  useEffect(() => {
    if (txError) {
      const errorMsg = txError.message || 'Payment transaction failed';
      console.error('[PaymentButton] Payment error:', txError);
      setError(errorMsg);
      onPaymentError?.(errorMsg);
    }
  }, [txError, onPaymentError]);

  const handlePayment = async () => {
    if (!config?.enabled) {
      const reason = config?.reason || 'Payment system not configured';
      setError(reason);
      onPaymentError?.(reason);
      return;
    }

    if (!isConnected || !address) {
      const errorMsg = 'Please connect your wallet first';
      setError(errorMsg);
      onPaymentError?.(errorMsg);
      return;
    }

    if (!isCorrectNetwork) {
      const errorMsg = `Please switch to Base network (Chain ID: ${base.id})`;
      setError(errorMsg);
      onPaymentError?.(errorMsg);
      return;
    }

    setError(null);

    try {
      console.log('[PaymentButton] Initiating payment...');
      await payRegistrationFee();
      // Success will be handled by useEffect when isConfirmed becomes true
    } catch (err) {
      const errorMsg = err.message || 'Payment failed';
      console.error('[PaymentButton] Payment error:', err);
      setError(errorMsg);
      onPaymentError?.(errorMsg);
    }
  };

  const isLoading = isPending || isConfirming;

  if (!config?.enabled) {
    return (
      <Button disabled className={className}>
        <AlertCircle className="w-4 h-4 mr-2" />
        Payment Unavailable
      </Button>
    );
  }

  if (!isConnected || !address) {
    return (
      <Button disabled className={className}>
        <AlertCircle className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <Button 
        onClick={handlePayment} 
        className={className}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <AlertCircle className="w-4 h-4 mr-2" />
        )}
        Switch to Base Network
      </Button>
    );
  }

  if (error) {
    return (
      <Button 
        onClick={handlePayment} 
        className="bg-red-500 hover:bg-red-600 text-white"
        disabled={isLoading}
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        {error.length > 30 ? error.substring(0, 30) + '...' : error}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handlePayment} 
      className={className}
      disabled={isLoading || isConfirmed}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {isConfirming ? 'Confirming...' : 'Processing...'}
        </>
      ) : isConfirmed ? (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Paid
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          Pay {registrationFee} ETH
        </>
      )}
    </Button>
  );
}
