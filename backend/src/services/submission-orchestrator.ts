import { Submission } from '../models/submission';
import { AuditLog } from '../models/audit-log';
import { QueueService } from '../services/queue-service';
import { CertificationService } from '../services/certification-service';
import { RewardsService } from '../services/rewards-service';

export type SubmissionStatus = 
  | 'UPLOADED' 
  | 'AI_DUPLICATE_CHECK' 
  | 'AI_PATENTABILITY_REVIEW' 
  | 'AI_COUNCIL_DELIBERATION'
  | 'PENDING_EXPERT_REVIEW' 
  | 'EXPERT_APPROVED' 
  | 'EXPERT_REJECTED'
  | 'FINALIZED_APPROVED' 
  | 'FINALIZED_REJECTED' 
  | 'REWARDED';

export type SubmissionType = 'invention' | 'discovery' | 'idea';

export interface CouncilDecision {
  decision: 'APPROVE' | 'REJECT' | 'NEEDS_EXPERT';
  confidence: number;
  reasons: string[];
}

export interface ExpertDecision {
  decision: 'APPROVE' | 'REJECT';
  expert_feedback: any;
  expert_id: string;
}

export class SubmissionOrchestrator {
  private queueService: QueueService;
  private certificationService: CertificationService;
  private rewardsService: RewardsService;

  constructor(
    queueService: QueueService,
    certificationService: CertificationService,
    rewardsService: RewardsService
  ) {
    this.queueService = queueService;
    this.certificationService = certificationService;
    this.rewardsService = rewardsService;
  }

  /**
   * Advance submission to next state based on current status
   */
  async advance(submissionId: string): Promise<void> {
    const submission = await Submission.findByPk(submissionId);
    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    await this.logAction(submissionId, 'ADVANCE_ATTEMPT', { 
      current_status: submission.status 
    }, 'system');

    try {
      switch (submission.status) {
        case 'UPLOADED':
          await this.handleUploaded(submission);
          break;
        case 'AI_DUPLICATE_CHECK':
          await this.handleDuplicateCheck(submission);
          break;
        case 'AI_PATENTABILITY_REVIEW':
          await this.handlePatentabilityReview(submission);
          break;
        case 'AI_COUNCIL_DELIBERATION':
          await this.handleCouncilDeliberation(submission);
          break;
        case 'PENDING_EXPERT_REVIEW':
          await this.handleExpertReview(submission);
          break;
        case 'EXPERT_APPROVED':
        case 'EXPERT_REJECTED':
          await this.handleExpertDecision(submission);
          break;
        case 'FINALIZED_APPROVED':
          await this.handleFinalizedApproved(submission);
          break;
        case 'FINALIZED_REJECTED':
          await this.handleFinalizedRejected(submission);
          break;
        case 'REWARDED':
          // Terminal state - no further action needed
          break;
        default:
          throw new Error(`Unknown status: ${submission.status}`);
      }
    } catch (error) {
      await this.logAction(submissionId, 'ADVANCE_ERROR', { 
        error: error.message,
        status: submission.status 
      }, 'system');
      throw error;
    }
  }

  /**
   * Handle UPLOADED status - start AI duplicate check
   */
  private async handleUploaded(submission: Submission): Promise<void> {
    await this.updateStatus(submission.id, 'AI_DUPLICATE_CHECK');
    await this.queueService.enqueue('ai_duplicate_check', submission.id);
    
    await this.logAction(submission.id, 'STATUS_CHANGE', {
      from: 'UPLOADED',
      to: 'AI_DUPLICATE_CHECK'
    }, 'system');
  }

  /**
   * Handle AI_DUPLICATE_CHECK status - start patentability review
   */
  private async handleDuplicateCheck(submission: Submission): Promise<void> {
    await this.updateStatus(submission.id, 'AI_PATENTABILITY_REVIEW');
    await this.queueService.enqueue('ai_patentability_review', submission.id);
    
    await this.logAction(submission.id, 'STATUS_CHANGE', {
      from: 'AI_DUPLICATE_CHECK',
      to: 'AI_PATENTABILITY_REVIEW'
    }, 'system');
  }

