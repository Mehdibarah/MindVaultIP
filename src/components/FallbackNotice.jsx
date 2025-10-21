import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, Wifi, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * FallbackNotice Component
 * Provides safe fallback UI when components would otherwise render blank
 * Never returns null - always shows visible content
 */
export default function FallbackNotice({ 
  title = "Content Unavailable", 
  details = "This content is temporarily unavailable.",
  icon = "info",
  action = null,
  className = ""
}) {
  // Icon mapping
  const iconMap = {
    info: Info,
    warning: AlertTriangle,
    network: Wifi,
    wallet: Wallet,
    error: AlertTriangle
  };

  const IconComponent = iconMap[icon] || Info;

  return (
    <div className={`min-h-[400px] flex items-center justify-center p-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border border-gray-600 rounded-lg p-8 text-center max-w-md w-full"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          {title}
        </h3>
        
        <p className="text-gray-300 mb-6">
          {details}
        </p>
        
        {action && (
          <div className="space-y-3">
            {action}
          </div>
        )}
        
        {/* Debug info in development */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-3 bg-gray-900/50 rounded text-xs text-gray-400">
            <p>Debug: FallbackNotice rendered</p>
            <p>Title: {title}</p>
            <p>Icon: {icon}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Pre-configured fallback components for common scenarios
export function WalletNotConnectedFallback({ onConnect }) {
  return (
    <FallbackNotice
      title="Wallet Not Connected"
      details="Please connect your wallet to access this feature."
      icon="wallet"
      action={
        onConnect ? (
          <Button onClick={onConnect} className="glow-button text-white font-semibold">
            Connect Wallet
          </Button>
        ) : null
      }
    />
  );
}

export function NetworkUnsupportedFallback({ currentChainId, onSwitchNetwork }) {
  return (
    <FallbackNotice
      title="Unsupported Network"
      details={`You're connected to an unsupported network (Chain ID: ${currentChainId}). Please switch to Base Mainnet.`}
      icon="network"
      action={
        onSwitchNetwork ? (
          <Button onClick={onSwitchNetwork} className="glow-button text-white font-semibold">
            Switch to Base
          </Button>
        ) : null
      }
    />
  );
}

export function ContractNotAvailableFallback() {
  return (
    <FallbackNotice
      title="Contract Not Available"
      details="The smart contract is not properly configured. Please check your environment variables."
      icon="error"
    />
  );
}

export function FeatureDisabledFallback({ featureName = "This feature" }) {
  return (
    <FallbackNotice
      title="Feature Disabled"
      details={`${featureName} is currently disabled. Please check back later.`}
      icon="warning"
    />
  );
}
