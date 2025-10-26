# Storage Troubleshooting Guide

## Quick Fix for "Storage Not Available" Error

If you're seeing the error "Storage Not Available: Unable to initialize file storage", follow these steps:

### Step 1: Check Environment Variables

Run the diagnostic tool:
```bash
node diagnose-storage.js
```

This will check your `.env` file and Supabase configuration.

### Step 2: Set Up Environment Variables

If you don't have a `.env` file or it's missing Supabase credentials:

```bash
# Run the setup script
./setup-env.sh

# Or create .env manually
cp env.example .env
```

Then edit `.env` and add your Supabase credentials:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_BUCKET=awards
```

### Step 3: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing one
3. Go to **Settings** → **API**
4. Copy your **Project URL** and **anon public** key
5. Update your `.env` file

### Step 4: Set Up Supabase Database

1. Go to your Supabase project **SQL Editor**
2. Copy and paste the contents of `supabase-awards-bucket-setup.sql`
3. Click **Run** to execute the script

This will:
- Create the `awards` bucket
- Set up proper RLS policies
- Create the `ensure_awards_bucket()` function

### Step 5: Test the Setup

```bash
# Run the diagnostic tool again
node diagnose-storage.js

# Start the development server
npm run dev
```

## Common Error Messages and Solutions

### "Supabase not configured"
**Cause**: Missing environment variables
**Solution**: 
1. Create `.env` file with Supabase credentials
2. Run `./setup-env.sh` for guided setup

### "Invalid API key"
**Cause**: Wrong or missing Supabase anon key
**Solution**: 
1. Check your Supabase project settings
2. Copy the correct anon public key
3. Update `VITE_SUPABASE_ANON_KEY` in `.env`

### "function ensure_awards_bucket does not exist"
**Cause**: SQL function not installed
**Solution**: 
1. Go to Supabase SQL editor
2. Run `supabase-awards-bucket-setup.sql`
3. This creates the bucket and function

### "Bucket not found"
**Cause**: Awards bucket doesn't exist
**Solution**: 
1. Run the SQL setup script
2. Or manually create bucket in Supabase dashboard

### "Storage access failed"
**Cause**: Insufficient permissions or wrong URL
**Solution**: 
1. Check your Supabase URL format
2. Ensure you're using the anon key (not service role key)
3. Verify your project is active

## Manual Setup (Alternative)

If the automated setup doesn't work:

### 1. Create Bucket Manually
1. Go to Supabase **Storage** dashboard
2. Click **New bucket**
3. Name: `awards`
4. Make it **Public**
5. File size limit: 10MB
6. Allowed MIME types: `image/jpeg, image/png, image/gif, image/webp, application/pdf`

### 2. Set Up RLS Policies
1. Go to **Authentication** → **Policies**
2. Create policies for `storage.objects` table:

**Public Read Policy:**
```sql
CREATE POLICY "awards_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'awards');
```

**Authenticated Write Policy:**
```sql
CREATE POLICY "awards_authenticated_write" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'awards' 
  AND auth.role() = 'authenticated'
);
```

## Environment Variables Reference

Required variables in `.env`:
```bash
# Supabase (REQUIRED)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_BUCKET=awards

# Contract (REQUIRED)
VITE_CONTRACT_ADDRESS=0xYourContractAddress
VITE_RPC_URL=https://mainnet.base.org

# Optional
VITE_DEBUG=1
VITE_FOUNDER_ADDRESS=0xYourWalletAddress
```

## Testing Your Setup

1. **Check environment variables:**
   ```bash
   node diagnose-storage.js
   ```

2. **Test in browser:**
   - Open browser console
   - Look for: "✅ Supabase storage initialized successfully on startup"
   - Try uploading a file in the Awards form

3. **Check Supabase dashboard:**
   - Go to Storage → awards bucket
   - Verify files are being uploaded

## Still Having Issues?

1. **Check browser console** for detailed error messages
2. **Run the diagnostic tool** to identify specific problems
3. **Verify Supabase project** is active and accessible
4. **Check network connectivity** to Supabase servers
5. **Try creating a new Supabase project** if current one has issues

## Support

For additional help:
- Check the [Supabase Storage documentation](https://supabase.com/docs/guides/storage)
- Review the main setup guide: `SUPABASE_STORAGE_SETUP.md`
- Check browser console for detailed error messages
