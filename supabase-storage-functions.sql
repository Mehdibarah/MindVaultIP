-- Supabase Storage Management Functions
-- Run this in your Supabase SQL editor to enable bucket policy management

-- Function to get bucket policies
CREATE OR REPLACE FUNCTION get_bucket_policies(bucket_name text)
RETURNS TABLE (
  policy_name text,
  operation text,
  definition text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.policyname::text as policy_name,
    p.cmd::text as operation,
    p.qual::text as definition
  FROM pg_policies p
  WHERE p.tablename = 'objects'
    AND p.schemaname = 'storage'
    AND p.policyname LIKE bucket_name || '%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create bucket policy
CREATE OR REPLACE FUNCTION create_bucket_policy(
  bucket_name text,
  policy_name text,
  operation text,
  definition text
)
RETURNS void AS $$
BEGIN
  EXECUTE format(
    'CREATE POLICY %I ON storage.objects FOR %s USING (bucket_id = %L)',
    policy_name,
    operation,
    bucket_name
  );
  
  -- If it's a SELECT policy, also allow public access
  IF operation = 'SELECT' THEN
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR %s USING (bucket_id = %L AND true)',
      policy_name || '_public',
      operation,
      bucket_name
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to ensure awards bucket exists and is public
CREATE OR REPLACE FUNCTION ensure_awards_bucket()
RETURNS void AS $$
DECLARE
  bucket_exists boolean;
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
      ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    );
    
    RAISE NOTICE 'Created awards bucket';
  END IF;
  
  -- Ensure public read policy exists
  IF NOT EXISTS(
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
      AND schemaname = 'storage'
      AND policyname = 'awards_public_read'
  ) THEN
    CREATE POLICY awards_public_read ON storage.objects
    FOR SELECT USING (bucket_id = 'awards');
    
    RAISE NOTICE 'Created public read policy for awards bucket';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Call the function to ensure bucket exists
SELECT ensure_awards_bucket();
