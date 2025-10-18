import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, Loader2 } from 'lucide-react';
import { useStripe } from './StripeProvider';

export default function StripePaymentForm({ amount = 1, currency = 'GBP', onPaymentSuccess, onPaymentError }) {
  const { processPayment } = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await processPayment(amount, currency);
      if (result.success) {
        onPaymentSuccess(result);
      } else {
        onPaymentError(result.error || 'Payment failed');
      }
    } catch (error) {
      onPaymentError(error.message);
    }
    setIsProcessing(false);
  };

  return (
    <div className="glow-card p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Secure Payment</h3>
          <p className="text-gray-400">£{amount} GBP - Premium Proof Registration</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-white">Cardholder Name</Label>
          <Input
            value={cardDetails.name}
            onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
            placeholder="John Doe"
            className="bg-[#0B1220] border-gray-600 text-white mt-2"
            required
          />
        </div>

        <div>
          <Label className="text-white">Card Number</Label>
          <Input
            value={cardDetails.number}
            onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
            placeholder="1234 5678 9012 3456"
            className="bg-[#0B1220] border-gray-600 text-white mt-2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-white">Expiry Date</Label>
            <Input
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
              placeholder="MM/YY"
              className="bg-[#0B1220] border-gray-600 text-white mt-2"
              required
            />
          </div>
          <div>
            <Label className="text-white">CVC</Label>
            <Input
              value={cardDetails.cvc}
              onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
              placeholder="123"
              className="bg-[#0B1220] border-gray-600 text-white mt-2"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30 mt-6">
          <Lock className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-400">Your payment is secured with 256-bit SSL encryption</span>
        </div>

        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full glow-button text-white font-semibold h-12 mt-6"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pay £{amount} & Register Proof
            </>
          )}
        </Button>

        <p className="text-xs text-gray-400 text-center mt-4">
          By proceeding, you agree to our terms of service. This is a one-time payment for premium proof registration.
        </p>
      </form>
    </div>
  );
}