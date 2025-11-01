# ✅ وضعیت Deploy - همه چیز آماده است

## فایل‌های آماده

### 1. ✅ `vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": {
    "api/*.js": {
      "runtime": "nodejs20.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. ✅ `api/health.js` 
- فرمت: CommonJS (`module.exports`)
- Endpoint: `GET /api/health`
- Status: ✅ آماده

### 3. ✅ `api/createproof.js`
- فرمت: CommonJS (`module.exports`) 
- Endpoint: `POST /api/createproof`
- Status: ✅ آماده

## مراحل Deploy

```bash
# 1. کامیت
git add vercel.json api/health.js api/createproof.js
git commit -m "fix: Vercel serverless functions - CommonJS format"

# 2. دیپلوی
vercel --prod

# یا اگر از git استفاده می‌کنید:
git push
```

## تست بعد از Deploy

### تست Health:
```bash
curl https://YOUR_DOMAIN/api/health
```

باید ببینید:
```json
{
  "ok": true,
  "time": 1234567890,
  "timestamp": "2024-..."
}
```

### تست CreateProof:
```bash
curl -X POST https://YOUR_DOMAIN/api/createproof \
  -H "Content-Type: application/json" \
  -d '{
    "transactionHash": "0xtest",
    "userAddress": "0xtest"
  }'
```

## خلاصه تغییرات

1. ✅ `api/health.js` → CommonJS format
2. ✅ `api/createproof.js` → CommonJS format  
3. ✅ `vercel.json` → با functions configuration
4. ✅ هر دو endpoint در root `api/` هستند

## اگر هنوز 404 می‌دهد

### چک 1: Vercel Dashboard
- Project → Settings → Functions
- Root Directory باید `/` باشد (نه `/src` یا `/dist`)

### چک 2: Build Logs
در Deploy logs باید ببینید:
```
✓ Detected API routes in api/
```

### چک 3: Environment Variables
مطمئن شوید اینها در Vercel تنظیم شده:
- `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_KEY` یا `VITE_SUPABASE_SERVICE_KEY`

همه چیز آماده است! ✅

