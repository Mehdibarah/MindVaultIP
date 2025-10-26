import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

/**
 * Chat input component with send functionality
 */
export default function ChatInput({ onSendMessage, disabled = false, placeholder = "Type a message..." }) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || isSending || disabled) {
      return;
    }

    setIsSending(true);
    
    try {
      await onSendMessage(message.trim());
      setMessage(''); // Clear input on success
    } catch (error) {
      console.error('Failed to send message:', error);
      // Keep message in input if sending failed
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-gray-800 border-t border-gray-600">
      <div className="flex-1">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled || isSending}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          rows={1}
          style={{
            minHeight: '40px',
            maxHeight: '120px',
            height: 'auto'
          }}
          onInput={(e) => {
            // Auto-resize textarea
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
          }}
        />
      </div>
      
      <Button
        type="submit"
        disabled={!message.trim() || isSending || disabled}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isSending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">Send</span>
      </Button>
    </form>
  );
}