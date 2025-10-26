# Awards System Setup Guide

This guide covers the complete setup and troubleshooting of the MindVaultIP Awards system.

## Environment Configuration

### 1. Local Development (.env.local)

Create a `.env.local` file in the project root:

```bash
# Frontend (Vite)
VITE_API_URL=http://localhost:3000
VITE_FOUNDER_ADDRESS=0xYourFounderAddress

# Backend
FOUNDER_ADDRESS=0xYourFounderAddress
MAX_UPLOAD_MB=10

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here
SUPABASE_BUCKET=awards
```

### 2. Production (Vercel)

Set these environment variables in your Vercel project settings:

- `FOUNDER_ADDRESS`: Your founder wallet address
- `MAX_UPLOAD_MB`: Maximum file upload size (default: 10)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key
- `SUPABASE_BUCKET`: Storage bucket name (default: awards)

## Development Commands

### Start Development Server

```bash
# Standard development
npm run dev

# Development with network access (for mobile testing)
npm run dev:host
```

### Health Checks

```bash
# Check system health
npm run health

# Test API endpoint (requires FOUNDER_ADDRESS env var)
npm run test:curl
```

## API Endpoints

### Health Endpoints

- `GET /api/health/config` - Configuration status
- `GET /api/health/ping` - Basic connectivity test

### Awards Endpoint

- `POST /api/awards/issue` - Create new award

**Request Format:**
```javascript
const formData = new FormData();
formData.append('walletAddress', '0x...'); // Required: founder address
formData.append('title', 'Award Title'); // Required
formData.append('signature', '0x...'); // Required: signed message
formData.append('message', 'Message to sign'); // Required: message that was signed
formData.append('image', file); // Optional: award image
// ... other optional fields
```

**Response Format:**
```javascript
{
  "ok": true,
  "success": true,
  "award": { /* award data */ },
  "meta": {
    "filename": "image.jpg",
    "imageUrl": "https://..."
  }
}
```

## Error Handling

### Common Error Codes

- `400` - Bad Request (missing required fields, invalid file type/size)
- `403` - Forbidden (not founder, signature mismatch)
- `405` - Method Not Allowed (only POST allowed)
- `413` - Payload Too Large (file exceeds size limit)
- `500` - Internal Server Error (server configuration issues)

### Frontend Error Logging

All errors are logged with structured format:
```javascript
console.error('createAward.error', { 
  scope: 'createAward', 
  status: '403',
  message: 'Founder access required' 
});
```

## Troubleshooting

### 1. "Founder Not Configured" Warning

**Cause:** `FOUNDER_ADDRESS` environment variable not set on server.

**Solution:**
- Check Vercel environment variables
- Ensure `FOUNDER_ADDRESS` is set correctly
- Redeploy after setting environment variables

### 2. "Failed to fetch" Error

**Cause:** CORS issues or network connectivity problems.

**Solutions:**
- Check if API URL is correct in `VITE_API_URL`
- Ensure server is running and accessible
- Check browser console for CORS errors

### 3. "Signature verification failed"

**Cause:** Wallet address mismatch or invalid signature.

**Solutions:**
- Ensure connected wallet matches `FOUNDER_ADDRESS`
- Check that the same message is signed on frontend and verified on backend
- Verify wallet is connected and unlocked

### 4. File Upload Issues

**Cause:** File size/type restrictions or storage configuration.

**Solutions:**
- Check file size (max 10MB by default)
- Ensure file type is allowed (images: jpeg, png, gif, webp; documents: pdf)
- Verify Supabase storage is configured correctly

## Testing

### Manual Testing

1. **Health Check:**
   ```bash
   curl https://your-domain.com/api/health/config
   ```

2. **Award Creation:**
   - Open `/awards/new` in browser
   - Connect founder wallet
   - Fill form and submit
   - Check for success message and navigation

### Automated Testing

```bash
# Test health endpoints
npm run health

# Test award creation (requires test image)
npm run test:curl
```

## Security Notes

- Never expose `SUPABASE_SERVICE_KEY` to frontend
- Always validate signatures server-side
- Use HTTPS in production
- Implement rate limiting for production use
- Regularly rotate service keys

## Support

For issues:
1. Check browser console for error logs
2. Check Vercel function logs: `vercel logs <deployment-url>`
3. Verify environment variables are set correctly
4. Test health endpoints to isolate issues
