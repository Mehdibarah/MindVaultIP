-- URGENT: Create Awards Bucket
-- Copy and paste this into your Supabase SQL Editor

-- Create the awards bucket
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

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create public read policy
CREATE POLICY IF NOT EXISTS "awards_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'awards');

-- Create authenticated write policy
CREATE POLICY IF NOT EXISTS "awards_authenticated_write" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'awards' 
  AND auth.role() = 'authenticated'
);

-- Verify it worked
SELECT name, public, file_size_limit FROM storage.buckets WHERE name = 'awards';
