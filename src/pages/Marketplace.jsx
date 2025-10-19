import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, TrendingUp, Users, Shield, Star } from 'lucide-react';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                <ShoppingCart className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Marketplace
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Welcome to the MindVaultIP Marketplace! Discover, trade, and monetize intellectual property in a secure, decentralized environment.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Platform Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the future of intellectual property trading with our cutting-edge marketplace features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Trading</h3>
            <p className="text-gray-400">
              Advanced algorithms ensure fair pricing and optimal trading opportunities for all participants.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-4">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Global Community</h3>
            <p className="text-gray-400">
              Connect with innovators, investors, and creators from around the world in our vibrant marketplace.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mb-4">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure Transactions</h3>
            <p className="text-gray-400">
              Blockchain-powered security ensures all transactions are transparent, immutable, and secure.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-lg mb-4">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Quality Assurance</h3>
            <p className="text-gray-400">
              AI-powered verification ensures only high-quality intellectual property reaches the marketplace.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              We're building the most advanced intellectual property marketplace on the blockchain. 
              Stay tuned for the official launch with exclusive early access opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                Join Waitlist
              </button>
              <button className="px-8 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-gray-500 hover:text-white transition-all duration-300">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;