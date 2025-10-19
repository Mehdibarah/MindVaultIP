import { Submission } from '../models/submission';
import { AuditLog } from '../models/audit-log';
import OpenAI from 'openai';
import { createHash } from 'crypto';

export interface DuplicateCheckResult {
  duplicate_risk: number;
  similar_submissions: Array<{
    id: string;
    similarity_score: number;
    reason: string;
  }>;
  links: string[];
}

export interface PatentabilityScore {
  quality_score: number;
  novelty_score: number;
  inventive_step_score: number;
  utility_score: number;
  clarity_score: number;
  overall_feedback: string;
  recommendations: string[];
}

export class AIMatcherService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Check for duplicates using vector similarity and AI analysis
   */
  async checkDuplicates(submissionId: string): Promise<DuplicateCheckResult> {
    const submission = await Submission.findByPk(submissionId);
    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    // Extract text content from files
    const content = await this.extractContent(submission.files);
    
    // Generate embedding for the content
    const embedding = await this.generateEmbedding(content);
    
    // Search for similar submissions using vector similarity
    const similarSubmissions = await this.findSimilarSubmissions(embedding, submissionId);
    
    // Use AI to analyze potential duplicates
    const aiAnalysis = await this.analyzeDuplicates(content, similarSubmissions);
    
    const result: DuplicateCheckResult = {
      duplicate_risk: aiAnalysis.duplicate_risk,
      similar_submissions: similarSubmissions.map(sim => ({
        id: sim.id,
        similarity_score: sim.similarity_score,
        reason: sim.reason
      })),
      links: aiAnalysis.links
    };

    // Update submission with results
    await Submission.update(
      { 
        duplicate_risk: result.duplicate_risk,
        ai_feedback: { duplicate_check: result }
      },
      { where: { id: submissionId } }
    );

    await this.logAction(submissionId, 'AI_DUPLICATE_CHECK', result, 'ai_matcher');

    return result;
  }

  /**
   * Extract text content from submission files
   */
  private async extractContent(files: any): Promise<string> {
    // TODO: Implement file content extraction
    // This would use Tika, OCR, etc. to extract text from various file types
    return "Sample extracted content for AI analysis";
  }

  /**
   * Generate embedding for content using OpenAI
   */
  private async generateEmbedding(content: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: content,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Find similar submissions using vector similarity
   */
  private async findSimilarSubmissions(embedding: number[], excludeId: string): Promise<any[]> {
    // TODO: Implement vector similarity search using pgvector
    // This would query the submission_vectors table
    return [];
  }

  /**
   * Analyze duplicates using AI
   */
  private async analyzeDuplicates(content: string, similarSubmissions: any[]): Promise<any> {
    const prompt = `
    Analyze the following content for potential duplicates in a patent/invention database:
    
    Content: ${content}
    
    Similar submissions found: ${JSON.stringify(similarSubmissions)}
    
    Please provide:
    1. A duplicate risk score (0-1, where 1 is definitely a duplicate)
    2. Links to any external prior art or patents that might be relevant
    3. Reasoning for your assessment
    
    Respond in JSON format:
    {
      "duplicate_risk": 0.3,
      "links": ["https://patent1.com", "https://patent2.com"],
      "reasoning": "Brief explanation of the assessment"
    }
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      console.error('Error in AI duplicate analysis:', error);
      return {
        duplicate_risk: 0.5,
        links: [],
        reasoning: "AI analysis failed, using default risk score"
      };
    }
  }

  /**
   * Log action to audit log
   */
  private async logAction(submissionId: string, action: string, payload: any, actor: string): Promise<void> {
    await AuditLog.create({
      submission_id: submissionId,
      action,
      payload,
      actor,
    });
  }
}

export class AIScorerService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Score patentability using AI ensemble
   */
  async scorePatentability(submissionId: string): Promise<PatentabilityScore> {
    const submission = await Submission.findByPk(submissionId);
    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    const content = await this.extractContent(submission.files);
    const scores = await this.calculateScores(content, submission.type);
    
    // Update submission with results
    await Submission.update(
      { 
        quality_score: scores.quality_score,
        ai_feedback: { 
          ...submission.ai_feedback,
          patentability_score: scores 
        }
      },
      { where: { id: submissionId } }
    );

    await this.logAction(submissionId, 'AI_PATENTABILITY_SCORE', scores, 'ai_scorer');

    return scores;
  }

  /**
   * Calculate patentability scores using AI
   */
  private async calculateScores(content: string, type: string): Promise<PatentabilityScore> {
    const prompt = `
    Evaluate the patentability of the following ${type}:
    
    Content: ${content}
    
    Please score each criterion (0-100):
    1. Novelty: Is this new and not previously disclosed?
    2. Inventive Step: Does it involve an inventive step beyond what's obvious?
    3. Utility: Does it have practical utility or industrial applicability?
    4. Clarity: Is the description clear and enabling?
    
    Also provide:
    - Overall quality score (0-100)
    - Detailed feedback explaining the scores
    - Recommendations for improvement
    
    Respond in JSON format:
    {
      "novelty_score": 85,
      "inventive_step_score": 70,
      "utility_score": 90,
      "clarity_score": 75,
      "quality_score": 80,
      "overall_feedback": "Detailed feedback...",
      "recommendations": ["Recommendation 1", "Recommendation 2"]
    }
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      console.error('Error in AI scoring:', error);
      return {
        novelty_score: 50,
        inventive_step_score: 50,
        utility_score: 50,
        clarity_score: 50,
        quality_score: 50,
        overall_feedback: "AI scoring failed, using default scores",
        recommendations: ["Manual review recommended"]
      };
    }
  }

  /**
   * Extract content from submission files
   */
  private async extractContent(files: any): Promise<string> {
    // TODO: Implement file content extraction
    return "Sample extracted content for AI scoring";
  }

  /**
   * Log action to audit log
   */
  private async logAction(submissionId: string, action: string, payload: any, actor: string): Promise<void> {
    await AuditLog.create({
      submission_id: submissionId,
      action,
      payload,
      actor,
    });
  }
}

