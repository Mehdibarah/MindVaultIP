import Queue from 'bull';
import Redis from 'ioredis';
import { config } from 'dotenv';

config();

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
};

const redis = new Redis(redisConfig);

// Queue configurations
const queueConfig = {
  redis: redisConfig,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
};

// Define all queues
export const queues = {
  uploadPipeline: new Queue('upload_pipeline', queueConfig),
  aiDuplicateCheck: new Queue('ai_duplicate_check', queueConfig),
  aiPatentabilityReview: new Queue('ai_patentability_review', queueConfig),
  aiCouncil: new Queue('ai_council', queueConfig),
  expertDispatch: new Queue('expert_dispatch', queueConfig),
  finalize: new Queue('finalize', queueConfig),
  certify: new Queue('certify', queueConfig),
  reward: new Queue('reward', queueConfig),
};

export class QueueService {
  /**
   * Enqueue a job to the specified queue
   */
  async enqueue(queueName: keyof typeof queues, data: any, options?: any): Promise<void> {
    const queue = queues[queueName];
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.add(data, options);
  }

  /**
   * Enqueue a job with delay
   */
  async enqueueDelayed(queueName: keyof typeof queues, data: any, delay: number): Promise<void> {
    const queue = queues[queueName];
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.add(data, { delay });
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(queueName: keyof typeof queues): Promise<any> {
    const queue = queues[queueName];
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const waiting = await queue.getWaiting();
    const active = await queue.getActive();
    const completed = await queue.getCompleted();
    const failed = await queue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }

  /**
   * Clean completed and failed jobs
   */
  async cleanQueue(queueName: keyof typeof queues, grace: number = 0): Promise<void> {
    const queue = queues[queueName];
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.clean(grace, 'completed');
    await queue.clean(grace, 'failed');
  }

  /**
   * Pause a queue
   */
  async pauseQueue(queueName: keyof typeof queues): Promise<void> {
    const queue = queues[queueName];
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.pause();
  }

  /**
   * Resume a queue
   */
  async resumeQueue(queueName: keyof typeof queues): Promise<void> {
    const queue = queues[queueName];
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.resume();
  }

  /**
   * Close all queues
   */
  async closeAll(): Promise<void> {
    await Promise.all(
      Object.values(queues).map(queue => queue.close())
    );
  }
}

// Job processors
export class JobProcessors {
  private queueService: QueueService;

  constructor(queueService: QueueService) {
    this.queueService = queueService;
  }

  /**
   * Setup all job processors
   */
  setupProcessors(): void {
    // Upload pipeline processor
    queues.uploadPipeline.process('extract', 5, async (job) => {
      const { submissionId } = job.data;
      console.log(`Processing upload pipeline for submission ${submissionId}`);
      
      // TODO: Implement file extraction, OCR, indexing
      // For now, just enqueue the next step
      await this.queueService.enqueue('aiDuplicateCheck', { submissionId });
    });

    // AI Duplicate Check processor
    queues.aiDuplicateCheck.process('check', 3, async (job) => {
      const { submissionId } = job.data;
      console.log(`Processing AI duplicate check for submission ${submissionId}`);
      
      // TODO: Implement AI duplicate checking
      // For now, just enqueue the next step
      await this.queueService.enqueue('aiPatentabilityReview', { submissionId });
    });

    // AI Patentability Review processor
    queues.aiPatentabilityReview.process('review', 3, async (job) => {
      const { submissionId } = job.data;
      console.log(`Processing AI patentability review for submission ${submissionId}`);
      
      // TODO: Implement AI patentability review
      // For now, just enqueue the next step
      await this.queueService.enqueue('aiCouncil', { submissionId });
    });

    // AI Council processor
    queues.aiCouncil.process('deliberate', 2, async (job) => {
      const { submissionId } = job.data;
      console.log(`Processing AI council deliberation for submission ${submissionId}`);
      
      // TODO: Implement AI council decision
      // For now, just enqueue the next step
      await this.queueService.enqueue('finalize', { submissionId });
    });

    // Expert Dispatch processor
    queues.expertDispatch.process('dispatch', 1, async (job) => {
      const { submissionId } = job.data;
      console.log(`Processing expert dispatch for submission ${submissionId}`);
      
      // TODO: Implement expert assignment logic
      // This would typically assign experts and wait for their decisions
    });

    // Finalize processor
    queues.finalize.process('finalize', 2, async (job) => {
      const { submissionId } = job.data;
      console.log(`Processing finalization for submission ${submissionId}`);
      
      // TODO: Implement finalization logic
      // This would typically update the submission status and trigger certification
    });

    // Certify processor
    queues.certify.process('certify', 1, async (job) => {
      const { submissionId } = job.data;
      console.log(`Processing certification for submission ${submissionId}`);
      
      // TODO: Implement certification logic
      // This would generate certificates and blockchain transactions
    });

    // Reward processor
    queues.reward.process('reward', 1, async (job) => {
      const { submissionId } = job.data;
      console.log(`Processing rewards for submission ${submissionId}`);
      
      // TODO: Implement reward distribution logic
      // This would calculate and distribute IDN tokens
    });
  }

  /**
   * Setup error handlers
   */
  setupErrorHandlers(): void {
    Object.values(queues).forEach(queue => {
      queue.on('error', (error) => {
        console.error(`Queue ${queue.name} error:`, error);
      });

      queue.on('failed', (job, err) => {
        console.error(`Job ${job.id} failed in queue ${queue.name}:`, err);
      });

      queue.on('stalled', (job) => {
        console.warn(`Job ${job.id} stalled in queue ${queue.name}`);
      });
    });
  }
}

export { redis };
