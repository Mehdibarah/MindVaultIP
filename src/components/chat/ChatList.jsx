import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { ChatService, ProfileService, supabase, CHAT_ENABLED } from '@/lib/supabaseClient';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import FallbackNotice from '@/components/FallbackNotice';

const translations = {
  en: {
    title: 'Chat',
    searchPlaceholder: 'Enter wallet address to start chat...',
    recentConversations: 'Recent Conversations',
    noConversations: 'No conversations yet. Start a chat by searching for a wallet address.',
    invalidAddress: 'Invalid wallet address',
    startChat: 'Start Chat',
    lastMessage: 'Last message',
    online: 'Online',
    offline: 'Offline'
  },
  fa: {
    title: 'چت',
    searchPlaceholder: 'آدرس کیف پول را وارد کنید تا چت شروع شود...',
    recentConversations: 'گفتگوهای اخیر',
    noConversations: 'هنوز گفتگویی وجود ندارد. با جستجوی آدرس کیف پول چت را شروع کنید.',
    invalidAddress: 'آدرس کیف پول نامعتبر',
    startChat: 'شروع چت',
    lastMessage: 'آخرین پیام',
    online: 'آنلاین',
    offline: 'آفلاین'
  }
};

export default function ChatList({ onSelectConversation }) {
  const [searchAddress, setSearchAddress] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  useEffect(() => {
    if (isConnected && address) {
      loadConversations();
    } else {
      setLoading(false);
    }
  }, [isConnected, address]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const convs = await ChatService.getUserConversations();
      setConversations(convs);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchAddress.trim()) return;

    // Validate wallet address
    if (!ethers.utils.isAddress(searchAddress)) {
      toast({
        title: t.invalidAddress,
        variant: "destructive",
      });
      return;
    }

    // Don't allow chatting with yourself
    if (searchAddress.toLowerCase() === address?.toLowerCase()) {
      toast({
        title: "Cannot chat with yourself",
        variant: "destructive",
      });
      return;
    }

    try {
      setSearching(true);
      const conversation = await ChatService.getOrCreateConversation(address, searchAddress);
      if (conversation) {
        onSelectConversation(conversation);
        setSearchAddress('');
        await loadConversations(); // Refresh the list
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: "Error starting chat",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const t = translations.en; // You can add language detection here

  if (!CHAT_ENABLED || !supabase) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <FallbackNotice
          title="Chat Service Not Available"
          details="Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable chat features."
          icon="error"
        />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <FallbackNotice
          title="Wallet Required"
          details="Please connect your wallet to access chat features."
          icon="wallet"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white text-center">
          <MessageCircle className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
          <p className="text-xl">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          {t.title}
        </h2>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.searchPlaceholder}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={searching || !searchAddress.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {searching ? '...' : t.startChat}
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">{t.noConversations}</p>
          </div>
        ) : (
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-400 mb-3 px-2">
              {t.recentConversations}
            </h3>
            <div className="space-y-2">
              {conversations.map((conv) => {
                const otherWallet = conv.a_wallet.toLowerCase() === address?.toLowerCase() 
                  ? conv.b_wallet 
                  : conv.a_wallet;
                
                return (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => onSelectConversation(conv)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <img
                          src={`https://api.dicebear.com/6.x/identicon/svg?seed=${otherWallet}`}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {otherWallet.slice(0, 6)}...{otherWallet.slice(-4)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {new Date(conv.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-900/50 text-green-300">
                        {t.online}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
