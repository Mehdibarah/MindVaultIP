import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface SubmissionAttributes {
  id: string;
  owner_id: string;
  type: 'invention' | 'discovery' | 'idea';
  status: 'UPLOADED' | 'AI_DUPLICATE_CHECK' | 'AI_PATENTABILITY_REVIEW' | 'AI_COUNCIL_DELIBERATION' | 
          'PENDING_EXPERT_REVIEW' | 'EXPERT_APPROVED' | 'EXPERT_REJECTED' | 
          'FINALIZED_APPROVED' | 'FINALIZED_REJECTED' | 'REWARDED';
  quality_score?: number;
  duplicate_risk?: number;
  ai_feedback?: any;
  expert_feedback?: any;
  files: any; // {original: [], derived: []}
  content_hash?: string;
  certificate_id?: string;
  chain_tx?: string;
  reward_amount?: number;
  created_at: Date;
  updated_at: Date;
}

export interface SubmissionCreationAttributes extends Optional<SubmissionAttributes, 'id' | 'quality_score' | 'duplicate_risk' | 'ai_feedback' | 'expert_feedback' | 'content_hash' | 'certificate_id' | 'chain_tx' | 'reward_amount' | 'created_at' | 'updated_at'> {}

export class Submission extends Model<SubmissionAttributes, SubmissionCreationAttributes> implements SubmissionAttributes {
  public id!: string;
  public owner_id!: string;
  public type!: 'invention' | 'discovery' | 'idea';
  public status!: 'UPLOADED' | 'AI_DUPLICATE_CHECK' | 'AI_PATENTABILITY_REVIEW' | 'AI_COUNCIL_DELIBERATION' | 
                  'PENDING_EXPERT_REVIEW' | 'EXPERT_APPROVED' | 'EXPERT_REJECTED' | 
                  'FINALIZED_APPROVED' | 'FINALIZED_REJECTED' | 'REWARDED';
  public quality_score?: number;
  public duplicate_risk?: number;
  public ai_feedback?: any;
  public expert_feedback?: any;
  public files!: any;
  public content_hash?: string;
  public certificate_id?: string;
  public chain_tx?: string;
  public reward_amount?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Submission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('invention', 'discovery', 'idea'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'UPLOADED', 'AI_DUPLICATE_CHECK', 'AI_PATENTABILITY_REVIEW', 'AI_COUNCIL_DELIBERATION',
        'PENDING_EXPERT_REVIEW', 'EXPERT_APPROVED', 'EXPERT_REJECTED',
        'FINALIZED_APPROVED', 'FINALIZED_REJECTED', 'REWARDED'
      ),
      allowNull: false,
      defaultValue: 'UPLOADED',
    },
    quality_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    duplicate_risk: {
      type: DataTypes.REAL,
      allowNull: true,
      validate: {
        min: 0,
        max: 1,
      },
    },
    ai_feedback: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    expert_feedback: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    files: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { original: [], derived: [] },
    },
    content_hash: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    certificate_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    chain_tx: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reward_amount: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'submissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
