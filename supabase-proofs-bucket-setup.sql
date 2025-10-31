-- =========================================================
-- Supabase Proofs Storage Bucket Setup
-- =========================================================
-- Run this entire script in your Supabase SQL Editor
-- Go to: Dashboard > SQL Editor > New Query > Paste & Run

-- 1. Create the proofs bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'proofs',
  'proofs',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/zip']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/zip'];

-- 2. Enable RLS on storage.objects table (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create public read policy for proofs bucket
DROP POLICY IF EXISTS "proofs_public_read" ON storage.objects;
CREATE POLICY "proofs_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'proofs');

-- 4. Create authenticated write policy for proofs bucket
DROP POLICY IF EXISTS "proofs_authenticated_write" ON storage.objects;
CREATE POLICY "proofs_authenticated_write" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'proofs');

-- 5. Create authenticated update policy for proofs bucket
DROP POLICY IF EXISTS "proofs_authenticated_update" ON storage.objects;
CREATE POLICY "proofs_authenticated_update" ON storage.objects
FOR UPDATE USING (bucket_id = 'proofs');

-- 6. Create authenticated delete policy for proofs bucket
DROP POLICY IF EXISTS "proofs_authenticated_delete" ON storage.objects;
CREATE POLICY "proofs_authenticated_delete" ON storage.objects
FOR DELETE USING (bucket_id = 'proofs');

-- 7. Verify it worked
SELECT name, public, file_size_limit FROM storage.buckets WHERE name = 'proofs';

