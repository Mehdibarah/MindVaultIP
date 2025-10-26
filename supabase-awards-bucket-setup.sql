-- Supabase Awards Bucket Setup with RLS Policies
-- Run this in your Supabase SQL editor to create the awards bucket with proper policies

-- 1. Create the awards bucket if it doesn't exist
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

-- 7. Function to ensure awards bucket exists and is properly configured
CREATE OR REPLACE FUNCTION ensure_awards_bucket()
RETURNS void AS $$
DECLARE
  bucket_exists boolean;
  policy_exists boolean;
BEGIN
  -- Check if bucket exists
  SELECT EXISTS(
    SELECT 1 FROM storage.buckets WHERE name = 'awards'
  ) INTO bucket_exists;
  
  -- Create bucket if it doesn't exist
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'awards',
      'awards',
      true,
      10485760, -- 10MB
      ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    );
    
    RAISE NOTICE 'Created awards bucket';
  ELSE
    -- Update bucket to ensure it's public and has correct settings
    UPDATE storage.buckets 
    SET 
      public = true,
      file_size_limit = 10485760,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    WHERE name = 'awards';
    
    RAISE NOTICE 'Updated awards bucket settings';
  END IF;
  
  -- Ensure RLS is enabled
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  
  -- Check and create public read policy
  SELECT EXISTS(
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
      AND schemaname = 'storage'
      AND policyname = 'awards_public_read'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY awards_public_read ON storage.objects
    FOR SELECT USING (bucket_id = 'awards');
    RAISE NOTICE 'Created public read policy for awards bucket';
  END IF;
  
  -- Check and create authenticated write policy
  SELECT EXISTS(
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
      AND schemaname = 'storage'
      AND policyname = 'awards_authenticated_write'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY awards_authenticated_write ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'awards' 
      AND auth.role() = 'authenticated'
    );
    RAISE NOTICE 'Created authenticated write policy for awards bucket';
  END IF;
  
  -- Check and create authenticated update policy
  SELECT EXISTS(
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
      AND schemaname = 'storage'
      AND policyname = 'awards_authenticated_update'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY awards_authenticated_update ON storage.objects
    FOR UPDATE USING (
      bucket_id = 'awards' 
      AND auth.role() = 'authenticated'
    );
    RAISE NOTICE 'Created authenticated update policy for awards bucket';
  END IF;
  
  -- Check and create authenticated delete policy
  SELECT EXISTS(
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
      AND schemaname = 'storage'
      AND policyname = 'awards_authenticated_delete'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY awards_authenticated_delete ON storage.objects
    FOR DELETE USING (
      bucket_id = 'awards' 
      AND auth.role() = 'authenticated'
    );
    RAISE NOTICE 'Created authenticated delete policy for awards bucket';
  END IF;
  
  RAISE NOTICE 'Awards bucket setup completed successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Call the function to ensure everything is set up
SELECT ensure_awards_bucket();

-- 9. Verify the setup
SELECT 
  b.name as bucket_name,
  b.public as is_public,
  b.file_size_limit,
  b.allowed_mime_types
FROM storage.buckets b 
WHERE b.name = 'awards';

-- 10. List all policies for the awards bucket
SELECT 
  policyname,
  cmd as operation,
  qual as definition
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE 'awards_%';
