import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatWindow from '@/components/chat/ChatWindow';
import { ChatService, supabase, CHAT_ENABLED } from '@/lib/supabaseClient';
import FallbackNotice from '@/components/FallbackNotice';

/**
 * Global chat page
 */
export default function Chat() {
  const navigate = useNavigate();
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAddress = async () => {
      try {
        // Check if Supabase is configured
        if (!CHAT_ENABLED || !supabase) {
          console.warn('Supabase not configured. Chat features will be limited.');
        }

        const address = await ChatService.getCurrentAddress();
        setCurrentAddress(address);
      } catch (error) {
        console.error('Failed to get wallet address:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getAddress();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="text-white">Loading chat...</div>
      </div>
    );
  }

  const chatUnavailable = !CHAT_ENABLED || !supabase;

  if (!currentAddress) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <FallbackNotice
          title="Wallet Required"
          details="Please connect your wallet to access the chat feature."
          icon="wallet"
          action={
            <Button
              onClick={() => navigate('/')}
              className="glow-button text-white font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220]">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-gray-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Global Chat</h1>
              <p className="text-gray-400">Connect with the MindVaultIP community</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>Connected as: {currentAddress.slice(0, 6)}...{currentAddress.slice(-4)}</span>
          </div>
        </motion.div>

        {/* Chat Window or Fallback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          {chatUnavailable ? (
            <div className="max-w-2xl mx-auto h-full flex items-center justify-center p-6">
              <FallbackNotice
                title="Chat Service Not Configured"
                details="Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable chat features."
                icon="error"
                action={
                  <Button
                    onClick={() => navigate('/')}
                    className="glow-button text-white font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                }
              />
            </div>
          ) : (
            <ChatWindow
              roomId="global"
              roomType="global"
              onBack={() => navigate('/')}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
