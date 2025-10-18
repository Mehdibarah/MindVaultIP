import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Bot, CheckCircle, XCircle, Award, AlertTriangle } from 'lucide-react';

const getAIStatusConfig = (validationStatus, aiScore) => {
  switch (validationStatus) {
    case 'pending_ai_review':
      return {
        icon: Bot,
        label: 'AI Review Pending',
        className: 'bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse'
      };
    case 'ai_approved':
      return {
        icon: CheckCircle,
        label: `AI Approved (${aiScore}/100)`,
        className: 'bg-green-500/20 text-green-400 border-green-500/30'
      };
    case 'ai_rejected':
      return {
        icon: XCircle,
        label: `AI Rejected (${aiScore}/100)`,
        className: 'bg-red-500/20 text-red-400 border-red-500/30'
      };
    case 'registered':
      return {
        icon: Award,
        label: 'Registered On-Chain',
        className: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      };
    default:
      return {
        icon: Clock,
        label: 'Unknown Status',
        className: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      };
  }
};

export default function AIReviewStatusBadge({ validationStatus, aiScore, className = "" }) {
  const config = getAIStatusConfig(validationStatus, aiScore);
  const IconComponent = config.icon;

  return (
    <Badge className={`${config.className} border flex items-center gap-1 ${className}`}>
      <IconComponent className="w-3 h-3" />
      <span className="text-xs font-medium">{config.label}</span>
    </Badge>
  );
}