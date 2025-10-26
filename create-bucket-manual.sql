-- Manual Bucket Creation
-- Run this in your Supabase SQL Editor

-- First, let's check if the bucket already exists
SELECT name, public, file_size_limit FROM storage.buckets WHERE name = 'awards';

-- Create the awards bucket directly
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'awards',
  'awards',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
);

-- If the above fails due to conflict, use this instead:
-- UPDATE storage.buckets 
-- SET public = true, file_size_limit = 10485760
-- WHERE name = 'awards';

-- Enable RLS on storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create public read policy for awards bucket
CREATE POLICY IF NOT EXISTS "awards_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'awards');

-- Create authenticated write policy for awards bucket
CREATE POLICY IF NOT EXISTS "awards_authenticated_write" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'awards' 
  AND auth.role() = 'authenticated'
);

-- Verify the bucket was created
SELECT 
  b.name as bucket_name,
  b.public as is_public,
  b.file_size_limit,
  b.allowed_mime_types
FROM storage.buckets b 
WHERE b.name = 'awards';
