import React from 'react';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatSidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  newChatText,
  noChatsText
}) {
  return (
    <div className="bg-[#1a2332] p-4 flex flex-col h-full">
      <Button onClick={onNewChat} className="glow-button w-full mb-4">
        <Plus className="mr-2 h-4 w-4" />
        {newChatText}
      </Button>
      <div className="flex-1 overflow-y-auto -mr-2 pr-2">
        {sessions.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <MessageSquare className="mx-auto w-10 h-10 mb-2" />
            <p className="text-sm">{noChatsText}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.map(session => (
              <div
                key={session.id}
                onClick={() => onSelectChat(session.id)}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  activeSessionId === session.id
                    ? 'bg-blue-500/20'
                    : 'hover:bg-white/5'
                }`}
              >
                <p className="text-sm text-white truncate flex-1">
                  {session.title}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent onSelectChat from firing
                    if (window.confirm(`Are you sure you want to delete "${session.title}"?`)) {
                      onDeleteChat(session.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}