  /**
   * Handle AI_PATENTABILITY_REVIEW status - start council deliberation
   */
  private async handlePatentabilityReview(submission: Submission): Promise<void> {
    await this.updateStatus(submission.id, 'AI_COUNCIL_DELIBERATION');
    await this.queueService.enqueue('ai_council', submission.id);
    
    await this.logAction(submission.id, 'STATUS_CHANGE', {
      from: 'AI_PATENTABILITY_REVIEW',
      to: 'AI_COUNCIL_DELIBERATION'
    }, 'system');
  }

  /**
   * Handle AI_COUNCIL_DELIBERATION status - make decision
   */
  private async handleCouncilDeliberation(submission: Submission): Promise<void> {
    // This would typically be called by the AI Council service
    // For now, we'll implement the decision logic here
    const decision = await this.makeCouncilDecision(submission);
    
    await this.logAction(submission.id, 'COUNCIL_DECISION', decision, 'ai_council');

    if (decision.decision === 'REJECT') {
      await this.finalizeReject(submission.id, decision.reasons);
    } else if (decision.decision === 'APPROVE' && submission.type !== 'invention') {
      await this.finalizeApprove(submission.id, decision.reasons);
    } else if (decision.decision === 'APPROVE' && submission.type === 'invention') {
      await this.updateStatus(submission.id, 'PENDING_EXPERT_REVIEW');
      await this.queueService.enqueue('expert_dispatch', submission.id);
      
      await this.logAction(submission.id, 'STATUS_CHANGE', {
        from: 'AI_COUNCIL_DELIBERATION',
        to: 'PENDING_EXPERT_REVIEW',
        reason: 'invention_requires_expert_review'
      }, 'system');
    } else if (decision.decision === 'NEEDS_EXPERT') {
      await this.updateStatus(submission.id, 'PENDING_EXPERT_REVIEW');
      await this.queueService.enqueue('expert_dispatch', submission.id);
      
      await this.logAction(submission.id, 'STATUS_CHANGE', {
        from: 'AI_COUNCIL_DELIBERATION',
        to: 'PENDING_EXPERT_REVIEW',
        reason: 'council_recommended_expert_review'
      }, 'system');
    }
  }

  /**
   * Handle PENDING_EXPERT_REVIEW status - wait for expert decision
   */
  private async handleExpertReview(submission: Submission): Promise<void> {
    // This is a waiting state - experts will call the expert decision endpoint
    // No automatic advancement here
  }

  /**
   * Handle expert decision (EXPERT_APPROVED or EXPERT_REJECTED)
   */
  private async handleExpertDecision(submission: Submission): Promise<void> {
    if (submission.status === 'EXPERT_APPROVED') {
      await this.finalizeApprove(submission.id, ['expert_approved']);
    } else if (submission.status === 'EXPERT_REJECTED') {
      await this.finalizeReject(submission.id, ['expert_rejected']);
    }
  }

  /**
   * Handle FINALIZED_APPROVED status - start certification and rewards
   */
  private async handleFinalizedApproved(submission: Submission): Promise<void> {
    await this.updateStatus(submission.id, 'REWARDED');
    
    // Start certification process
    await this.queueService.enqueue('certify', submission.id);
    
    // Start rewards process
    await this.queueService.enqueue('reward', submission.id);
    
    await this.logAction(submission.id, 'STATUS_CHANGE', {
      from: 'FINALIZED_APPROVED',
      to: 'REWARDED'
    }, 'system');
  }

  /**
   * Handle FINALIZED_REJECTED status - terminal state
   */
  private async handleFinalizedRejected(submission: Submission): Promise<void> {
    // Terminal state - no further action needed
    await this.logAction(submission.id, 'FINALIZED_REJECTED', {
      status: 'terminal'
    }, 'system');
  }

