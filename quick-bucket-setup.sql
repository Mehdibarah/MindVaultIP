-- Quick Awards Bucket Setup
-- Run this in your Supabase SQL Editor to create the bucket and policies

-- 1. Create the awards bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'awards',
  'awards',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

-- 2. Enable RLS on storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create public read policy for awards bucket
CREATE POLICY IF NOT EXISTS "awards_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'awards');

-- 4. Create authenticated write policy for awards bucket
CREATE POLICY IF NOT EXISTS "awards_authenticated_write" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'awards' 
  AND auth.role() = 'authenticated'
);

-- 5. Create authenticated update policy for awards bucket
CREATE POLICY IF NOT EXISTS "awards_authenticated_update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'awards' 
  AND auth.role() = 'authenticated'
);

-- 6. Create authenticated delete policy for awards bucket
CREATE POLICY IF NOT EXISTS "awards_authenticated_delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'awards' 
  AND auth.role() = 'authenticated'
);

-- 7. Verify the setup
SELECT 
  b.name as bucket_name,
  b.public as is_public,
  b.file_size_limit,
  b.allowed_mime_types
FROM storage.buckets b 
WHERE b.name = 'awards';

-- 8. List policies for the awards bucket
SELECT 
  policyname,
  cmd as operation,
  qual as definition
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE 'awards_%';
