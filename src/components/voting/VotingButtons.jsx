import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Vote } from '@/api/entities/Vote';
import { Proof } from '@/api/entities';
import { User } from '@/api/entities';
import { useWallet } from '../wallet/WalletContext';

export default function VotingButtons({ proof, onVoteUpdate }) {
  const { isConnected, address } = useWallet();
  const [userVote, setUserVote] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const checkUserVote = useCallback(async () => {
    try {
      const votes = await Vote.list();
      const existingVote = votes.find(v => 
        v.proof_id === proof.id && v.voter_wallet === address
      );
      if (existingVote) {
        setUserVote(existingVote.vote_type);
        setHasVoted(true);
      }
    } catch (error) {
      console.error('Error checking user vote:', error);
    }
  }, [proof.id, address]);

  useEffect(() => {
    if (isConnected && address) {
      checkUserVote();
    }
  }, [isConnected, address, checkUserVote]);

  const handleVote = async (voteType) => {
    if (!isConnected || hasVoted) return;

    setIsVoting(true);
    try {
      // Get current user for reputation
      const currentUser = await User.me();
      
      // Create vote record
      await Vote.create({
        proof_id: proof.id,
        voter_wallet: address,
        vote_type: voteType,
        voter_reputation: currentUser.reputation_score || 1,
        reward_given: true
      });

      // Update proof vote counts
      const updatedProof = {
        ...proof,
        yes_votes: voteType === 'yes' ? (proof.yes_votes || 0) + 1 : (proof.yes_votes || 0),
        no_votes: voteType === 'no' ? (proof.no_votes || 0) + 1 : (proof.no_votes || 0)
      };

      // Check if proof should be community verified (60% threshold)
      const totalVotes = updatedProof.yes_votes + updatedProof.no_votes;
      if (totalVotes >= 5) { // Minimum 5 votes
        const yesPercentage = (updatedProof.yes_votes / totalVotes) * 100;
        if (yesPercentage >= 60 && proof.validation_status === 'pending') {
          updatedProof.validation_status = 'community_verified';
        } else if (yesPercentage < 40 && proof.validation_status === 'pending') {
          updatedProof.validation_status = 'rejected';
        }
      }

      await Proof.update(proof.id, updatedProof);

      // Update user stats and give reward
      await User.updateMyUserData({
        exo_token_balance: (currentUser.exo_token_balance || 0) + 1,
        total_votes_cast: (currentUser.total_votes_cast || 0) + 1,
        reputation_score: Math.min((currentUser.reputation_score || 1) + 0.1, 5)
      });

      setUserVote(voteType);
      setHasVoted(true);
      
      if (onVoteUpdate) {
        onVoteUpdate(updatedProof);
      }

    } catch (error) {
      console.error('Error voting:', error);
      alert('Error submitting vote. Please try again.');
    }
    setIsVoting(false);
  };

  // Don't show voting buttons for own proofs or if user is not connected
  if (!isConnected || proof.owner_wallet_address === address) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleVote('yes')}
        disabled={isVoting || hasVoted}
        variant={userVote === 'yes' ? 'default' : 'outline'}
        className={`flex-1 ${
          userVote === 'yes' 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'border-green-600/30 text-green-400 hover:bg-green-600/10'
        }`}
      >
        {isVoting && userVote !== 'yes' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <ThumbsUp className="w-4 h-4 mr-2" />
        )}
        Yes ({proof.yes_votes || 0})
      </Button>
      
      <Button
        onClick={() => handleVote('no')}
        disabled={isVoting || hasVoted}
        variant={userVote === 'no' ? 'default' : 'outline'}
        className={`flex-1 ${
          userVote === 'no' 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'border-red-600/30 text-red-400 hover:bg-red-600/10'
        }`}
      >
        {isVoting && userVote !== 'no' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <ThumbsDown className="w-4 h-4 mr-2" />
        )}
        No ({proof.no_votes || 0})
      </Button>
    </div>
  );
}