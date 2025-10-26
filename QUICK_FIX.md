# Quick Fix for Storage Error

## The Problem
Your app is failing with: `❌ Failed to ensure bucket awards (attempt 3): Could not find the function public.ensure_awards_bucket`

## The Solution
You need to create the `awards` bucket in your Supabase database. The anon key doesn't have permission to create buckets directly, so you need to run SQL.

## Step-by-Step Fix

### 1. Go to your Supabase project
- Open: https://supabase.com/dashboard/project/ycivhrsvatslktkxqtrh
- Click **"SQL Editor"** in the left sidebar

### 2. Run the SQL script
Copy and paste this SQL into the editor:

```sql
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
```

### 3. Click "Run" to execute the script

### 4. Test your setup
```bash
node diagnose-storage.js
```

You should see:
- ✅ Bucket 'awards' exists
- ✅ Storage access successful

### 5. Start your app
```bash
npm run dev
```

## Alternative: Use the provided SQL file
The same SQL is in `quick-bucket-setup.sql` - you can copy that file's contents.

## What this does
- Creates the `awards` bucket with proper settings
- Sets up Row Level Security (RLS) policies
- Allows public read access to award images
- Allows authenticated users to upload files

## After setup
Your storage error should be completely resolved! 🎉
