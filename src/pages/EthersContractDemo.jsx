import React from 'react';
import { motion } from 'framer-motion';
import EthersContractDemo from '@/components/contract/EthersContractDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Zap, Shield, Network } from 'lucide-react';

export default function EthersContractDemoPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Ethers.js Smart Contract Integration
          </h1>
          <p className="text-gray-400 text-lg">
            Direct integration with your deployed smart contract using ethers.js
          </p>
        </div>

        {/* Contract Info */}
        <Card className="bg-[#1a2332] border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Code className="w-5 h-5" />
              Contract Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Contract Address</span>
                  <p className="text-white font-mono text-sm break-all bg-gray-800 p-2 rounded">
                    {import.meta.env.VITE_CONTRACT_ADDRESS || 'Not configured'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Payment Address</span>
                  <p className="text-white font-mono text-sm break-all bg-gray-800 p-2 rounded">
                    {import.meta.env.VITE_PAYMENT_ADDRESS || 'Not configured'}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Network</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      Base Mainnet
                    </Badge>
                    <span className="text-white text-sm">Chain ID: 8453</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Library</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      ethers.js v6
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1a2332] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Direct Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Direct connection to your deployed smart contract using ethers.js provider and signer
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Error Handling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Comprehensive error handling for missing wallet, wrong network, and failed transactions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-400" />
                Network Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Automatic network detection and switching to Base network with MetaMask integration
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Component */}
        <EthersContractDemo />

        {/* Implementation Details */}
        <Card className="bg-[#1a2332] border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Implementation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Available Functions:</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• <code className="text-blue-400">balanceOf(address)</code> - Get token balance</li>
                <li>• <code className="text-blue-400">allowance(owner, spender)</code> - Check spending allowance</li>
                <li>• <code className="text-blue-400">transferFrom(from, to, amount)</code> - Transfer tokens</li>
                <li>• <code className="text-blue-400">decimals()</code> - Get token decimals</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-2">Features:</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• MetaMask wallet integration</li>
                <li>• Automatic network switching to Base</li>
                <li>• Real-time account and network change detection</li>
                <li>• Transaction status tracking</li>
                <li>• Error handling and user feedback</li>
                <li>• ETH payment functionality</li>
                <li>• Token transfer capabilities</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Usage:</h4>
              <div className="bg-gray-800 p-4 rounded-lg">
                <code className="text-sm text-gray-300">
                  {`import { useEthersContract } from '@/hooks/useEthersContract';

const { 
  isConnected, 
  account, 
  contract, 
  connect, 
  transfer, 
  sendPayment 
} = useEthersContract();`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

