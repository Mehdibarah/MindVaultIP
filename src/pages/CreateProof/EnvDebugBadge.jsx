import React from 'react';
import { Badge } from '@/components/ui/badge';
import { debugEnv } from '@/lib/env';

export default function EnvDebugBadge() {
  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  const env = debugEnv();
  const canPay = env.paymentsEnabled && env.isValidPaymentAddress && env.isValidRegFee;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge 
        variant={canPay ? "default" : "destructive"}
        className="text-xs"
      >
        PAY: {canPay ? 'ENABLED' : 'DISABLED'}
      </Badge>
      <div className="mt-1 text-xs text-gray-400">
        <div>Enabled: {env.paymentsEnabled ? '✓' : '✗'}</div>
        <div>Address: {env.isValidPaymentAddress ? '✓' : '✗'}</div>
        <div>Fee: {env.isValidRegFee ? '✓' : '✗'}</div>
      </div>
    </div>
  );
}
