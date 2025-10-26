-- MindVaultIP Awards Table Schema Update
-- Run this in your Supabase SQL editor to add new recipient fields

-- Add new columns to the awards table
ALTER TABLE awards 
ADD COLUMN IF NOT EXISTS recipient_name TEXT,
ADD COLUMN IF NOT EXISTS recipient_email TEXT;

-- Make the recipient column nullable (if it's not already)
ALTER TABLE awards 
ALTER COLUMN recipient DROP NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN awards.recipient IS 'Recipient wallet address (optional)';
COMMENT ON COLUMN awards.recipient_name IS 'Recipient display name (optional)';
COMMENT ON COLUMN awards.recipient_email IS 'Recipient email address (optional)';

-- Create index for better performance on recipient lookups
CREATE INDEX IF NOT EXISTS idx_awards_recipient_name ON awards(recipient_name);
CREATE INDEX IF NOT EXISTS idx_awards_recipient_email ON awards(recipient_email);
