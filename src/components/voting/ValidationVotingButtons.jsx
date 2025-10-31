import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Vote } from '@/services/entities/Vote';
import { Proof } from '@/services/entities';
import { User } from '@/services/entities';
import { InvokeLLM } from '@/services/integrations';
import { useWallet } from '../wallet/WalletContext';
import { motion } from 'framer-motion';

export default function ValidationVotingButtons({ proof, onVoteUpdate }) {
  const { isConnected, address } = useWallet();
  const [userVote, setUserVote] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

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

  const triggerAIReview = async (proofData) => {
    try {
      setIsProcessingAI(true);
      
      const aiPrompt = `
        Please analyze this invention/idea submission for validation:
        
        Title: ${proofData.title}
        Category: ${proofData.category}
        Description: ${proofData.description || 'No description provided'}
        
        Please evaluate:
        1. Novelty: Is this idea unique and innovative?
        2. Eligibility: Does it qualify as a legitimate invention or innovative idea?
        3. Prior Art: Based on your knowledge, does this appear to be original?
        
        Provide a thorough analysis and conclude with APPROVED or REJECTED.
      `;

      const aiResult = await InvokeLLM({
        prompt: aiPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            novelty_score: { type: "number", description: "Score from 1-10" },
            eligibility_score: { type: "number", description: "Score from 1-10" },
            prior_art_risk: { type: "string", enum: ["low", "medium", "high"] },
            overall_decision: { type: "string", enum: ["APPROVED", "REJECTED"] },
            summary: { type: "string", description: "Detailed review summary" },
            reasoning: { type: "string", description: "Explanation for the decision" }
          }
        }
      });

      // Update proof with AI review results
      const updatedProof = {
        ...proofData,
        validation_status: aiResult.overall_decision === 'APPROVED' ? 'verified' : 'rejected',
        ai_review_result: aiResult,
        ai_review_summary: `${aiResult.summary} - Decision: ${aiResult.overall_decision}`
      };

      await Proof.update(proof.id, updatedProof);

      // If verified, reward positive voters
      if (aiResult.overall_decision === 'APPROVED') {
        await rewardPositiveVoters(proof.id);
      }

      if (onVoteUpdate) {
        onVoteUpdate(updatedProof);
      }

      setIsProcessingAI(false);
      return updatedProof;
    } catch (error) {
      console.error('Error in AI review:', error);
      setIsProcessingAI(false);
      throw error;
    }
  };

  const rewardPositiveVoters = async (proofId) => {
    try {
      const votes = await Vote.list();
      const positiveVotes = votes.filter(v => v.proof_id === proofId && v.vote_type === 'positive');

      for (const vote of positiveVotes) {
        // Award validation points to positive voters
        await Vote.update(vote.id, {
          ...vote,
          validation_points_earned: 1,
          is_rewarded: true
        });

        // Update voter's validation points
        const voters = await User.list();
        const voter = voters.find(u => u.wallet_address === vote.voter_wallet);
        if (voter) {
          const newValidationPoints = (voter.validation_points || 0) + 1;
          const newSuccessfulValidations = (voter.successful_validations || 0) + 1;
          
          let tokenReward = 0;
          // Award EXO token for every 100 validation points
          if (newValidationPoints >= 100 && (voter.validation_points || 0) < 100) {
            tokenReward = Math.floor(newValidationPoints / 100);
          }

          await User.update(voter.id, {
            ...voter,
            validation_points: newValidationPoints,
            successful_validations: newSuccessfulValidations,
            exo_token_balance: (voter.exo_token_balance || 0) + tokenReward,
            reputation_score: Math.min((voter.reputation_score || 1) + 0.1, 5)
          });
        }
      }
    } catch (error) {
      console.error('Error rewarding positive voters:', error);
    }
  };

  const handleVote = async (voteType) => {
    if (!isConnected || hasVoted || isProcessingAI) return;

    setIsVoting(true);
    try {
      // Get current user
      const currentUser = await User.me();
      
      // Create vote record
      await Vote.create({
        proof_id: proof.id,
        voter_wallet: address,
        vote_type: voteType,
        voter_reputation: currentUser.reputation_score || 1
      });

      // Update proof vote counts
      const updatedProof = {
        ...proof,
        vote_count_positive: voteType === 'positive' ? 
          (proof.vote_count_positive || 0) + 1 : (proof.vote_count_positive || 0),
        vote_count_negative: voteType === 'negative' ? 
          (proof.vote_count_negative || 0) + 1 : (proof.vote_count_negative || 0)
      };

      // Check if 40% threshold is met for AI review
      const totalVotes = updatedProof.vote_count_positive + updatedProof.vote_count_negative;
      const positivePercentage = totalVotes > 0 ? (updatedProof.vote_count_positive / totalVotes) * 100 : 0;

      if (totalVotes >= 5 && positivePercentage >= 40 && proof.validation_status === 'pending') {
        // Move to AI review
        updatedProof.validation_status = 'ai_review';
        await Proof.update(proof.id, updatedProof);
        
        // Trigger AI review
        await triggerAIReview(updatedProof);
      } else {
        await Proof.update(proof.id, updatedProof);
        if (onVoteUpdate) {
          onVoteUpdate(updatedProof);
        }
      }

      // Update user stats
      await User.updateMyUserData({
        total_votes_cast: (currentUser.total_votes_cast || 0) + 1,
        wallet_address: address
      });

      setUserVote(voteType);
      setHasVoted(true);

    } catch (error) {
      console.error('Error voting:', error);
      alert('Error submitting vote. Please try again.');
    }
    setIsVoting(false);
  };

  // Don't show voting buttons for own proofs or if user is not connected
  if (!isConnected || proof.owner_wallet_address === address || proof.validation_status !== 'pending') {
    return null;
  }

  const totalVotes = (proof.vote_count_positive || 0) + (proof.vote_count_negative || 0);
  const positivePercentage = totalVotes > 0 ? ((proof.vote_count_positive || 0) / totalVotes * 100).toFixed(1) : 0;

  return (
    <div className="space-y-4">
      {/* Voting Progress */}
      <div className="bg-[#1a2332] p-4 rounded-lg">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Community Validation Progress</span>
          <span>{positivePercentage}% positive (need 40%)</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full"
            style={{ width: `${Math.min(positivePercentage, 100)}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(positivePercentage, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>👍 {proof.vote_count_positive || 0} positive</span>
          <span>👎 {proof.vote_count_negative || 0} negative</span>
        </div>
      </div>

      {/* Voting Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => handleVote('positive')}
          disabled={isVoting || hasVoted || isProcessingAI}
          variant={userVote === 'positive' ? 'default' : 'outline'}
          className={`flex-1 ${
            userVote === 'positive' 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'border-green-600/30 text-green-400 hover:bg-green-600/10'
          }`}
        >
          {isVoting && userVote !== 'positive' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ThumbsUp className="w-4 h-4 mr-2" />
          )}
          Yes, Valid Invention
        </Button>
        
        <Button
          onClick={() => handleVote('negative')}
          disabled={isVoting || hasVoted || isProcessingAI}
          variant={userVote === 'negative' ? 'default' : 'outline'}
          className={`flex-1 ${
            userVote === 'negative' 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'border-red-600/30 text-red-400 hover:bg-red-600/10'
          }`}
        >
          {isVoting && userVote !== 'negative' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ThumbsDown className="w-4 h-4 mr-2" />
          )}
          No, Not Valid
        </Button>
      </div>

      {isProcessingAI && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-400" />
          <p className="text-blue-300 font-medium">🤖 AI Review in Progress</p>
          <p className="text-sm text-gray-400">Checking novelty, eligibility, and prior art...</p>
        </div>
      )}
    </div>
  );
}