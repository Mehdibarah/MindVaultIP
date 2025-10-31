# Fix: Vercel 404 Error

## مشکل

صفحه 404 از Vercel برای یک route یا API endpoint که وجود ندارد.

## علت‌های احتمالی

### 1. API Route وجود ندارد
- یک route در frontend استفاده می‌شود اما در `api/` موجود نیست
- یا نام route اشتباه است

### 2. Static Route وجود ندارد  
- یک صفحه React Router که در production وجود ندارد

### 3. Missing Rewrites
- Vercel نیاز به rewrite rules برای SPA routing دارد

## راه‌حل اعمال شده

### 1. اضافه کردن Rewrite Rules
در `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/index.html"
    }
  ]
}
```

این باعث می‌شود تمام routes به `index.html` redirect شوند (برای SPA routing).

### 2. Fallback Handler
`api/_fallback.js` اضافه شد که:
- 404 را با CORS headers مناسب برمی‌گرداند
- لیست endpoints موجود را نشان می‌دهد
- برای debugging مفید است

## API Endpoints موجود

- ✅ `/api/health/ping` - Health check
- ✅ `/api/health/config` - Configuration check
- ✅ `/api/awards` - Get/Create/Delete awards
- ✅ `/api/awards/issue` - Issue new award
- ✅ `/api/awards/founder` - Founder awards
- ✅ `/api/upload` - File upload

## تشخیص مشکل

### 1. چک Console (Browser)
```
Failed to load resource: 404
URL: https://www.mindvaultip.com/...
```

### 2. چک Network Tab
- URL دقیق که 404 می‌دهد را پیدا کن
- Method (GET/POST) را چک کن
- Headers را بررسی کن

### 3. چک Vercel Logs
- Vercel Dashboard → Functions → Logs
- ببین چه route ای request شده

## اگر هنوز 404 می‌دهد

### احتمال 1: Missing API Route
اگر یک endpoint جدید نیاز است:

1. در `api/` فایل جدید بساز
2. Export default function handler
3. Redeploy

### احتمال 2: React Router Route
اگر یک صفحه React است:

1. چک کن route در `src/pages/index.jsx` تعریف شده
2. چک کن component موجود است
3. Redeploy

### احتمال 3: Static Asset
اگر یک فایل static است:

1. چک کن فایل در `public/` موجود است
2. چک کن path درست است
3. Redeploy

## Deploy جدید

بعد از تغییرات:

```bash
git add .
git commit -m "fix: add Vercel rewrites and fallback handler"
git push
```

Vercel به صورت خودکار deploy می‌کند.

