
import React, { useEffect } from 'react';
import { Proof } from '@/api/entities';
import { User } from '@/api/entities';
import { PlatformTreasury } from '@/api/entities';
import { RewardTransaction } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';

// The base JSON schema for the AI response
const responseSchema = {
  type: "object",
  properties: {
    decision: { type: "string", enum: ["APPROVED", "REJECTED", "NEEDS_MORE_EVIDENCE"] },
    summary: { type: "string" },
    scores: {
      type: "object",
      properties: {
        novelty: { type: "number" },
        inventive_step: { type: "number" },
        collision_risk: { type: "number" },
        commercial_potential: { type: "number" },
      }
    },
    key_findings: { type: "array", items: { type: "string" } }
  }
};

export default function EnhancedAIReviewProcessor({ proofs, onUpdate }) {
  useEffect(() => {
    const runMultiAgentReview = async () => {
      const pendingProofs = proofs.filter(p => p.validation_status === 'pending_ai_review');
      if (pendingProofs.length === 0) return;

      for (const proof of pendingProofs) {
        try {
          console.log(`🤖 Council Review starting for: ${proof.title}`);

          const basePromptInfo = `
            SUBMISSION DETAILS:
            Title: "${proof.title}"
            Category: "${proof.category}"
            Description: "${proof.description || 'No description provided'}"
            File Type: "${proof.file_type}"
            Return a JSON object matching the provided schema.
          `;

          // 1. The Examiner (Methodical & By-the-book)
          const examinerPrompt = `
            You are Mindvault-AI v2.0, a patent examiner. Analyze the submission against global patent databases (USPTO, WIPO), scientific literature (ArXiv), and commercial products. Focus on novelty, inventive step, and industrial applicability.
            ${basePromptInfo}
          `;
          
          // 2. The Critic (Pessimistic & Flaw-finder)
          const criticPrompt = `
            You are Athena, a critical AI analyst for Mindvault. Your goal is to find every reason this invention might fail. Aggressively search for prior art, identify potential infringement risks, and highlight any unclear or weak claims in the submission. Find the biggest risks.
            ${basePromptInfo}
          `;

          // 3. The Visionary (Optimistic & Market-focused)
          const visionaryPrompt = `
            You are Helios, a visionary AI strategist for Mindvault. Your goal is to identify the commercial potential of this invention. Brainstorm novel applications, analyze market gaps it could fill, and estimate its disruptive potential, even if the technology is nascent. Find the biggest opportunities.
            ${basePromptInfo}
          `;

          // Run all three AI agents concurrently
          const [examinerResult, criticResult, visionaryResult] = await Promise.all([
            InvokeLLM({ prompt: examinerPrompt, add_context_from_internet: true, response_json_schema: responseSchema }),
            InvokeLLM({ prompt: criticPrompt, add_context_from_internet: true, response_json_schema: responseSchema }),
            InvokeLLM({ prompt: visionaryPrompt, add_context_from_internet: true, response_json_schema: responseSchema })
          ]);

          const councilReviews = {
            examiner: examinerResult,
            critic: criticResult,
            visionary: visionaryResult,
          };
          
          // --- CONSENSUS MODULE ---
          const decisions = [examinerResult.decision, criticResult.decision, visionaryResult.decision];
          let finalDecision;

          const approvalCount = decisions.filter(d => d === 'APPROVED').length;
          const rejectionCount = decisions.filter(d => d === 'REJECTED').length;

          if (approvalCount >= 2) {
            finalDecision = 'APPROVED';
          } else if (rejectionCount >= 2) {
            finalDecision = 'REJECTED';
          } else {
            finalDecision = 'NEEDS_MORE_EVIDENCE'; // No clear majority, requires more info
          }

          // Weighted score calculation (Examiner: 50%, Critic: 30%, Visionary: 20%)
          const examinerScore = (examinerResult.scores.novelty * 0.5 + examinerResult.scores.inventive_step * 0.5) * 100;
          const criticScore = (1 - criticResult.scores.collision_risk) * 100; // Inverse of risk
          const visionaryScore = visionaryResult.scores.commercial_potential * 100;
          
          const finalWeightedScore = Math.round(
            (examinerScore * 0.5) + (criticScore * 0.3) + (visionaryScore * 0.2)
          );

          // Map final decision to validation status
          let validationStatus = 'needs_more_evidence';
          if(finalDecision === 'APPROVED') validationStatus = 'ai_approved';
          if(finalDecision === 'REJECTED') validationStatus = 'ai_rejected';

          // --- ENHANCED REWARD LOGIC ---
          if (validationStatus === 'ai_approved') {
            try {
              // Get platform treasury
              const treasuries = await PlatformTreasury.list();
              let treasury = treasuries.length > 0 ? treasuries[0] : null;
              
              if (!treasury) {
                // Create initial treasury with ZERO balance - admins must fund it manually
                treasury = await PlatformTreasury.create({
                  wallet_address: "0xPlatformTreasuryWallet123",
                  exo_token_balance: 0, // Start with zero balance
                  treasury_status: "empty", // Mark as empty initially
                  reward_per_approved_proof: 1, // Default reward amount
                  minimum_balance_threshold: 100 // Default threshold
                });
                console.log("💰 Initial Platform Treasury created with 0 balance. Admins need to fund it.");
              }

              const REWARD_AMOUNT = treasury.reward_per_approved_proof || 1;
              
              // Check if treasury has sufficient balance
              if (treasury.exo_token_balance < REWARD_AMOUNT) {
                console.warn(`⚠️ Treasury balance too low for reward. Balance: ${treasury.exo_token_balance}, Required: ${REWARD_AMOUNT}`);
                await PlatformTreasury.update(treasury.id, { 
                  treasury_status: treasury.exo_token_balance === 0 ? "empty" : "low_balance" 
                });
                // Continue proof processing but skip reward
              } else {
                // Find proof owner
                const proofOwnerResult = await User.filter({ email: proof.created_by }, '', 1);
                if (proofOwnerResult && proofOwnerResult.length > 0) {
                  const proofOwner = proofOwnerResult[0];
                  
                  // Update user balance
                  const newUserBalance = (proofOwner.exo_token_balance || 0) + REWARD_AMOUNT;
                  await User.update(proofOwner.id, { exo_token_balance: newUserBalance });
                  
                  // Update treasury balance
                  const newTreasuryBalance = treasury.exo_token_balance - REWARD_AMOUNT;
                  const newTotalDistributed = (treasury.total_rewards_distributed || 0) + REWARD_AMOUNT;
                  
                  await PlatformTreasury.update(treasury.id, { 
                    exo_token_balance: newTreasuryBalance,
                    total_rewards_distributed: newTotalDistributed,
                    treasury_status: newTreasuryBalance < (treasury.minimum_balance_threshold || 100) ? "low_balance" : "active"
                  });
                  
                  // Record reward transaction
                  await RewardTransaction.create({
                    proof_id: proof.id,
                    recipient_wallet: proofOwner.wallet_address || proof.owner_wallet_address || "N/A", // Ensure a fallback
                    recipient_user_id: proofOwner.id,
                    reward_amount: REWARD_AMOUNT,
                    reward_reason: "proof_approved",
                    platform_balance_before: treasury.exo_token_balance,
                    platform_balance_after: newTreasuryBalance,
                    blockchain_tx_hash: `0x${Math.random().toString(16).substr(2, 64)}` // Placeholder for actual tx hash
                  });
                  
                  console.log(`🎉 Rewarded ${REWARD_AMOUNT} EXO to ${proofOwner.email} for approved proof ${proof.id}`);
                  console.log(`💰 Treasury balance: ${treasury.exo_token_balance} → ${newTreasuryBalance} EXO`);
                  
                } else {
                  console.warn(`User not found for proof ${proof.id} (created_by: ${proof.created_by}). Cannot issue EXO reward.`);
                }
              }
            } catch (rewardError) {
              console.error(`Could not issue EXO reward for proof ${proof.id}:`, rewardError);
            }
          }
          // --- END ENHANCED REWARD LOGIC ---

          const updatedProof = {
            ...proof,
            validation_status: validationStatus,
            ai_council_reviews: councilReviews,
            final_consensus_decision: finalDecision,
            final_weighted_score: finalWeightedScore,
            ai_final_score: finalWeightedScore,
            ai_feedback: `
              **Examiner Summary:** ${examinerResult.summary}\n
              **Critic's Concerns:** ${criticResult.summary}\n
              **Visionary's Outlook:** ${visionaryResult.summary}
            `
          };

          await Proof.update(proof.id, updatedProof);
          onUpdate(updatedProof);
          console.log(`✅ Council Review completed for ${proof.title}: ${finalDecision} (Score: ${finalWeightedScore})`);

        } catch (error) {
          console.error(`❌ Multi-Agent Review failed for proof ${proof.id}:`, error);
          // Handle failure by updating proof status to indicate failure or re-queueing
          // For now, just log and continue to next proof
          await Proof.update(proof.id, { validation_status: 'ai_review_failed' });
          onUpdate({ ...proof, validation_status: 'ai_review_failed' });
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // Delay to prevent API rate limiting
      }
    };

    runMultiAgentReview();
  }, [proofs, onUpdate]);

  return null;
}
