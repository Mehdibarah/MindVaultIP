import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/api/entities';
import { useWallet } from '../wallet/WalletContext';
import { 
  User as UserIcon, 
  Award, 
  TrendingUp, 
  Shield, 
  Edit3,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

export default function UserProfile({ userId = null }) {
  const { address } = useWallet();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        if (userId) {
          // Load specific user profile (future feature)
          // const userData = await User.getById(userId);
          // setUser(userData);
        } else {
          // Load current user
          const currentUser = await User.me();
          setUser(currentUser);
          setIsOwnProfile(true);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
      setIsLoading(false);
    };

    loadUser();
  }, [userId, address]);

  const getUserTypeColor = (type) => {
    switch (type) {
      case 'inventor':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'investor':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'both':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getReputationLevel = (score) => {
    if (score >= 500) return { level: 'Expert', color: 'text-yellow-400' };
    if (score >= 250) return { level: 'Advanced', color: 'text-blue-400' };
    if (score >= 100) return { level: 'Intermediate', color: 'text-green-400' };
    return { level: 'Beginner', color: 'text-gray-400' };
  };

  if (isLoading) {
    return (
      <Card className="glow-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-16 w-16 bg-gray-700 rounded-full"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="glow-card">
        <CardContent className="p-6 text-center">
          <UserIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">User profile not found</p>
        </CardContent>
      </Card>
    );
  }

  const reputation = getReputationLevel(user.reputation_score || 100);

  return (
    <Card className="glow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-[#2F80FF] to-[#00E5FF] rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {user.full_name || 'Anonymous User'}
            </h3>
            <p className="text-sm text-gray-400 font-mono">
              {address?.substring(0, 8)}...{address?.substring(address.length - 6)}
            </p>
          </div>
          {isOwnProfile && (
            <Button variant="ghost" size="sm" className="ml-auto">
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Type & Status */}
        <div className="flex flex-wrap gap-2">
          <Badge className={getUserTypeColor(user.user_type)}>
            {user.user_type?.charAt(0).toUpperCase() + user.user_type?.slice(1) || 'Inventor'}
          </Badge>
          {user.verified_investor && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified Investor
            </Badge>
          )}
          <Badge className={`border ${reputation.color.replace('text-', 'border-').replace('-400', '-500/30')} ${reputation.color.replace('text-', 'bg-').replace('-400', '-500/20')}`}>
            <Award className="w-3 h-3 mr-1" />
            {reputation.level}
          </Badge>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="bg-[#0B1220] p-3 rounded-lg border border-gray-700">
            <p className="text-gray-300 text-sm">{user.bio}</p>
          </div>
        )}

        {/* Specializations */}
        {user.specialization && user.specialization.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Specializations</h4>
            <div className="flex flex-wrap gap-2">
              {user.specialization.map((spec, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <div className="text-xl font-bold text-[#2F80FF]">
              {user.reputation_score || 100}
            </div>
            <div className="text-xs text-gray-400">Reputation</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#00E5FF]">
              {user.total_proofs_created || 0}
            </div>
            <div className="text-xs text-gray-400">Proofs Created</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">
              {user.successful_proofs || 0}
            </div>
            <div className="text-xs text-gray-400">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-400">
              {user.total_investments || 0}
            </div>
            <div className="text-xs text-gray-400">Investments</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}