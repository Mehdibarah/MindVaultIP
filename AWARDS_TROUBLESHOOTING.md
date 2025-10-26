# Awards Upload & Save Error Troubleshooting Guide

## Issues Fixed

### 1. **Response Format Mismatch** ✅ FIXED
- **Problem**: Frontend expected `result.ok` but backend returned `result.success`
- **Solution**: Updated backend to return both `success: true` and `ok: true`
- **Location**: `api/awards/issue.js` line 193

### 2. **Formidable Configuration** ✅ FIXED
- **Problem**: Missing file size limits and proper configuration
- **Solution**: Added proper formidable configuration with 10MB limit and file validation
- **Location**: `api/awards/issue.js` lines 76-96

### 3. **File Upload Validation** ✅ FIXED
- **Problem**: No file type or size validation on server side
- **Solution**: Added comprehensive file validation for type and size
- **Location**: `api/awards/issue.js` lines 165-178

### 4. **Frontend Error Handling** ✅ FIXED
- **Problem**: Poor error handling and validation
- **Solution**: Added comprehensive validation and better error messages
- **Location**: `src/components/AwardForm.jsx` lines 30-84

### 5. **Environment Configuration** ✅ FIXED
- **Problem**: Missing environment variables
- **Solution**: Created setup script for proper configuration
- **Location**: `setup-awards-env.sh`

## Common Issues & Solutions

### Issue: "Supabase not configured"
**Solution**: 
1. Run the setup script: `./setup-awards-env.sh`
2. Update `.env` with your Supabase credentials
3. Restart development server

### Issue: "File upload failed"
**Possible Causes**:
1. **File too large**: Maximum 10MB allowed
2. **Invalid file type**: Only images (JPEG, PNG, GIF, WebP) and PDFs allowed
3. **Supabase bucket not configured**: Create 'awards' bucket in Supabase
4. **Missing service key**: Add `SUPABASE_SERVICE_KEY` to `.env`

### Issue: "Unauthorized: signer is not founder"
**Solution**:
1. Connect the correct founder wallet
2. Update `VITE_FOUNDER_ADDRESS` in `.env` with the correct address
3. Ensure the connected wallet matches the founder address

### Issue: "API route is protected by authentication"
**Solution**:
1. Check if Vercel protection is enabled
2. Disable Vercel protection for API routes
3. Ensure environment variables are properly set

## Environment Variables Required

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_BUCKET=awards

# Founder Address
VITE_FOUNDER_ADDRESS=0xYourFounderAddress

# Server-side (NEVER expose to client)
SUPABASE_SERVICE_KEY=your-service-key-here

# Debug (optional)
DEBUG_AWARDS=1
```

## Supabase Setup Steps

1. **Create Project**: Go to [supabase.com](https://supabase.com) and create a new project
2. **Get Credentials**: 
   - Go to Settings → API
   - Copy Project URL and anon public key
   - Copy service_role key (for server-side operations)
3. **Create Bucket**:
   - Go to Storage
   - Create new bucket named 'awards'
   - Make it public
   - Set file size limit to 10MB
   - Allowed MIME types: `image/jpeg, image/png, image/gif, image/webp, application/pdf`

## Testing the Fix

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Check Console Logs**:
   - Look for: "✅ Supabase storage initialized successfully"
   - Look for: "🔑 FOUNDER Address: [your-address]"

3. **Test Award Creation**:
   - Go to Awards page
   - Click "Create Award"
   - Fill in required fields
   - Upload an image (optional)
   - Click Save

4. **Expected Behavior**:
   - Form validates input
   - Wallet prompts for signature
   - File uploads successfully
   - Award is created and saved
   - Success toast appears

## Debug Mode

Enable debug mode by setting `DEBUG_AWARDS=1` in your `.env` file. This will show detailed logs in the console.

## File Upload Limits

- **Maximum file size**: 10MB
- **Allowed file types**: 
  - Images: JPEG, PNG, GIF, WebP
  - Documents: PDF
- **Storage location**: Supabase 'awards' bucket

## Security Notes

- The `SUPABASE_SERVICE_KEY` should NEVER be exposed to the client
- Only the founder address can create awards (verified by signature)
- File uploads are validated on both client and server side
- All uploads go through the secure `/api/awards/issue` endpoint

## Still Having Issues?

1. Check browser console for error messages
2. Check server logs for detailed error information
3. Verify all environment variables are set correctly
4. Ensure Supabase bucket exists and is properly configured
5. Test with a simple award (no file upload) first
