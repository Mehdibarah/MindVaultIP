import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Award, XCircle, AlertTriangle } from 'lucide-react';

const getStatusConfig = (validationStatus, blockchainStatus) => {
  // If blockchain status is failed, show that first
  if (blockchainStatus === 'failed') {
    return {
      icon: XCircle,
      label: 'Failed',
      className: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
  }

  // If blockchain is still pending, show that
  if (blockchainStatus === 'pending') {
    return {
      icon: Clock,
      label: 'Processing',
      className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
  }

  // Now check validation status
  switch (validationStatus) {
    case 'pending':
      return {
        icon: AlertTriangle,
        label: 'Pending Votes',
        className: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      };
    case 'community_verified':
      return {
        icon: CheckCircle,
        label: 'Community Verified',
        className: 'bg-green-500/20 text-green-400 border-green-500/30'
      };
    case 'expert_verified':
      return {
        icon: Award,
        label: 'Expert Verified',
        className: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      };
    case 'rejected':
      return {
        icon: XCircle,
        label: 'Rejected',
        className: 'bg-red-500/20 text-red-400 border-red-500/30'
      };
    default:
      return {
        icon: Clock,
        label: 'Pending',
        className: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      };
  }
};

export default function StatusBadge({ validationStatus, blockchainStatus, className = "" }) {
  const config = getStatusConfig(validationStatus, blockchainStatus);
  const IconComponent = config.icon;

  return (
    <Badge className={`${config.className} border flex items-center gap-1 ${className}`}>
      <IconComponent className="w-3 h-3" />
      <span className="text-xs font-medium">{config.label}</span>
    </Badge>
  );
}