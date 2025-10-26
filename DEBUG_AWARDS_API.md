# Debug Awards API

## How to Enable Debug Logging

To enable debug logging for the awards API, set the environment variable:

```bash
DEBUG_AWARDS=1
```

### Local Development
Add to your `.env` file:
```bash
DEBUG_AWARDS=1
```

### Vercel Deployment
Add to your Vercel environment variables:
- **Name**: `DEBUG_AWARDS`
- **Value**: `1`
- **Environment**: All (Production, Preview, Development)

## Debug Log Points

When `DEBUG_AWARDS=1` is set, the API will log detailed information at these checkpoints:

### 1. Environment Variables (`ENV`)
- Checks if `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `FOUNDER`, and `BUCKET` are set
- Shows which variables are missing

### 2. Form Parsing (`FIELDS_RAW`, `FILES_KEYS`)
- Lists all field names received from the form
- Lists all file keys received

### 3. Field Normalization (`FIELDS_NORM`)
- Shows which fields are set/missing after normalization
- Helps identify if form data is being parsed correctly

### 4. Missing Fields Check (`AUTH_FAIL`)
- Lists exactly which required fields are missing
- Provides detailed error response with missing field names

### 5. Signature Verification (`SIGN_INPUT`, `SIGNER_RECOVERED`)
- Shows the message being verified and signature status
- Displays the recovered signer address
- Logs signature verification failures

### 6. Authorization Check (`AUTH_FAIL`)
- Shows signer mismatch details
- Compares recovered signer with expected founder address

### 7. File Upload (`UPLOAD_START`, `UPLOAD_SUCCESS`, `UPLOAD_FAIL`)
- Logs upload start with file details
- Shows upload success with image URL
- Logs upload failures with error details

### 8. Database Insert (`DB_INSERT`, `DB_INSERT_SUCCESS`, `DB_INSERT_FAIL`)
- Shows what data is being inserted
- Logs successful insertions with award ID
- Logs database errors

## Example Debug Output

```
[DEBUG AWARDS] 2024-01-15T10:30:00.000Z ENV { SUPABASE_URL: 'SET', SUPABASE_SERVICE_KEY: 'SET', FOUNDER: '0x981edee0a3721d049d7343c04363fb38402f4bec', BUCKET: 'awards' }
[DEBUG AWARDS] 2024-01-15T10:30:00.100Z HANDLER_START { method: 'POST', url: '/api/awards/issue' }
[DEBUG AWARDS] 2024-01-15T10:30:00.200Z FIELDS_RAW ['id', 'title', 'category', 'recipient', 'signature']
[DEBUG AWARDS] 2024-01-15T10:30:00.300Z FIELDS_NORM { id: 'SET', title: 'SET', category: 'SET', recipient: 'SET', signature: 'SET' }
[DEBUG AWARDS] 2024-01-15T10:30:00.400Z SIGN_INPUT { message: '{"id":"award_123","title":"Test Award","category":"Innovation","recipient":"0x123...","timestamp":"2024-01-15T10:30:00.000Z"}', signature: 'SET' }
[DEBUG AWARDS] 2024-01-15T10:30:00.500Z SIGNER_RECOVERED 0x981edee0a3721d049d7343c04363fb38402f4bec
[DEBUG AWARDS] 2024-01-15T10:30:00.600Z UPLOAD_SKIP No files provided
[DEBUG AWARDS] 2024-01-15T10:30:00.700Z DB_INSERT { insertKeys: ['issuer', 'recipient', 'title', 'category', 'image_url', 'timestamp'], hasImage: false, recipient: '0x123...', title: 'Test Award' }
[DEBUG AWARDS] 2024-01-15T10:30:00.800Z DB_INSERT_SUCCESS { awardId: 'award_123' }
```

## Troubleshooting Common Issues

### 1. "Supabase service key not configured"
- Check `ENV` debug log to see which variables are missing
- Ensure `SUPABASE_SERVICE_KEY` is set in environment

### 2. "Missing required fields"
- Check `FIELDS_NORM` debug log to see which fields are missing
- Verify form data is being sent correctly from frontend

### 3. "Unauthorized: signer is not founder"
- Check `SIGNER_RECOVERED` vs expected `FOUNDER` address
- Verify the connected wallet is the founder wallet

### 4. "Upload failed"
- Check `UPLOAD_START` and `UPLOAD_FAIL` logs
- Verify Supabase bucket exists and has proper permissions

### 5. "Failed to insert award"
- Check `DB_INSERT_FAIL` log for database error details
- Verify awards table exists and has proper schema

## Viewing Debug Logs

### Local Development
Debug logs appear in your terminal when running `npm run dev`

### Vercel Deployment
1. Go to your Vercel dashboard
2. Click on your project
3. Go to **Functions** tab
4. Click on the function execution
5. View the logs in the **Logs** section

### Vercel CLI
```bash
vercel logs --follow
```

## Disabling Debug Logs

To disable debug logging, either:
1. Remove `DEBUG_AWARDS=1` from your environment variables
2. Set `DEBUG_AWARDS=0` or any other value
3. Don't set the variable at all (defaults to disabled)