export class AICouncilService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Make council decision using rule-based + LLM ensemble
   */
  async makeCouncilDecision(submissionId: string): Promise<any> {
    const submission = await Submission.findByPk(submissionId);
    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    const decision = await this.deliberate(submission);
    
    await this.logAction(submissionId, 'AI_COUNCIL_DECISION', decision, 'ai_council');

    return decision;
  }

  /**
   * Council deliberation process
   */
  private async deliberate(submission: Submission): Promise<any> {
    const duplicateRisk = submission.duplicate_risk || 0;
    const qualityScore = submission.quality_score || 0;
    const aiFeedback = submission.ai_feedback || {};

    // Rule-based decision logic
    let decision = 'NEEDS_EXPERT';
    let confidence = 0.5;
    let reasons: string[] = [];

    if (duplicateRisk > 0.75) {
      decision = 'REJECT';
      confidence = 0.9;
      reasons.push(`High duplicate risk: ${duplicateRisk}`);
    } else if (qualityScore < 60) {
      decision = 'REJECT';
      confidence = 0.8;
      reasons.push(`Low quality score: ${qualityScore}`);
    } else if (qualityScore >= 80 && duplicateRisk < 0.4) {
      decision = 'APPROVE';
      confidence = 0.9;
      reasons.push(`High quality score: ${qualityScore} and low duplicate risk: ${duplicateRisk}`);
    } else if (duplicateRisk >= 0.4 && duplicateRisk <= 0.75) {
      decision = 'NEEDS_EXPERT';
      confidence = 0.7;
      reasons.push(`Moderate duplicate risk: ${duplicateRisk}`);
    } else if (qualityScore >= 60 && qualityScore <= 79 && submission.type === 'invention') {
      decision = 'NEEDS_EXPERT';
      confidence = 0.6;
      reasons.push(`Moderate quality score for invention: ${qualityScore}`);
    }

    // Use AI to validate and refine the decision
    const aiValidation = await this.validateDecision(submission, decision, reasons);
    
    return {
      decision: aiValidation.decision || decision,
      confidence: aiValidation.confidence || confidence,
      reasons: aiValidation.reasons || reasons,
      ai_validation: aiValidation
    };
  }

  /**
   * Validate decision using AI
   */
  private async validateDecision(submission: Submission, decision: string, reasons: string[]): Promise<any> {
    const prompt = `
    Validate the following council decision for a ${submission.type} submission:
    
    Submission Type: ${submission.type}
    Quality Score: ${submission.quality_score}
    Duplicate Risk: ${submission.duplicate_risk}
    Proposed Decision: ${decision}
    Reasons: ${reasons.join(', ')}
    
    Please validate this decision and provide:
    1. Confirmed decision (APPROVE/REJECT/NEEDS_EXPERT)
    2. Confidence level (0-1)
    3. Refined reasons
    4. Additional considerations
    
    Respond in JSON format:
    {
      "decision": "APPROVE",
      "confidence": 0.85,
      "reasons": ["Refined reason 1", "Refined reason 2"],
      "additional_considerations": "Additional insights..."
    }
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      console.error('Error in AI council validation:', error);
      return {
        decision,
        confidence: 0.5,
        reasons,
        additional_considerations: "AI validation failed, using rule-based decision"
      };
    }
  }

  /**
   * Log action to audit log
   */
  private async logAction(submissionId: string, action: string, payload: any, actor: string): Promise<void> {
    await AuditLog.create({
      submission_id: submissionId,
      action,
      payload,
      actor,
    });
  }
}
