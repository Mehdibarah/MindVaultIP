import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, User, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ChatService, supabase, CHAT_ENABLED } from '@/lib/supabaseClient';
import { getProfile } from '@/services/profile';
import { useAccount } from 'wagmi';
import FallbackNotice from '@/components/FallbackNotice';

const translations = {
  en: {
    typeMessage: 'Type a message...',
    send: 'Send',
    loading: 'Loading messages...',
    noMessages: 'No messages yet. Start the conversation!',
    errorSending: 'Error sending message',
    messageSent: 'Message sent',
    back: 'Back'
  },
  fa: {
    typeMessage: 'پیام بنویسید...',
    send: 'ارسال',
    loading: 'در حال بارگذاری پیام‌ها...',
    noMessages: 'هنوز پیامی وجود ندارد. گفتگو را شروع کنید!',
    errorSending: 'خطا در ارسال پیام',
    messageSent: 'پیام ارسال شد',
    back: 'بازگشت'
  }
};

export default function ChatRoom({ conversation, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherProfile, setOtherProfile] = useState(null);
  
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      loadMessages();
      loadOtherProfile();
      subscribeToMessages();
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const msgs = await ChatService.getRecentMessagesForConv(conversation.id);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOtherProfile = async () => {
    try {
      const otherWallet = conversation.a_wallet.toLowerCase() === address?.toLowerCase() 
        ? conversation.b_wallet 
        : conversation.a_wallet;
      
      const profile = await getProfile(otherWallet);
      setOtherProfile(profile);
    } catch (error) {
      console.error('Error loading other profile:', error);
    }
  };

  const subscribeToMessages = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = ChatService.subscribeToMessagesForConv(
      conversation.id,
      (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      }
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const success = await ChatService.sendMessageToConversation(conversation.id, newMessage.trim());
      
      if (success) {
        setNewMessage('');
        toast({
          title: t.messageSent,
          variant: "default",
        });
      } else {
        toast({
          title: t.errorSending,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t.errorSending,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  const otherWallet = conversation.a_wallet.toLowerCase() === address?.toLowerCase() 
    ? conversation.b_wallet 
    : conversation.a_wallet;

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <img
              src={otherProfile?.avatar_url || `https://api.dicebear.com/6.x/identicon/svg?seed=${otherWallet}`}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-medium">
              {otherProfile?.display_name || `${otherWallet.slice(0, 6)}...${otherWallet.slice(-4)}`}
            </h3>
            <p className="text-gray-400 text-sm">{otherWallet}</p>
          </div>
          
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-400">{t.loading}</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">{t.noMessages}</p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => {
              const isOwn = message.sender.toLowerCase() === address?.toLowerCase();
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-white'
                  }`}>
                    <p className="text-sm">{message.body}</p>
                    <p className={`text-xs mt-1 ${
                      isOwn ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-900">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.typeMessage}
            className="flex-1 bg-gray-700 border-gray-600 text-white"
            disabled={sending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
