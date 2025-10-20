import React, { useState, useEffect } from 'react';
import { useEthersContract } from '@/hooks/useEthersContract';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Wallet, 
  Network, 
  Coins,
  Send,
  RefreshCw
} from 'lucide-react';

export default function EthersContractDemo() {
  const {
    isConnected,
    account,
    network,
    isLoading,
    error,
    contract,
    paymentContract,
    connect,
    switchNetwork,
    getBalance,
    transfer,
    sendPayment,
    getTokenAllowance,
    isBaseNetwork,
    contractAddress,
    paymentAddress,
    chainId,
    clearError
  } = useEthersContract();

  const [balance, setBalance] = useState('0');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('0.001');
  const [allowance, setAllowance] = useState('0');
  const [transactionHash, setTransactionHash] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load balance when connected
  useEffect(() => {
    if (isConnected && account) {
      loadBalance();
    }
  }, [isConnected, account, getBalance]);

  const loadBalance = async () => {
    try {
      setIsRefreshing(true);
      const bal = await getBalance();
      setBalance(bal);
    } catch (err) {
      console.error('Failed to load balance:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferTo || !transferAmount) {
      alert('Please enter recipient address and amount');
      return;
    }

    try {
      const result = await transfer(transferTo, transferAmount);
      setTransactionHash(result.hash);
      setTransferTo('');
      setTransferAmount('');
      await loadBalance(); // Refresh balance
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  const handlePayment = async () => {
    try {
      const result = await sendPayment(paymentAmount);
      setTransactionHash(result.hash);
      await loadBalance(); // Refresh balance
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  const handleCheckAllowance = async () => {
    if (!account) return;
    
    try {
      const allowanceAmount = await getTokenAllowance(account, paymentAddress);
      setAllowance(allowanceAmount);
    } catch (err) {
      console.error('Failed to check allowance:', err);
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-[#1a2332] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect to Smart Contract
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your MetaMask wallet to interact with the smart contract
            </AlertDescription>
          </Alert>
          
          <Button
            onClick={connect}
            disabled={isLoading}
            className="w-full glow-button"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect MetaMask
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-[#1a2332] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Contract Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-400">Account</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Connected
                </Badge>
                <code className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </code>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-400">Network</Label>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={isBaseNetwork ? "default" : "destructive"}
                  className={isBaseNetwork ? "bg-green-500" : "bg-red-500"}
                >
                  {network?.name || 'Unknown'}
                </Badge>
                {!isBaseNetwork && (
                  <Button
                    onClick={switchNetwork}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    Switch to Base
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Contract Address</Label>
            <code className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded block break-all">
              {contractAddress}
            </code>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-400">Payment Address</Label>
            <code className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded block break-all">
              {paymentAddress}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              onClick={clearError}
              size="sm"
              variant="outline"
              className="ml-2"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Contract Interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance & Allowance */}
        <Card className="bg-[#1a2332] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Token Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-400">Token Balance</Label>
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono text-white bg-gray-800 px-3 py-2 rounded flex-1">
                  {balance} IDN
                </code>
                <Button
                  onClick={loadBalance}
                  disabled={isRefreshing}
                  size="sm"
                  variant="outline"
                >
                  {isRefreshing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400">Allowance (Payment Contract)</Label>
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono text-white bg-gray-800 px-3 py-2 rounded flex-1">
                  {allowance} IDN
                </code>
                <Button
                  onClick={handleCheckAllowance}
                  size="sm"
                  variant="outline"
                >
                  Check
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfer Tokens */}
        <Card className="bg-[#1a2332] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Send className="w-5 h-5" />
              Transfer Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transferTo" className="text-gray-400">Recipient Address</Label>
              <Input
                id="transferTo"
                placeholder="0x..."
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="bg-[#0B1220] border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transferAmount" className="text-gray-400">Amount (IDN)</Label>
              <Input
                id="transferAmount"
                type="number"
                step="0.0001"
                placeholder="0.0000"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="bg-[#0B1220] border-gray-600 text-white"
              />
            </div>

            <Button
              onClick={handleTransfer}
              disabled={isLoading || !transferTo || !transferAmount}
              className="w-full glow-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Transferring...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Transfer Tokens
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ETH Payment */}
      <Card className="bg-[#1a2332] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Network className="w-5 h-5" />
            ETH Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentAmount" className="text-gray-400">Amount (ETH)</Label>
            <Input
              id="paymentAmount"
              type="number"
              step="0.0001"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="bg-[#0B1220] border-gray-600 text-white"
            />
          </div>

          <Button
            onClick={handlePayment}
            disabled={isLoading || !paymentAmount}
            className="w-full glow-button"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Sending Payment...
              </>
            ) : (
              <>
                <Network className="w-4 h-4 mr-2" />
                Send {paymentAmount} ETH
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Transaction Hash */}
      {transactionHash && (
        <Alert className="border-green-500/30 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-400">
            <div className="space-y-1">
              <p>Transaction successful!</p>
              <code className="text-xs break-all block">
                Hash: {transactionHash}
              </code>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
