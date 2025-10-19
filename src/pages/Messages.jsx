import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User, Clock, Search, Plus } from 'lucide-react';

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock message threads data
  const messageThreads = [
    {
      id: 1,
      name: "Alex Chen",
      lastMessage: "Thanks for the feedback on my patent application!",
      timestamp: "2 hours ago",
      unread: true,
      avatar: null
    },
    {
      id: 2,
      name: "Sarah Johnson",
      lastMessage: "The marketplace listing looks great. Ready to proceed?",
      timestamp: "1 day ago",
      unread: false,
      avatar: null
    },
    {
      id: 3,
      name: "Dr. Michael Rodriguez",
      lastMessage: "I've reviewed your invention proposal. Very impressive work.",
      timestamp: "3 days ago",
      unread: true,
      avatar: null
    },
    {
      id: 4,
      name: "Emma Wilson",
      lastMessage: "Let's schedule a call to discuss the collaboration.",
      timestamp: "1 week ago",
      unread: false,
      avatar: null
    }
  ];

  const filteredThreads = messageThreads.filter(thread =>
    thread.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl">
                <MessageSquare className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Messages
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Here you can view and send messages. Connect with other innovators, experts, and collaborators in the MindVaultIP community.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Message Threads Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              {/* Search and New Message */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Message Threads List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Conversations</h3>
                {filteredThreads.map((thread) => (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      thread.unread 
                        ? 'bg-blue-500/20 border border-blue-500/30' 
                        : 'bg-gray-700/30 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        {thread.avatar ? (
                          <img src={thread.avatar} alt={thread.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-white truncate">{thread.name}</h4>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {thread.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 truncate">{thread.lastMessage}</p>
                        {thread.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Message Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Select a conversation</h3>
                    <p className="text-sm text-gray-400">Choose a conversation from the sidebar to start messaging</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 p-6 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No conversation selected</h3>
                  <p className="text-gray-500">
                    Select a conversation from the sidebar to view and send messages.
                  </p>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-700">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    disabled
                    className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                  <button
                    disabled
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              We're building a comprehensive messaging system that will allow you to communicate securely 
              with other users, share files, and collaborate on intellectual property projects.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">Secure Messaging</h3>
                <p className="text-gray-400 text-sm">
                  End-to-end encryption ensures your conversations remain private and secure.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">File Sharing</h3>
                <p className="text-gray-400 text-sm">
                  Share documents, images, and other files directly within your conversations.
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Chat</h3>
                <p className="text-gray-400 text-sm">
                  Instant messaging with real-time notifications and message status indicators.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Messages;