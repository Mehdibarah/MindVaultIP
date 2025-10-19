import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AuditLogAttributes {
  id: string;
  submission_id: string;
  action: string;
  payload?: any;
  actor: string; // system|user|expert:id
  created_at: Date;
}

export interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id' | 'payload' | 'created_at'> {}

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: string;
  public submission_id!: string;
  public action!: string;
  public payload?: any;
  public actor!: string;
  public readonly created_at!: Date;
}

AuditLog.init(
  {
    id: {
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
    action: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    actor: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'audit_log',
    timestamps: false,
  }
);
