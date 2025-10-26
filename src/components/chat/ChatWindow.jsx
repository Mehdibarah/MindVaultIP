import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Users, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ChatService, supabase, CHAT_ENABLED } from '@/lib/supabaseClient';
import FallbackNotice from '../FallbackNotice';
import { useToast } from '@/components/ui/use-toast';

/**
 * Main chat window component
 */
export default function ChatWindow({ roomId, roomType = 'global', peerAddress = null, onBack = null }) {
  const [messages, setMessages] = useState([]);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get current wallet address
  useEffect(() => {
    const getAddress = async () => {
      try {
        // Check if Supabase is configured
        if (!CHAT_ENABLED || !supabase) {
          setError('Chat service not configured. Please set Supabase environment variables.');
          if (import.meta.env.DEV) console.warn('Chat disabled via env');
          return;
        }

        const address = await ChatService.getCurrentAddress();
        setCurrentAddress(address);
        
        if (!address) {
          setError('Please connect your wallet to use chat');
        }
      } catch (err) {
        console.error('Failed to get wallet address:', err);
        setError('Failed to connect wallet');
        toast({ title: 'Chat Error', description: 'Failed to connect wallet for chat.' });
      }
    };

    getAddress();
  }, []);

  // Load initial messages and subscribe to new ones
  useEffect(() => {
    if (!roomId && roomType === 'global') return;

    const loadMessages = async () => {
      try {
        if (!CHAT_ENABLED || !supabase) {
          setError('Chat service not configured.');
          setIsLoading(false);
          return;
        }

        setIsLoading(true);

        if (roomType === 'dm') {
          // conversation mode expects conversationId in prop roomId
          const recent = await ChatService.getRecentMessagesForConv(roomId, 200);
          setMessages(recent || []);
        } else {
          const recentMessages = await ChatService.getRecentMessages(roomId, 50);
          setMessages(recentMessages);
        }

        setError(null);
      } catch (err) {
        console.error('Failed to load messages:', err);
        setError('Failed to load messages');
        toast({ title: 'Chat Error', description: 'Failed to load messages.' });
      } finally {
        setIsLoading(false);
      }
    };

    const subscribeToMessages = () => {
      if (!CHAT_ENABLED || !supabase) return;

      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }

      if (roomType === 'dm') {
        subscriptionRef.current = ChatService.subscribeToMessagesForConv(roomId, (newMessage) => {
          setMessages(prev => [...prev, newMessage]);
        });
      } else {
        subscriptionRef.current = ChatService.subscribeToMessages(roomId, (newMessage) => {
          setMessages(prev => [...prev, newMessage]);
        });
      }
    };

    loadMessages();
    subscribeToMessages();

    // Cleanup subscription on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [roomId]);

  const handleSendMessage = async (text) => {
    if (!currentAddress) {
      throw new Error('Wallet not connected');
    }

    let success = false;
    if (roomType === 'dm') {
      // roomId is conv id for DM
      success = await ChatService.sendMessageToConversation(roomId, text);
    } else {
      success = await ChatService.sendMessage(roomId, text);
    }

    if (!success) {
      throw new Error('Failed to send message');
    }
  };

  const getRoomTitle = () => {
    if (roomType === 'dm' && peerAddress) {
      const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
      return `Chat with ${formatAddress(peerAddress)}`;
    }
    return 'Global Chat';
  };

  const getRoomIcon = () => {
    return roomType === 'dm' ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />;
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <FallbackNotice
          title="Chat Unavailable"
          details={error}
          icon="error"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 bg-gray-800 border-b border-gray-600">
        {onBack && (
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          {getRoomIcon()}
          <h2 className="text-lg font-semibold text-white">
            {getRoomTitle()}
          </h2>
        </div>
        
        <div className="ml-auto text-sm text-gray-400">
          {messages.length} messages
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.sender === currentAddress}
                showAvatar={true}
              />
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={!currentAddress || isLoading}
        placeholder={
          !currentAddress 
            ? "Connect wallet to chat..." 
            : `Message ${roomType === 'dm' ? 'user' : 'everyone'}...`
        }
      />
    </div>
  );
}