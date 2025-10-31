import React from 'react';
import { Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentStatus({ 
  enabled, 
  reason, 
  onContinueWithoutPayment, 
  onBack 
}) {
  if (enabled) {
    return null; // Don't show banner when payments are enabled
  }

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 text-center">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-yellow-500" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Payment System Unavailable</h3>
      <p className="text-gray-300 mb-4">
        {reason || 'Payment configuration is incomplete. You can still create proofs, but payment functionality is not available.'}
      </p>
      <div className="flex gap-3 justify-center">
        {onContinueWithoutPayment && (
          <Button
            onClick={onContinueWithoutPayment}
            className="bg-[#00E5FF] hover:bg-[#00E5FF]/80 text-black font-semibold"
          >
            Continue Without Payment
          </Button>
        )}
        {onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            ← Back to Form
          </Button>
        )}
      </div>
    </div>
  );
}
