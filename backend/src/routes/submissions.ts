import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Submission } from '../models/submission';
import { AuditLog } from '../models/audit-log';
import { SubmissionOrchestrator } from '../services/submission-orchestrator';
import { QueueService } from '../services/queue-service';
import { AIMatcherService, AIScorerService, AICouncilService } from '../services/ai-services';
import { CertificationService } from '../services/certification-service';
import { RewardsService } from '../services/rewards-service';
import { authMiddleware } from '../middleware/auth';
import { createHash } from 'crypto';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document and media types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'audio/mpeg',
      'audio/wav',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  },
});

// Initialize services
const queueService = new QueueService();
const certificationService = new CertificationService();
const rewardsService = new RewardsService();
const orchestrator = new SubmissionOrchestrator(queueService, certificationService, rewardsService);
const aiMatcher = new AIMatcherService();
const aiScorer = new AIScorerService();
const aiCouncil = new AICouncilService();

/**
 * POST /v1/submissions
 * Create a new submission
 */
router.post('/', authMiddleware, upload.array('files', 10), async (req: any, res) => {
  try {
    const { type, metadata } = req.body;
    const userId = req.user.id;

    // Validate submission type
    if (!['invention', 'discovery', 'idea'].includes(type)) {
      return res.status(400).json({
        error: 'Invalid submission type. Must be invention, discovery, or idea'
      });
    }

    // Process uploaded files
    const files = req.files || [];
    const fileData = {
      original: files.map((file: any) => ({
        id: uuidv4(),
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        uploaded_at: new Date().toISOString(),
      })),
      derived: []
    };

    // Calculate content hash
    const contentHash = createHash('sha256')
      .update(JSON.stringify({ type, metadata, files: fileData }))
      .digest('hex');

    // Create submission
    const submission = await Submission.create({
      owner_id: userId,
      type,
      status: 'UPLOADED',
      files: fileData,
      content_hash: contentHash,
    });

    // Log the creation
    await AuditLog.create({
      submission_id: submission.id,
      action: 'SUBMISSION_CREATED',
      payload: { type, file_count: files.length },
      actor: `user:${userId}`,
    });

    // Start the workflow
    await orchestrator.advance(submission.id);

    res.status(201).json({
      id: submission.id,
      status: submission.status,
      type: submission.type,
      created_at: submission.created_at,
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

/**
 * GET /v1/submissions/:id
 * Get submission details
 */
router.get('/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const submission = await Submission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if user owns the submission or is admin
    if (submission.owner_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      id: submission.id,
      type: submission.type,
      status: submission.status,
      quality_score: submission.quality_score,
      duplicate_risk: submission.duplicate_risk,
      ai_feedback: submission.ai_feedback,
      expert_feedback: submission.expert_feedback,
      files: submission.files,
      certificate_id: submission.certificate_id,
      chain_tx: submission.chain_tx,
      reward_amount: submission.reward_amount,
      created_at: submission.created_at,
      updated_at: submission.updated_at,
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

/**
 * GET /v1/submissions/:id/certificate
 * Get submission certificate
 */
router.get('/:id/certificate', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const submission = await Submission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if user owns the submission or is admin
    if (submission.owner_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!submission.certificate_id) {
      return res.status(404).json({ error: 'Certificate not available' });
    }

    // TODO: Fetch certificate from IPFS or storage
    const certificate = {
      certificate_id: submission.certificate_id,
      submission_id: submission.id,
      owner_id: submission.owner_id,
      type: submission.type,
      content_hash: submission.content_hash,
      chain_tx: submission.chain_tx,
      issued_at: submission.updated_at,
      attestation: {
        // Certificate attestation data
        issuer: 'MindVaultIP',
        version: '1.0',
        algorithm: 'SHA256',
      }
    };

    res.json(certificate);
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
});

/**
 * POST /int/ai/match/:id
 * Internal endpoint for AI duplicate check results
 */
router.post('/int/ai/match/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { duplicate_risk, links } = req.body;

    const submission = await Submission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Update submission with duplicate check results
    await Submission.update(
      { 
        duplicate_risk,
        ai_feedback: { 
          ...submission.ai_feedback,
          duplicate_check: { duplicate_risk, links }
        }
      },
      { where: { id } }
    );

    // Log the update
    await AuditLog.create({
      submission_id: id,
      action: 'AI_DUPLICATE_CHECK_RESULT',
      payload: { duplicate_risk, links },
      actor: 'ai_matcher',
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing AI match result:', error);
    res.status(500).json({ error: 'Failed to process AI match result' });
  }
});

/**
 * POST /int/ai/score/:id
 * Internal endpoint for AI scoring results
 */
router.post('/int/ai/score/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quality_score, ai_feedback } = req.body;

    const submission = await Submission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Update submission with scoring results
    await Submission.update(
      { 
        quality_score,
        ai_feedback: { 
          ...submission.ai_feedback,
          patentability_score: ai_feedback
        }
      },
      { where: { id } }
    );

    // Log the update
    await AuditLog.create({
      submission_id: id,
      action: 'AI_SCORING_RESULT',
      payload: { quality_score, ai_feedback },
      actor: 'ai_scorer',
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing AI score result:', error);
    res.status(500).json({ error: 'Failed to process AI score result' });
  }
});

/**
 * POST /int/ai/council/:id
 * Internal endpoint for AI council decision
 */
router.post('/int/ai/council/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { decision } = req.body;

    const submission = await Submission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Log the council decision
    await AuditLog.create({
      submission_id: id,
      action: 'AI_COUNCIL_DECISION',
      payload: { decision },
      actor: 'ai_council',
    });

    // Continue the workflow
    await orchestrator.advance(id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing AI council decision:', error);
    res.status(500).json({ error: 'Failed to process AI council decision' });
  }
});

/**
 * POST /int/expert/decision/:id
 * Internal endpoint for expert decision
 */
router.post('/int/expert/decision/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, expert_feedback, expert_id } = req.body;

    const submission = await Submission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Process expert decision
    await orchestrator.processExpertDecision(id, {
      decision,
      expert_feedback,
      expert_id,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing expert decision:', error);
    res.status(500).json({ error: 'Failed to process expert decision' });
  }
});

/**
 * POST /int/certify/:id
 * Internal endpoint for certification
 */
router.post('/int/certify/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Generate certificate
    const certificate = await certificationService.generateCertificate(submission);
    
    // Update submission with certificate info
    await Submission.update(
      { 
        certificate_id: certificate.certificate_id,
        chain_tx: certificate.chain_tx
      },
      { where: { id } }
    );

    // Log the certification
    await AuditLog.create({
      submission_id: id,
      action: 'CERTIFICATE_GENERATED',
      payload: certificate,
      actor: 'certification_service',
    });

    res.json(certificate);
  } catch (error) {
    console.error('Error processing certification:', error);
    res.status(500).json({ error: 'Failed to process certification' });
  }
});

/**
 * POST /int/reward/:id
 * Internal endpoint for rewards
 */
router.post('/int/reward/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Calculate and distribute rewards
    const reward = await rewardsService.distributeReward(submission);
    
    // Update submission with reward info
    await Submission.update(
      { reward_amount: reward.amount },
      { where: { id } }
    );

    // Log the reward
    await AuditLog.create({
      submission_id: id,
      action: 'REWARD_DISTRIBUTED',
      payload: reward,
      actor: 'rewards_service',
    });

    res.json(reward);
  } catch (error) {
    console.error('Error processing reward:', error);
    res.status(500).json({ error: 'Failed to process reward' });
  }
});

export default router;
