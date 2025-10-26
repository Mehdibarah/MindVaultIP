import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ethers } from 'ethers';
import { ChatService } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Search, MessageCircle, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatSearchBar({ myAddr }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const disabled = !myAddr;

  // Validate address as user types
  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setInput(value);
    
    if (value) {
      const isValid = ethers.utils.isAddress(value);
      setIsValidAddress(isValid);
    } else {
      setIsValidAddress(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (disabled) {
      toast({ 
        title: 'Wallet Required', 
        description: 'Please connect your wallet to start a private conversation.',
        variant: 'destructive'
      });
      return;
    }

    const addr = String(input || '').trim().toLowerCase();
    if (!ethers.utils.isAddress(addr)) {
      toast({ 
        title: 'Invalid Address', 
        description: 'Please enter a valid Ethereum wallet address (0x...).',
        variant: 'destructive'
      });
      return;
    }

    if (addr === (myAddr || '').toLowerCase()) {
      toast({ 
        title: 'Cannot Message Yourself', 
        description: 'You cannot start a conversation with your own wallet address.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await ChatService.getOrCreateConversation(myAddr, addr);
      toast({
        title: 'Conversation Started',
        description: `Opening private chat with ${addr.slice(0, 6)}...${addr.slice(-4)}`,
      });
      navigate(`/dm/${addr}`);
    } catch (err) {
      console.error('Failed to start conversation', err);
      toast({ 
        title: 'Error', 
        description: 'Failed to start conversation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700"
    >
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#00E5FF] to-blue-500 rounded-lg flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Start Private Chat</h2>
            <p className="text-sm text-gray-400">Search for a wallet address to begin a conversation</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={disabled ? 'Connect wallet to start a DM' : 'Enter wallet address (0x...)'}
                className={`bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 pr-10 ${
                  input && !isValidAddress ? 'border-red-500 focus:border-red-500' : 
                  input && isValidAddress ? 'border-green-500 focus:border-green-500' : ''
                }`}
                disabled={disabled || isLoading}
              />
              {input && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isValidAddress ? (
                    <User className="w-4 h-4 text-green-500" />
                  ) : (
                    <User className="w-4 h-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={disabled || !input.trim() || !isValidAddress || isLoading}
              className="glow-button text-white font-semibold min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Chat
                </>
              )}
            </Button>
          </div>

          {/* Status messages */}
          {disabled && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="w-4 h-4" />
              <span>Connect your wallet to start private conversations</span>
            </div>
          )}

          {input && !isValidAddress && (
            <div className="flex items-center gap-2 text-sm text-red-400">
              <User className="w-4 h-4" />
              <span>Please enter a valid Ethereum wallet address</span>
            </div>
          )}

          {input && isValidAddress && input.toLowerCase() === (myAddr || '').toLowerCase() && (
            <div className="flex items-center gap-2 text-sm text-yellow-400">
              <User className="w-4 h-4" />
              <span>You cannot start a conversation with yourself</span>
            </div>
          )}

          {input && isValidAddress && input.toLowerCase() !== (myAddr || '').toLowerCase() && (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <User className="w-4 h-4" />
              <span>Valid address - ready to start conversation</span>
            </div>
          )}
        </form>
      </div>
    </motion.div>
  );
}