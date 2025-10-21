import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { normalizeNetwork, isSupportedChain } from '@/lib/network';
import { getEnvSummary } from '@/lib/diagnostics';

export default function DiagnosticsWidget() {
  const { address, chainId } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [rpcStatus, setRpcStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [networkInfo, setNetworkInfo] = useState<any>(null);

  const envSummary = getEnvSummary();

  useEffect(() => {
    if (chainId) {
      const normalized = normalizeNetwork({ chainId, name: 'unknown' });
      setNetworkInfo(normalized);
    }
  }, [chainId]);

  const checkRpc = async () => {
    setRpcStatus('checking');
    try {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setRpcStatus('success');
        console.log('RPC Check successful, chainId:', chainId);
      } else {
        setRpcStatus('error');
      }
    } catch (error) {
      console.error('RPC Check failed:', error);
      setRpcStatus('error');
    }
  };

  // Only show in debug mode
  if (!envSummary.debug) {
    return <></>;
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-gray-800 border-gray-600 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm">Debug Panel</CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Account Info */}
          <div>
            <div className="text-xs text-gray-400 mb-1">Account</div>
            <div className="text-sm text-white font-mono">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
            </div>
          </div>

          {/* Network Info */}
          <div>
            <div className="text-xs text-gray-400 mb-1">Network</div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={networkInfo?.isSupported ? "default" : "destructive"}
                className="text-xs"
              >
                {networkInfo?.name || 'Unknown'}
              </Badge>
              <span className="text-sm text-white">({chainId || 'N/A'})</span>
            </div>
          </div>

          {/* Environment Summary */}
          <div>
            <div className="text-xs text-gray-400 mb-1">Environment</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-xs text-white">Mode: {envSummary.mode}</span>
              </div>
              <div className="flex items-center gap-2">
                {envSummary.hasRpcUrl ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-red-500" />
                )}
                <span className="text-xs text-white">RPC: {envSummary.hasRpcUrl ? 'OK' : 'Missing'}</span>
              </div>
              <div className="flex items-center gap-2">
                {envSummary.hasContractAddress ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-red-500" />
                )}
                <span className="text-xs text-white">Contract: {envSummary.hasContractAddress ? 'OK' : 'Missing'}</span>
              </div>
            </div>
          </div>

          {/* RPC Check */}
          <div>
            <Button
              onClick={checkRpc}
              disabled={rpcStatus === 'checking'}
              size="sm"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white"
            >
              {rpcStatus === 'checking' ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  Checking...
                </>
              ) : rpcStatus === 'success' ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                  RPC OK
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-2 text-red-500" />
                  RPC Error
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
