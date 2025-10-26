# Supabase Storage Setup Guide

This guide will help you set up Supabase storage for the MindVaultIP Awards system with proper bucket creation and RLS policies.

## 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Supabase Configuration (REQUIRED for storage)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_BUCKET=awards

# Other required variables
VITE_FOUNDER_ADDRESS=0xYourFounderAddress
VITE_CONTRACT_ADDRESS=0xYourContractAddress
VITE_RPC_URL=https://mainnet.base.org
```

### Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project dashboard, go to **Settings** → **API**
3. Copy the **Project URL** and **anon public** key
4. Update your `.env` file with these values

## 2. Database Setup

Run the SQL script in your Supabase SQL editor:

```sql
-- Run the contents of supabase-awards-bucket-setup.sql
-- This will create the awards bucket with proper RLS policies
```

### Manual Setup (Alternative)

If you prefer to set up manually:

1. **Create the bucket:**
   - Go to **Storage** in your Supabase dashboard
   - Click **New bucket**
   - Name: `awards`
   - Make it **Public**
   - Set file size limit to 10MB
   - Allowed MIME types: `image/jpeg, image/png, image/gif, image/webp, application/pdf`

2. **Set up RLS policies:**
   - Go to **Authentication** → **Policies**
   - Create policies for the `storage.objects` table:
     - **Public read**: `bucket_id = 'awards'`
     - **Authenticated write**: `bucket_id = 'awards' AND auth.role() = 'authenticated'`

## 3. Verification

After setup, verify everything is working:

1. **Check environment variables:**
   ```bash
   npm run dev
   # Look for: "✅ Supabase storage initialized successfully on startup"
   ```

2. **Test file upload:**
   - Go to the Awards page
   - Try creating a new award with an image
   - Check that the image uploads successfully

3. **Check bucket in Supabase:**
   - Go to **Storage** → **awards** bucket
   - Verify files are being uploaded

## 4. Troubleshooting

### Common Issues

**"Bucket not found" error:**
- Ensure you've run the SQL setup script
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Verify the bucket name in your environment variables

**"Unauthorized" error:**
- Check that your Supabase anon key is correct
- Ensure RLS policies are properly set up
- Verify the bucket is marked as public

**File upload fails:**
- Check file size (must be under 10MB)
- Verify file type is allowed (images and PDFs)
- Check browser console for detailed error messages

### Debug Mode

Enable debug mode by setting:
```bash
VITE_DEBUG=1
```

This will show additional diagnostic information in the browser console.

## 5. Production Deployment

For production deployment:

1. **Set environment variables** in your hosting platform (Vercel, Netlify, etc.)
2. **Run the SQL setup script** in your production Supabase project
3. **Test the upload functionality** in production
4. **Monitor storage usage** in your Supabase dashboard

## 6. Security Notes

- The `awards` bucket is public for reading (award images need to be publicly accessible)
- Only authenticated users can upload files
- File size is limited to 10MB
- Only specific MIME types are allowed
- All uploads are logged and can be monitored

## 7. Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your environment variables are correct
3. Ensure the SQL setup script has been run
4. Check your Supabase project logs for server-side errors

For additional help, refer to the [Supabase Storage documentation](https://supabase.com/docs/guides/storage).
