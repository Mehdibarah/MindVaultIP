import React from 'react'
import { motion } from 'framer-motion'
import TokenBalance from '@/components/contract/TokenBalance'
import PaymentForm from '@/components/contract/PaymentForm'
import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Wallet, Code, Zap } from 'lucide-react'

export default function ContractDemo() {
  const { isConnected } = useAccount()

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
            Contract Integration Demo
          </h1>
          <p className="text-gray-400 text-lg">
            Interact with MindVaultIP smart contracts
          </p>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <Alert className="mb-6 border-yellow-500/30 bg-yellow-500/10">
            <Wallet className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to interact with the contracts
            </AlertDescription>
          </Alert>
        )}

        {/* Contract Info */}
        <Card className="bg-[#1a2332] border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Code className="w-5 h-5" />
              Contract Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400 text-sm">MindVaultIP Core Contract</span>
                <p className="text-white font-mono text-sm break-all">
                  {import.meta.env.VITE_CONTRACT_ADDRESS || 'Not configured'}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Payment Contract</span>
                <p className="text-white font-mono text-sm break-all">
                  {import.meta.env.VITE_PAYMENT_ADDRESS || '0x63A8000bD167183AA43629d7C315d0FCc14B95ea'}
                </p>
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Network</span>
              <p className="text-white font-semibold">
                {import.meta.env.VITE_NETWORK || 'base'} (Chain ID: {import.meta.env.VITE_CHAIN_ID || '8453'})
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Token Balance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TokenBalance />
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PaymentForm />
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-[#1a2332] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Available Contract Functions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">balanceOf</h4>
                  <p className="text-gray-400 text-sm">Get token balance for an address</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">allowance</h4>
                  <p className="text-gray-400 text-sm">Check spending allowance</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">transferFrom</h4>
                  <p className="text-gray-400 text-sm">Transfer tokens between addresses</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">decimals</h4>
                  <p className="text-gray-400 text-sm">Get token decimal places</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

