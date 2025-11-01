# ✅ Final Fix: Vercel API Routes 404

## مشکل
```
Failed to load resource: the server responded with a status of 404 () createproof:1
```

این خطا نشان می‌دهد که:
- یا درخواست به `/createproof` (بدون `/api/`) می‌رود
- یا Vercel فایل API را پیدا نمی‌کند

## راه‌حل نهایی

### 1. ✅ `vercel.json` - Explicit Routes
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/health",
      "destination": "/api/health.js"
    },
    {
      "source": "/api/createproof",
      "destination": "/api/createproof.js"
    },
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. ✅ فایل‌های API در Root
```
api/
├── health.js       ✅
└── createproof.js  ✅
```

## Deploy

```bash
git add vercel.json api/createproof.js
git commit -m "fix: explicit API routes in vercel.json"
vercel --prod
```

## تست

```bash
# در Console:
fetch('/api/createproof', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ transactionHash: '0xtest', userAddress: '0xtest' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

## اگر هنوز 404

### چک 1: Vercel Dashboard
1. Project → Settings → Functions
2. مطمئن شوید `api/` در Root Directory است
3. اگر monorepo است، Root Directory را تنظیم کنید

### چک 2: Build Logs
در Deploy logs باید ببینید:
```
✓ Detected API routes in api/
```

### چک 3: Network Tab
- URL دقیق چیست؟
- Status Code چیست؟
- Response چیست؟

