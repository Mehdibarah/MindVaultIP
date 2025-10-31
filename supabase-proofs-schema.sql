-- =========================================================
-- MindVaultIP • Proofs Table + RLS Policies (Supabase ready)
-- =========================================================

-- (اختیاری) اگر خطا داد، این خط را حذف کن. در اکثر پروژه‌های Supabase فعال است.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Table
CREATE TABLE IF NOT EXISTS public.proofs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  category     TEXT,
  description  TEXT,
  file_hash    TEXT NOT NULL,
  file_name    TEXT,
  file_size    BIGINT,
  file_type    TEXT,
  ipfs_hash    TEXT,
  is_public    BOOLEAN DEFAULT true,
  payment_hash TEXT,
  created_by   TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- 2) Enable Row Level Security
ALTER TABLE public.proofs ENABLE ROW LEVEL SECURITY;

-- 3) RLS Policies
-- 3.1 SELECT (read) — فعلاً همه می‌توانند ببینند (MVP)
DROP POLICY IF EXISTS proofs_select_public ON public.proofs;
CREATE POLICY proofs_select_public
ON public.proofs
FOR SELECT
USING (true);  -- بعداً می‌توانی محدودش کنی به is_public = true

-- 3.2 INSERT — فعلاً آزاد
DROP POLICY IF EXISTS proofs_insert ON public.proofs;
CREATE POLICY proofs_insert
ON public.proofs
FOR INSERT
WITH CHECK (true);

-- 3.3 UPDATE — فعلاً آزاد (برای MVP). در پروDUCTION به مالک محدود کن.
DROP POLICY IF EXISTS proofs_update ON public.proofs;
CREATE POLICY proofs_update
ON public.proofs
FOR UPDATE
USING (true)
WITH CHECK (true);
-- نمونهٔ محدودسازی در آینده:
-- USING (created_by = auth.jwt() ->> 'wallet_address')
-- WITH CHECK (created_by = auth.jwt() ->> 'wallet_address')

-- 3.4 DELETE — فعلاً آزاد (برای MVP)
DROP POLICY IF EXISTS proofs_delete ON public.proofs;
CREATE POLICY proofs_delete
ON public.proofs
FOR DELETE
USING (true);

-- 4) Indexes
CREATE INDEX IF NOT EXISTS idx_proofs_created_by  ON public.proofs(created_by);
CREATE INDEX IF NOT EXISTS idx_proofs_file_hash   ON public.proofs(file_hash);
CREATE INDEX IF NOT EXISTS idx_proofs_is_public   ON public.proofs(is_public);
CREATE INDEX IF NOT EXISTS idx_proofs_category    ON public.proofs(category);
CREATE INDEX IF NOT EXISTS idx_proofs_created_at  ON public.proofs(created_at DESC);

-- 5) updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_proofs_updated_at ON public.proofs;
CREATE TRIGGER update_proofs_updated_at
  BEFORE UPDATE ON public.proofs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6) Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proofs TO authenticated;
GRANT SELECT ON public.proofs TO anon;