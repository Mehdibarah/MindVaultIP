import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@/components/wallet/WalletContext';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Search, 
  ArrowLeft,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getConversationId, 
  isValidAddress, 
  normalizeAddress, 
  areAddressesEqual,
  formatAddress,
  validateMessage 
} from '@/utils/conversationUtils';
import { sendMessage, getMessages, getConversations } from '@/api/messages';

const Messages = () => {
  const { address, isConnected } = useWallet();
  const { open } = useWeb3Modal();
  
  // State management
  const [recipientAddress, setRecipientAddress] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversations, setConversations] = useState([]);
  const [showConversations, setShowConversations] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  
  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Load conversations when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      loadConversations();
    }
  }, [isConnected, address]);
  
  // Poll for new messages every 2 seconds
  useEffect(() => {
    if (currentConversationId && isConnected) {
      const interval = setInterval(() => {
        loadMessages(currentConversationId);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [currentConversationId, isConnected]);
  
  const loadConversations = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const response = await getConversations(address);
      if (response.success) {
        setConversations(response.conversations || []);
      } else {
        setError(response.error || 'Failed to load conversations');
      }
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };
  
  const loadMessages = async (convoId) => {
    if (!convoId) return;
    
    try {
      const response = await getMessages({ convoId });
      if (response.success) {
        setMessages(response.messages || []);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };
  
  const startConversation = async () => {
    if (!address || !recipientAddress.trim()) return;
    
    setError('');
    setLoading(true);
    
    try {
      // Validate recipient address
      if (!isValidAddress(recipientAddress.trim())) {
        setError('Invalid wallet address');
        setLoading(false);
        return;
      }
      
      const normalizedRecipient = normalizeAddress(recipientAddress.trim());
      if (!normalizedRecipient) {
        setError('Invalid wallet address');
        setLoading(false);
        return;
      }
      
      // Check if trying to message self
      if (areAddressesEqual(address, normalizedRecipient)) {
        setError('Cannot message yourself');
        setLoading(false);
        return;
      }
      
      // Generate conversation ID
      const convoId = getConversationId(address, normalizedRecipient);
      setCurrentConversationId(convoId);
      setShowConversations(false);
      
      // Load existing messages
      await loadMessages(convoId);
      
      // Clear recipient input
      setRecipientAddress('');
      
    } catch (err) {
      setError('Failed to start conversation');
    } finally {
      setLoading(false);
    }
  };
  
  const sendNewMessage = async () => {
    if (!newMessage.trim() || !currentConversationId || !address || isSending) return;
    
    // Validate message
    const validation = validateMessage(newMessage);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }
    
    setIsSending(true);
    setError('');
    
    try {
      // Get recipient from current conversation
      const otherParticipant = messages.find(msg => msg.sender !== address)?.sender || 
                              conversations.find(conv => conv.convoId === currentConversationId)?.otherParticipant;
      
      if (!otherParticipant) {
        setError('Could not determine recipient');
        setIsSending(false);
        return;
      }
      
      const response = await sendMessage({
        convoId: currentConversationId,
        recipient: otherParticipant,
        body: newMessage.trim()
      }, address);
      
      if (response.success) {
        setNewMessage('');
        // Refresh messages
        await loadMessages(currentConversationId);
        // Refresh conversations
        await loadConversations();
      } else {
        setError(response.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendNewMessage();
    }
  };
  
  const openConversation = (convoId) => {
    setCurrentConversationId(convoId);
    setShowConversations(false);
    loadMessages(convoId);
  };
  
  const backToConversations = () => {
    setShowConversations(true);
    setCurrentConversationId(null);
    setMessages([]);
    setError('');
  };
  
  // Get other participant info for current conversation
  const getOtherParticipant = () => {
    if (!currentConversationId || !address) return null;
    
    const otherMessage = messages.find(msg => msg.sender !== address);
    if (otherMessage) {
      return otherMessage.sender;
    }
    
    const conversation = conversations.find(conv => conv.convoId === currentConversationId);
    return conversation?.otherParticipant || null;
  };
  
  // Wallet not connected state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <CardTitle className="text-2xl text-white">Connect Your Wallet</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-6">
              Connect your wallet to start private conversations with other users.
            </p>
            <Button 
              onClick={open}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            {!showConversations && (
              <Button
                variant="ghost"
                size="sm"
                onClick={backToConversations}
                className="text-white hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-blue-400" />
              Messages
            </h1>
          </div>
          
          {showConversations && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter wallet address or ENS..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="flex-1 bg-slate-800 border-slate-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && startConversation()}
              />
              <Button
                onClick={startConversation}
                disabled={!recipientAddress.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Starting...' : 'Start Chat'}
              </Button>
            </div>
          )}
        </div>
        
        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
          >
            {error}
          </motion.div>
        )}
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <AnimatePresence>
            {showConversations && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-1"
              >
                <Card className="h-full bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Conversations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                      {isLoading ? (
                        <div className="p-4 text-center text-gray-400">
                          Loading conversations...
                        </div>
                      ) : conversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">
                          No conversations yet. Start a chat with someone!
                        </div>
                      ) : (
                        conversations.map((conversation) => (
                          <motion.div
                            key={conversation.convoId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors"
                            onClick={() => openConversation(conversation.convoId)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">
                                  {formatAddress(conversation.otherParticipant)}
                                </p>
                                {conversation.lastMessage && (
                                  <p className="text-gray-400 text-sm truncate">
                                    {conversation.lastMessage.body}
                                  </p>
                                )}
                                {conversation.lastMessage && (
                                  <p className="text-gray-500 text-xs mt-1">
                                    {new Date(conversation.lastMessage.createdAt).toLocaleTimeString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Chat Area */}
          <div className={`${showConversations ? 'lg:col-span-2' : 'col-span-full'}`}>
            <Card className="h-full bg-slate-800 border-slate-700 flex flex-col">
              {currentConversationId ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white">
                          {formatAddress(getOtherParticipant() || '')}
                        </CardTitle>
                        <p className="text-gray-400 text-sm">Online</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                          No messages yet. Start the conversation!
                        </div>
                      ) : (
                        messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.sender === address ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${message.sender === address ? 'order-2' : 'order-1'}`}>
                              <div className={`rounded-lg p-3 ${
                                message.sender === address
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-700 text-slate-200'
                              }`}>
                                <p className="text-sm leading-relaxed">{message.body}</p>
                                <div className={`flex items-center gap-1 mt-2 text-xs ${
                                  message.sender === address ? 'text-blue-100' : 'text-gray-400'
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  {new Date(message.createdAt).toLocaleTimeString()}
                                  {message.sender === address && (
                                    <CheckCheck className="w-3 h-3 ml-1" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </CardContent>
                  
                  {/* Message Composer */}
                  <div className="border-t border-slate-700 p-4">
                    <div className="flex gap-2">
                      <Textarea
                        ref={messageInputRef}
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 bg-slate-700 border-slate-600 text-white resize-none"
                        rows={1}
                        disabled={isSending}
                      />
                      <Button
                        onClick={sendNewMessage}
                        disabled={!newMessage.trim() || isSending}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                      >
                        {isSending ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Press Enter to send, Shift+Enter for new line
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Select a conversation or start a new chat</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;