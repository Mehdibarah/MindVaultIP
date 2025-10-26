-- MindVaultIP Supabase Database Schema
-- Run this in your Supabase SQL editor

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  wallet TEXT PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY IF NOT EXISTS p_read ON profiles FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS p_upsert ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS p_update ON profiles FOR UPDATE USING (true);

-- 2. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  a_wallet TEXT NOT NULL,
  b_wallet TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY IF NOT EXISTS c_read ON conversations FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS c_write ON conversations FOR INSERT WITH CHECK (true);

-- 3. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  conv_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL,
  receiver TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY IF NOT EXISTS m_read ON messages FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS m_write ON messages FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_wallet ON profiles(wallet);
CREATE INDEX IF NOT EXISTS idx_conversations_wallets ON conversations(a_wallet, b_wallet);
CREATE INDEX IF NOT EXISTS idx_messages_conv_id ON messages(conv_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Function to generate conversation ID
CREATE OR REPLACE FUNCTION generate_conversation_id(wallet_a TEXT, wallet_b TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Normalize wallets to lowercase
  wallet_a := LOWER(wallet_a);
  wallet_b := LOWER(wallet_b);
  
  -- Create deterministic ID: sha256(min || '|' || max)
  RETURN encode(sha256((LEAST(wallet_a, wallet_b) || '|' || GREATEST(wallet_a, wallet_b))::bytea), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Function to upsert profile
CREATE OR REPLACE FUNCTION upsert_profile(
  p_wallet TEXT,
  p_display_name TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL
)
RETURNS profiles AS $$
DECLARE
  result profiles;
BEGIN
  INSERT INTO profiles (wallet, display_name, avatar_url, last_seen)
  VALUES (p_wallet, COALESCE(p_display_name, SUBSTRING(p_wallet, 1, 6) || '...' || SUBSTRING(p_wallet, -4)), p_avatar_url, NOW())
  ON CONFLICT (wallet) 
  DO UPDATE SET 
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    last_seen = NOW()
  RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get or create conversation
CREATE OR REPLACE FUNCTION get_or_create_conversation(
  p_wallet_a TEXT,
  p_wallet_b TEXT
)
RETURNS conversations AS $$
DECLARE
  conv_id TEXT;
  result conversations;
BEGIN
  -- Generate conversation ID
  conv_id := generate_conversation_id(p_wallet_a, p_wallet_b);
  
  -- Try to get existing conversation
  SELECT * INTO result FROM conversations WHERE id = conv_id;
  
  -- If not found, create new one
  IF NOT FOUND THEN
    INSERT INTO conversations (id, a_wallet, b_wallet)
    VALUES (conv_id, LOWER(p_wallet_a), LOWER(p_wallet_b))
    RETURNING * INTO result;
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
