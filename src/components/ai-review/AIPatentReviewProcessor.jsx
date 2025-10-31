import React, { useEffect } from 'react';
import { Proof } from '@/services/entities';
import { InvokeLLM } from '@/services/integrations';

const AI_REVIEW_THRESHOLD = 70; // Minimum score needed to pass

export default function AIPatentReviewProcessor({ proofs, onUpdate }) {
  useEffect(() => {
    const runAIPatentReviews = async () => {
      const pendingProofs = proofs.filter(p => p.validation_status === 'pending_ai_review');
      if (pendingProofs.length === 0) return;

      for (const proof of pendingProofs) {
        try {
          console.log(`Starting AI Patent Review for: ${proof.title}`);
          
          const reviewPrompt = `
            You are an expert AI patent examiner. Evaluate this invention submission across 5 key criteria and provide detailed scores and feedback.

            INVENTION DETAILS:
            Title: "${proof.title}"
            Category: "${proof.category}"
            Description: "${proof.description || 'No description provided'}"
            File Type: "${proof.file_type}"

            EVALUATION CRITERIA (Score each 0-100):

            1. NOVELTY CHECK (Uniqueness):
            - Is this idea truly new and not obvious from existing knowledge?
            - Would this likely pass a patent database search?

            2. INVENTIVE STEP (Creativity & Non-Obviousness):
            - Does this go beyond trivial combinations of known elements?
            - Does it show genuine technical advancement?

            3. UTILITY (Industrial Application):
            - Does this have clear, practical real-world applications?
            - Can this be used in industry, science, or society?

            4. CLARITY & DOCUMENTATION:
            - Is the invention described clearly and completely?
            - Are the technical details sufficient for implementation?

            5. NON-CONFLICT (Ethical & Legal):
            - Does this comply with ethical standards?
            - No weapons, illegal activities, or harmful applications?

            Provide your response as a JSON object with this exact structure:
            {
              "novelty_score": [0-100],
              "inventive_score": [0-100], 
              "utility_score": [0-100],
              "clarity_score": [0-100],
              "non_conflict_score": [0-100],
              "final_score": [average of all scores],
              "pass_threshold": [true/false - final_score >= 70],
              "summary": "Brief 2-3 sentence summary of the evaluation",
              "detailed_feedback": "Detailed feedback with specific improvement suggestions if rejected",
              "patent_potential": "Assessment of patent potential (High/Medium/Low)"
            }
          `;

          const aiResponse = await InvokeLLM({
            prompt: reviewPrompt,
            response_json_schema: {
              type: "object",
              properties: {
                novelty_score: { type: "number" },
                inventive_score: { type: "number" },
                utility_score: { type: "number" },
                clarity_score: { type: "number" },
                non_conflict_score: { type: "number" },
                final_score: { type: "number" },
                pass_threshold: { type: "boolean" },
                summary: { type: "string" },
                detailed_feedback: { type: "string" },
                patent_potential: { type: "string" }
              }
            }
          });

          // Update proof with AI review results
          const updatedProof = {
            ...proof,
            validation_status: aiResponse.pass_threshold ? 'ai_approved' : 'ai_rejected',
            ai_review_result: aiResponse,
            ai_review_summary: aiResponse.summary,
            ai_novelty_score: Math.round(aiResponse.novelty_score || 0),
            ai_inventive_score: Math.round(aiResponse.inventive_score || 0),
            ai_utility_score: Math.round(aiResponse.utility_score || 0),
            ai_clarity_score: Math.round(aiResponse.clarity_score || 0),
            ai_final_score: Math.round(aiResponse.final_score || 0),
            ai_feedback: aiResponse.detailed_feedback
          };

          await Proof.update(proof.id, updatedProof);
          onUpdate(updatedProof);

          console.log(`AI Patent Review completed for ${proof.title}: ${aiResponse.pass_threshold ? 'APPROVED' : 'REJECTED'} (Score: ${aiResponse.final_score})`);
          
        } catch (error) {
          console.error(`AI Patent Review failed for proof ${proof.id}:`, error);
          
          // Mark as failed review
          const failedProof = {
            ...proof,
            validation_status: 'ai_rejected',
            ai_review_summary: 'AI review failed due to technical error',
            ai_feedback: 'Technical error occurred during AI review. Please resubmit your invention.'
          };
          
          try {
            await Proof.update(proof.id, failedProof);
            onUpdate(failedProof);
          } catch (updateError) {
            console.error(`Failed to update proof ${proof.id} after AI review error:`, updateError);
          }
        }
        
        // Add delay between reviews to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    };

    runAIPatentReviews();
  }, [proofs, onUpdate]);

  return null; // This component doesn't render anything
}