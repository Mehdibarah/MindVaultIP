-- Migration: Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL,
    type TEXT CHECK (type IN ('invention','discovery','idea')) NOT NULL,
    status TEXT CHECK (status IN (
        'UPLOADED','AI_DUPLICATE_CHECK','AI_PATENTABILITY_REVIEW','AI_COUNCIL_DELIBERATION',
        'PENDING_EXPERT_REVIEW','EXPERT_APPROVED','EXPERT_REJECTED',
        'FINALIZED_APPROVED','FINALIZED_REJECTED','REWARDED'
    )) NOT NULL DEFAULT 'UPLOADED',
    quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
    duplicate_risk REAL CHECK (duplicate_risk >= 0 AND duplicate_risk <= 1),
    ai_feedback JSONB,
    expert_feedback JSONB,
    files JSONB NOT NULL DEFAULT '{"original": [], "derived": []}',
    content_hash TEXT,
    certificate_id TEXT,
    chain_tx TEXT,
    reward_amount NUMERIC(18,8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_owner_id ON submissions(owner_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    reviewer_type TEXT CHECK (reviewer_type IN ('AI','EXPERT')) NOT NULL,
    result TEXT CHECK (result IN ('APPROVE','REJECT','NEEDS_EXPERT')) NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    reasons JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_submission_id ON reviews(submission_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_type ON reviews(reviewer_type);
CREATE INDEX IF NOT EXISTS idx_reviews_result ON reviews(result);

-- Create audit_log table
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    payload JSONB,
    actor TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for audit_log
CREATE INDEX IF NOT EXISTS idx_audit_log_submission_id ON audit_log(submission_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create vector index table for AI matching
CREATE TABLE IF NOT EXISTS submission_vectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    content_vector vector(1536), -- OpenAI embedding dimension
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_submission_vectors_content_vector 
ON submission_vectors USING ivfflat (content_vector vector_cosine_ops) 
WITH (lists = 100);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for submissions table
CREATE TRIGGER update_submissions_updated_at 
    BEFORE UPDATE ON submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
