import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatWindow from '@/components/chat/ChatWindow';
import { ChatService, supabase, CHAT_ENABLED } from '@/lib/supabaseClient';
import FallbackNotice from '@/components/FallbackNotice';

/**
 * Direct message chat page
 */
export default function DirectMessage() {
  const { peerAddress } = useParams();
  const navigate = useNavigate();
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        if (!CHAT_ENABLED || !supabase) {
          console.warn('Supabase not configured. Skipping chat initialization.');
          setIsLoading(false);
          return;
        }

        const address = await ChatService.getCurrentAddress();
        setCurrentAddress(address);

        if (!address) {
          setIsLoading(false);
          return;
        }

        if (!peerAddress) {
          setIsLoading(false);
          return;
        }

        // Validate peer address format
        if (!peerAddress.startsWith('0x') || peerAddress.length !== 42) {
          setIsLoading(false);
          return;
        }

        // Generate room ID for DM
        const dmRoomId = ChatService.getDMRoomId(address, peerAddress);
        setRoomId(dmRoomId);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [peerAddress]);

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
          details="Please connect your wallet to access direct messages."
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

  if (!peerAddress || !peerAddress.startsWith('0x') || peerAddress.length !== 42) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <FallbackNotice
          title="Invalid Address"
          details="The provided wallet address is not valid."
          icon="error"
          action={
            <Button
              onClick={() => navigate('/chat')}
              className="glow-button text-white font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
          }
        />
      </div>
    );
  }

  if (!roomId) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <FallbackNotice
          title="Chat Error"
          details="Failed to initialize direct message chat."
          icon="error"
          action={
            <Button
              onClick={() => navigate('/chat')}
              className="glow-button text-white font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
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
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Direct Message</h1>
              <p className="text-gray-400">Private conversation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>You: {currentAddress.slice(0, 6)}...{currentAddress.slice(-4)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Peer: {peerAddress.slice(0, 6)}...{peerAddress.slice(-4)}</span>
            </div>
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
              roomId={roomId}
              roomType="dm"
              peerAddress={peerAddress}
              onBack={() => navigate('/chat')}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
