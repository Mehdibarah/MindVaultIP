import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';
import { normalizeNetwork, isSupportedChain } from '@/lib/network';
import { switchToBaseMainnet } from '@/lib/switchNetwork';

interface RequireWalletProps {
  children?: React.ReactNode;
}

export default function RequireWallet({ children }: RequireWalletProps) {
  const { address, chainId } = useAccount();
  const [networkWarning, setNetworkWarning] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    if (chainId && !isSupportedChain(chainId)) {
      setNetworkWarning(`You're connected to an unsupported network (Chain ID: ${chainId}). Please switch to Base Mainnet for the best experience.`);
    } else {
      setNetworkWarning(null);
    }
  }, [chainId]);

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    try {
      await switchToBaseMainnet();
      setNetworkWarning(null);
    } catch (error) {
      console.error('Failed to switch network:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  const dismissWarning = () => {
    setNetworkWarning(null);
  };

  return (
    <div className="min-h-screen">
      {/* Network Warning Banner */}
      {networkWarning && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <p className="text-yellow-200 text-sm">{networkWarning}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleSwitchNetwork}
                disabled={isSwitching}
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {isSwitching ? 'Switching...' : 'Switch to Base'}
              </Button>
              <Button
                onClick={dismissWarning}
                size="sm"
                variant="ghost"
                className="text-yellow-200 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Render children if provided, otherwise render outlet */}
      {children ? children : <Outlet />}
    </div>
  );
}
