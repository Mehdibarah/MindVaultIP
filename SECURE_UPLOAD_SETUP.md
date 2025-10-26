# Secure Upload Setup Guide

## Overview
This guide sets up a secure file upload system using Supabase service key on the server-side only. The service key is never exposed to the client, ensuring maximum security.

## Architecture
- **Frontend**: Uses secure upload utility to send files to API route
- **API Route**: Server-side function that uses Supabase service key
- **Storage**: Files uploaded to Supabase storage with proper permissions

## Setup Steps

### 1. Get Supabase Service Key
1. Go to your Supabase project: https://supabase.com/dashboard/project/ycivhrsvatslktkxqtrh
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (NOT the anon key)
4. ⚠️ **IMPORTANT**: This key has admin privileges - keep it secret!

### 2. Add Service Key to Environment Variables
Add to your `.env` file:
```bash
# Supabase Service Key (SERVER-SIDE ONLY - NEVER expose to client)
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

### 3. Deploy API Route
The API route is located at `api/awards/issue.js` (or the appropriate server endpoint for your use case) and will be automatically deployed with your Vercel deployment.

### 4. Test the Setup
```bash
# Test the secure upload
npm run dev
```

## Security Features

### ✅ Server-Side Only Service Key
- Service key is only used in API routes (server-side)
- Never exposed to client-side code
- Protected by Vercel's serverless environment

### ✅ File Validation
- File type validation (images and PDFs only)
- File size limits (10MB maximum)
- Unique filename generation

### ✅ Proper Error Handling
- Detailed error messages for debugging
- Graceful fallback to direct storage upload
- Client-side validation before upload

### ✅ Secure File Paths
- Organized file structure with prefixes
- Unique UUID-based filenames
- No path traversal vulnerabilities

## API Endpoints

### POST /api/awards/issue
Uploads an award (file + metadata) securely using the service key. This endpoint verifies a founder signature and inserts the award record.

**Request (multipart/form-data):**
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('id', id);
formData.append('title', title);
formData.append('category', 'awards');
formData.append('recipient', recipientAddress || '');
formData.append('timestamp', timestamp);
formData.append('signature', signature); // signature produced by founder wallet

const response = await fetch('/api/awards/issue', {
  method: 'POST',
  body: formData
});
```

**Response:**
```javascript
{
  "success": true,
  "path": "awards/uuid-filename.jpg",
  "url": "https://supabase.co/storage/v1/object/public/awards/uuid-filename.jpg",
  "filename": "uuid-filename.jpg",
  "contentType": "image/jpeg",
  "size": 1234567,
  "bucket": "awards"
}
```

## Frontend Usage

### Basic Upload
```javascript
import { uploadAwardImage } from '@/lib/secureUpload';

const handleFileUpload = async (file) => {
  try {
    const result = await uploadAwardImage(file);
    console.log('Upload successful:', result.url);
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
};
```

### File Validation
```javascript
import { validateFile } from '@/lib/secureUpload';

const handleFileSelect = (file) => {
  const validation = validateFile(file);
  if (!validation.valid) {
    alert(validation.error);
    return;
  }
  // Proceed with upload
};
```

## File Organization

### Awards Images
- **Prefix**: `awards/`
- **Public**: Yes
- **Types**: Images only
- **Usage**: Award certificates and images

### Profile Avatars
- **Prefix**: `avatars/`
- **Public**: Yes
- **Types**: Images only
- **Usage**: User profile pictures

### Documents
- **Prefix**: `documents/`
- **Public**: No (private)
- **Types**: PDFs and images
- **Usage**: Private documents

## Error Handling

### Common Errors
1. **"Supabase server environment variables not configured"**
   - Solution: Add `SUPABASE_SERVICE_KEY` to your `.env` file

2. **"File type not allowed"**
   - Solution: Use only allowed file types (images, PDFs)

3. **"File too large"**
   - Solution: Reduce file size to under 10MB

4. **"Upload failed"**
   - Solution: Check Supabase bucket exists and has proper permissions

### Fallback System
If the secure upload fails, the system automatically falls back to direct storage upload using the anon key.

## Deployment

## Vercel Deployment
1. Add `SUPABASE_SERVICE_KEY` to Vercel environment variables
2. Deploy your project
3. The API route will be available at `/api/awards/issue` (or whichever server endpoint you implemented)

### Environment Variables in Vercel
```bash
SUPABASE_SERVICE_KEY=your_service_role_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_BUCKET=awards
```

## Security Best Practices

### ✅ Do's
- Always use the service key server-side only
- Validate file types and sizes
- Use unique filenames
- Implement proper error handling
- Monitor upload logs

### ❌ Don'ts
- Never expose service key to client
- Don't allow arbitrary file types
- Don't use predictable filenames
- Don't skip file validation
- Don't ignore error messages

## Monitoring

### Upload Logs
Check your Vercel function logs to monitor upload activity:
```bash
vercel logs --follow
```

### Supabase Storage
Monitor storage usage in your Supabase dashboard:
- Go to **Storage** → **awards** bucket
- Check file uploads and storage usage

## Troubleshooting

### Upload Not Working
1. Check if `SUPABASE_SERVICE_KEY` is set
2. Verify Supabase bucket exists
3. Check file type and size limits
4. Review Vercel function logs

### Permission Errors
1. Ensure service key has storage admin privileges
2. Check bucket RLS policies
3. Verify bucket is public for read access

### File Not Accessible
1. Check if bucket is public
2. Verify file path is correct
3. Check Supabase storage policies

## Support

For issues:
1. Check browser console for client-side errors
2. Check Vercel function logs for server-side errors
3. Verify Supabase configuration
4. Test with small files first
