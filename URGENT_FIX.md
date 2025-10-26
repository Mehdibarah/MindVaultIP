# URGENT: Fix Storage Error

## Current Status
- ✅ Supabase connection working
- ✅ SQL function exists
- ❌ Bucket still not created
- ❌ App showing "Storage not available"

## IMMEDIATE FIX

### Step 1: Go to Supabase SQL Editor
1. Open: https://supabase.com/dashboard/project/ycivhrsvatslktkxqtrh
2. Click **"SQL Editor"** in the left sidebar

### Step 2: Run this SQL
Copy and paste this into the SQL editor:

```sql
-- Create the awards bucket directly
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'awards',
  'awards',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
);

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
SELECT name, public FROM storage.buckets WHERE name = 'awards';
```

### Step 3: Click "Run"

### Step 4: Test immediately
```bash
node diagnose-storage.js
```

You should see:
- ✅ Bucket 'awards' exists

### Step 5: Start your app
```bash
npm run dev
```

## Alternative: Use the provided file
The SQL is also in `create-bucket-manual.sql` - copy that file's contents.

## What this does
- Creates the bucket directly in the database
- Sets up proper permissions
- Allows file uploads to work

## After this fix
Your "Storage not available" error will be completely resolved! 🎉
