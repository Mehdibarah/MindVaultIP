import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Wallet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWallet } from '@/components/wallet/WalletContext';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const Signup = () => {
  const { address, isConnected, connect, disconnect, shortAddress } = useWallet();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-[#1a2332] rounded-2xl p-8 shadow-2xl border border-green-500/30 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-gray-400 mb-6">
            Welcome to MindVaultIP! Your account has been successfully created.
          </p>
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300">
              <strong>Wallet:</strong> {shortAddress(address)}
            </p>
          </div>
          <Link to={createPageUrl('Dashboard')}>
            <Button className="w-full glow-button">
              Go to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-[#1a2332] rounded-2xl p-8 shadow-2xl border border-gray-700"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join the MindVaultIP community</p>
        </div>

        {/* Wallet Connection Status */}
        <div className="mb-6 p-4 rounded-lg border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-white">Wallet Status</span>
            </div>
            {isConnected ? (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                Connected
              </span>
            ) : (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                Not Connected
              </span>
            )}
          </div>
          
          {isConnected ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                <strong>Address:</strong> {shortAddress(address)}
              </p>
              <Button
                onClick={disconnect}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                Connect your wallet to create an account
              </p>
              <Button
                onClick={connect}
                className="w-full glow-button"
              >
                Connect Wallet
              </Button>
            </div>
          )}
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio (Optional)
            </label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
              required
            />
            <label className="text-sm text-gray-300">
              I agree to the{' '}
              <Link to={createPageUrl('TermsOfService')} className="text-blue-400 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to={createPageUrl('PrivacyPolicy')} className="text-blue-400 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            disabled={!isConnected || isSubmitting}
            className="w-full glow-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to={createPageUrl('Dashboard')} className="text-blue-400 hover:underline">
              Go to Dashboard
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
