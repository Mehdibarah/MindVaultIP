import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

/**
 * Individual chat message component
 */
export default function ChatMessage({ message, isOwn, showAvatar = true }) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatAddress = (address) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {showAvatar && (
        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${
          isOwn 
            ? 'from-blue-500 to-purple-600' 
            : 'from-gray-500 to-gray-600'
        } flex items-center justify-center`}>
          <User className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block px-4 py-2 rounded-lg ${
          isOwn 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-700 text-gray-100'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>
        
        <div className={`mt-1 text-xs text-gray-400 ${isOwn ? 'text-right' : 'text-left'}`}>
          <span className="font-mono">{formatAddress(message.sender)}</span>
          <span className="mx-2">•</span>
          <span>{formatTime(message.created_at)}</span>
        </div>
      </div>
    </motion.div>
  );
}