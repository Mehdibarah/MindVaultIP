import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ReviewAttributes {
  review_id: string;
  submission_id: string;
  reviewer_type: 'AI' | 'EXPERT';
  result: 'APPROVE' | 'REJECT' | 'NEEDS_EXPERT';
  score?: number;
  reasons?: any;
  created_at: Date;
}

export interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'review_id' | 'score' | 'reasons' | 'created_at'> {}

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public review_id!: string;
  public submission_id!: string;
  public reviewer_type!: 'AI' | 'EXPERT';
  public result!: 'APPROVE' | 'REJECT' | 'NEEDS_EXPERT';
  public score?: number;
  public reasons?: any;
  public readonly created_at!: Date;
}

Review.init(
  {
    review_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    submission_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'submissions',
        key: 'id',
      },
    },
    reviewer_type: {
      type: DataTypes.ENUM('AI', 'EXPERT'),
      allowNull: false,
    },
    result: {
      type: DataTypes.ENUM('APPROVE', 'REJECT', 'NEEDS_EXPERT'),
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    reasons: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'reviews',
    timestamps: false,
  }
);
