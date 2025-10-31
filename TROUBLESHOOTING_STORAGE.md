# Troubleshooting: "No buckets found" or Storage Issues

## Problem: `⚠️ No buckets found in connected project`

This warning appears when the Supabase client successfully connects but finds no storage buckets in the project.

### Possible Causes

1. **No buckets created yet** - The project is new or buckets haven't been set up
2. **Storage API disabled** - Storage feature is not enabled for the project
3. **Wrong project** - The `VITE_SUPABASE_URL` points to a different project than expected
4. **Permission issue** - The anon key can't list buckets (rare with default RLS)

### Solutions

#### Option 1: Create Bucket via SQL (Recommended)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run the script from `supabase-proofs-bucket-setup.sql`:
   ```sql
   INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
   VALUES ('proofs', 'proofs', true, 10485760, 
     ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 
           'application/pdf', 'text/plain', 'application/zip']);
   ```
3. Verify it was created:
   ```sql
   SELECT name FROM storage.buckets WHERE name = 'proofs';
   ```

#### Option 2: Create Bucket via Dashboard UI

1. Go to **Supabase Dashboard** → **Storage**
2. Click **New Bucket**
3. Set:
   - **Name**: `proofs`
   - **Public bucket**: ✅ Enabled
   - **File size limit**: 10 MB
   - **Allowed MIME types**: Add all file types you want to support
4. Click **Create bucket**

#### Option 3: Verify Environment Variables

Check that your environment variables match your Supabase project:

```bash
# In your .env file or Vercel environment variables
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_BUCKET=proofs
```

To find these values:
1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Copy the **Project URL** → `VITE_SUPABASE_URL`
3. Copy the **anon public** key → `VITE_SUPABASE_ANON_KEY`

#### Option 4: Verify Project Connection

1. Open browser console
2. Look for `[StorageDiagnostics] 🔍 Supabase Configuration:`
3. Verify the URL matches your Supabase project
4. Check the anon key preview matches your project

### After Creating the Bucket

1. **Refresh the app** - The diagnostics run on startup
2. You should see:
   ```
   [StorageDiagnostics] ✅ Found buckets: ['proofs', ...]
   [StorageDiagnostics] ✅ Bucket "proofs" exists
   ```

### If Storage Still Doesn't Work

#### Check Storage API Status

1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Verify **Storage API** is enabled
3. Check **Storage** is listed under available APIs

#### Check RLS Policies

The anon key should have read access to `storage.buckets` table. Default Supabase setup includes this, but verify:

1. Go to **Supabase Dashboard** → **Storage** → **Policies**
2. Check that there's a policy allowing public read access to buckets

#### Test Direct Connection

Open browser console and run:
```javascript
// Should return array of buckets
const { data, error } = await supabase.storage.listBuckets();
console.log('Buckets:', data);
console.log('Error:', error);
```

### Error Messages Explained

- **401/403 errors**: Wrong anon key or missing permissions
- **No buckets found**: Buckets exist but project connection is wrong, or no buckets created
- **"Failed to list buckets"**: Storage API issue or connection problem

### Next Steps

Once you see `✅ Bucket "proofs" exists` in the console, file uploads should work. Try creating a proof to verify the full flow.

