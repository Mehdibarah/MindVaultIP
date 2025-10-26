-- MindVaultIP Profiles Table Schema
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS profiles (
  wallet_address text PRIMARY KEY,
  display_name   text,
  avatar_url     text,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY read_profiles   ON profiles FOR SELECT USING (true);
CREATE POLICY insert_profiles ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY up_profiles     ON profiles FOR UPDATE USING (true) WITH CHECK (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON profiles(wallet_address);