  /**
   * Make council decision based on submission data
   */
  private async makeCouncilDecision(submission: Submission): Promise<CouncilDecision> {
    const duplicateRisk = submission.duplicate_risk || 0;
    const qualityScore = submission.quality_score || 0;

    // Decision rules as specified
    if (duplicateRisk > 0.75) {
      return {
        decision: 'REJECT',
        confidence: 0.9,
        reasons: [`High duplicate risk: ${duplicateRisk}`]
      };
    }

    if (qualityScore < 60) {
      return {
        decision: 'REJECT',
        confidence: 0.8,
        reasons: [`Low quality score: ${qualityScore}`]
      };
    }

    if (duplicateRisk >= 0.4 && duplicateRisk <= 0.75) {
      return {
        decision: 'NEEDS_EXPERT',
        confidence: 0.7,
        reasons: [`Moderate duplicate risk: ${duplicateRisk}`]
      };
    }

    if (qualityScore >= 60 && qualityScore <= 79 && submission.type === 'invention') {
      return {
        decision: 'NEEDS_EXPERT',
        confidence: 0.6,
        reasons: [`Moderate quality score for invention: ${qualityScore}`]
      };
    }

    if (qualityScore >= 80) {
      return {
        decision: 'APPROVE',
        confidence: 0.9,
        reasons: [`High quality score: ${qualityScore}`]
      };
    }

    // Default to expert review for edge cases
    return {
      decision: 'NEEDS_EXPERT',
      confidence: 0.5,
      reasons: ['Edge case requiring expert review']
    };
  }

  /**
   * Finalize approval
   */
  private async finalizeApprove(submissionId: string, reasons: string[]): Promise<void> {
    await this.updateStatus(submissionId, 'FINALIZED_APPROVED');
    
    await this.logAction(submissionId, 'FINALIZE_APPROVE', {
      reasons,
      status: 'FINALIZED_APPROVED'
    }, 'system');
  }

  /**
   * Finalize rejection
   */
  private async finalizeReject(submissionId: string, reasons: string[]): Promise<void> {
    await this.updateStatus(submissionId, 'FINALIZED_REJECTED');
    
    await this.logAction(submissionId, 'FINALIZE_REJECT', {
      reasons,
      status: 'FINALIZED_REJECTED'
    }, 'system');
  }

  /**
   * Update submission status
   */
  private async updateStatus(submissionId: string, status: SubmissionStatus): Promise<void> {
    await Submission.update(
      { status },
      { where: { id: submissionId } }
    );
  }

  /**
   * Log action to audit log
   */
  private async logAction(
    submissionId: string, 
    action: string, 
    payload: any, 
    actor: string
  ): Promise<void> {
    await AuditLog.create({
      submission_id: submissionId,
      action,
      payload,
      actor,
    });
  }

  /**
   * Process expert decision
   */
  async processExpertDecision(submissionId: string, decision: ExpertDecision): Promise<void> {
    const submission = await Submission.findByPk(submissionId);
    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    if (submission.status !== 'PENDING_EXPERT_REVIEW') {
      throw new Error(`Submission ${submissionId} is not in expert review status`);
    }

    const newStatus = decision.decision === 'APPROVE' ? 'EXPERT_APPROVED' : 'EXPERT_REJECTED';
    
    await Submission.update(
      { 
        status: newStatus,
        expert_feedback: decision.expert_feedback
      },
      { where: { id: submissionId } }
    );

    await this.logAction(submissionId, 'EXPERT_DECISION', {
      decision: decision.decision,
      expert_id: decision.expert_id,
      expert_feedback: decision.expert_feedback
    }, `expert:${decision.expert_id}`);

    // Continue the workflow
    await this.advance(submissionId);
  }
}
