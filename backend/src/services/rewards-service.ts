import { Submission } from '../models/submission';
import { AuditLog } from '../models/audit-log';
import { ethers } from 'ethers';

export interface RewardDistribution {
  amount: number;
  token_address: string;
  recipient: string;
  transaction_hash?: string;
  timestamp: string;
}

export class RewardsService {
  private privateKey: string;
  private tokenAddress: string;
  private treasuryAddress: string;
  private provider: ethers.Provider;

  constructor() {
    this.privateKey = process.env.TREASURY_PRIVATE_KEY || '';
    this.tokenAddress = process.env.IDN_TOKEN_ADDRESS || '';
    this.treasuryAddress = process.env.TREASURY_ADDRESS || '';
    
    // Initialize provider for Base network
    this.provider = new ethers.JsonRpcProvider(
      process.env.BASE_RPC_URL || 'https://mainnet.base.org'
    );
  }

  /**
   * Distribute reward for approved submission
   */
  async distributeReward(submission: Submission): Promise<RewardDistribution> {
    const amount = this.calculateRewardAmount(submission);
    
    if (amount <= 0) {
      throw new Error('Invalid reward amount');
    }

    // Transfer tokens to user
    const transactionHash = await this.transferTokens(submission.owner_id, amount);
    
    const reward: RewardDistribution = {
      amount,
      token_address: this.tokenAddress,
      recipient: submission.owner_id,
      transaction_hash: transactionHash,
      timestamp: new Date().toISOString(),
    };

    // Log the reward distribution
    await AuditLog.create({
      submission_id: submission.id,
      action: 'REWARD_DISTRIBUTED',
      payload: reward,
      actor: 'rewards_service',
    });

    return reward;
  }

  /**
   * Calculate reward amount based on submission quality
   */
  private calculateRewardAmount(submission: Submission): number {
    const baseReward = 100; // Base 100 IDN tokens
    const qualityScore = submission.quality_score || 50;
    
    // Formula: base * (quality_score/100) with clamp 50-200
    const calculatedAmount = baseReward * (qualityScore / 100);
    
    // Clamp between 50 and 200 IDN
    const clampedAmount = Math.max(50, Math.min(200, calculatedAmount));
    
    // Convert to wei (assuming 18 decimals)
    return Math.floor(clampedAmount * Math.pow(10, 18));
  }

  /**
   * Transfer IDN tokens to user
   */
  private async transferTokens(recipient: string, amount: number): Promise<string> {
    try {
      if (!this.privateKey || !this.tokenAddress) {
        console.warn('Token transfer skipped: missing configuration');
        return '';
      }

      const wallet = new ethers.Wallet(this.privateKey, this.provider);
      
      // TODO: Implement actual ERC-20 token transfer
      // This would interact with the IDN token contract
      const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      console.log(`Token transfer:`, {
        from: this.treasuryAddress,
        to: recipient,
        amount: amount.toString(),
        token: this.tokenAddress,
        txHash: mockTxHash,
      });

      return mockTxHash;
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw new Error('Failed to transfer tokens');
    }
  }

  /**
   * Get reward history for a user
   */
  async getRewardHistory(userId: string, limit: number = 50): Promise<RewardDistribution[]> {
    try {
      const auditLogs = await AuditLog.findAll({
        where: {
          action: 'REWARD_DISTRIBUTED',
          actor: 'rewards_service',
        },
        include: [{
          model: Submission,
          where: { owner_id: userId },
          attributes: ['id'],
        }],
        order: [['created_at', 'DESC']],
        limit,
      });

      return auditLogs.map(log => log.payload as RewardDistribution);
    } catch (error) {
      console.error('Error fetching reward history:', error);
      return [];
    }
  }

  /**
   * Get total rewards distributed
   */
  async getTotalRewardsDistributed(): Promise<number> {
    try {
      const auditLogs = await AuditLog.findAll({
        where: {
          action: 'REWARD_DISTRIBUTED',
          actor: 'rewards_service',
        },
      });

      return auditLogs.reduce((total, log) => {
        const reward = log.payload as RewardDistribution;
        return total + reward.amount;
      }, 0);
    } catch (error) {
      console.error('Error calculating total rewards:', error);
      return 0;
    }
  }

  /**
   * Get treasury balance
   */
  async getTreasuryBalance(): Promise<number> {
    try {
      if (!this.tokenAddress || !this.treasuryAddress) {
        return 0;
      }

      // TODO: Implement actual token balance check
      // This would query the IDN token contract for treasury balance
      return 1000000 * Math.pow(10, 18); // Mock balance
    } catch (error) {
      console.error('Error fetching treasury balance:', error);
      return 0;
    }
  }

  /**
   * Validate reward eligibility
   */
  async validateRewardEligibility(submission: Submission): Promise<boolean> {
    // Check if submission is in final approved state
    if (submission.status !== 'FINALIZED_APPROVED') {
      return false;
    }

    // Check if reward already distributed
    const existingReward = await AuditLog.findOne({
      where: {
        submission_id: submission.id,
        action: 'REWARD_DISTRIBUTED',
        actor: 'rewards_service',
      },
    });

    if (existingReward) {
      return false;
    }

    // Check treasury balance
    const treasuryBalance = await this.getTreasuryBalance();
    const rewardAmount = this.calculateRewardAmount(submission);
    
    if (treasuryBalance < rewardAmount) {
      return false;
    }

    return true;
  }
}
