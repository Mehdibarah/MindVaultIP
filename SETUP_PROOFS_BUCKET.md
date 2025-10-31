# Setup Proofs Storage Bucket

## Quick Setup Instructions

The app needs a Supabase storage bucket named `proofs` to upload proof files.

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the SQL Script
1. Click **New Query**
2. Copy the entire contents of `supabase-proofs-bucket-setup.sql`
3. Paste into the SQL editor
4. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 3: Verify It Worked
After running, you should see:
```
Success. No rows returned
```

Verify the bucket exists:
```sql
SELECT name, public, file_size_limit FROM storage.buckets WHERE name = 'proofs';
```

You should see one row with:
- `name`: proofs
- `public`: true
- `file_size_limit`: 10485760

### Alternative: Create via Dashboard UI
1. Go to **Storage** in the left sidebar
2. Click **New Bucket**
3. Set:
   - **Name**: `proofs`
   - **Public bucket**: ✅ Enabled
   - **File size limit**: 10 MB (10485760 bytes)
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/png`
     - `image/gif`
     - `image/webp`
     - `application/pdf`
     - `text/plain`
     - `application/zip`
4. Click **Create bucket**

### Troubleshooting

**Error: "permission denied for table storage.buckets"**
- You need to be the project owner or have admin access
- If using a team account, ask an admin to run the SQL

**Error: "bucket already exists"**
- This is fine! The bucket is already created
- The app should work now

**Still getting "bucket does not exist" after creating?**
1. Refresh the page
2. Check bucket name is exactly `proofs` (lowercase, no spaces)
3. Verify you're in the correct Supabase project

## What This Creates

- **Bucket**: `proofs` (public)
- **File size limit**: 10 MB
- **Public access**: Enabled (anyone can read)
- **RLS policies**: 
  - Public read access
  - Authenticated write/update/delete access

