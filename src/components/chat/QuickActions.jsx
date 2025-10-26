import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions({ myAddr }) {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: 'Global Chat',
      description: 'Join the community discussion',
      icon: <Users className="w-4 h-4" />,
      action: () => navigate('/chat'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      label: 'Example Address',
      description: 'Try with a sample wallet address',
      icon: <MessageCircle className="w-4 h-4" />,
      action: () => {
        // Example address - you can replace with a real one
        const exampleAddr = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
        navigate(`/dm/${exampleAddr}`);
      },
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  if (!myAddr) return null;

  return (
    <div className="bg-gray-800/30 border-b border-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Hash className="w-4 h-4" />
          Quick Actions
        </h3>
        <div className="flex gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white font-medium px-4 py-2 h-auto`}
            >
              <div className="flex items-center gap-2">
                {action.icon}
                <div className="text-left">
                  <div className="text-sm font-semibold">{action.label}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}