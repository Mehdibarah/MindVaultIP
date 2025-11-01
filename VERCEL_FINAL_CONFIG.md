# ✅ Final Vercel Configuration

## vercel.json

```json
{
  "rewrites": [
    {
      "source": "/storage/v1/object/public/:bucket/:path*",
      "destination": "https://ycivhrsvatslktkxqtrh.supabase.co/storage/v1/object/public/:bucket/:path*"
    },
    {
      "source": "/storage/v1/:path*",
      "destination": "https://ycivhrsvatslktkxqtrh.supabase.co/storage/v1/:path*"
    },
    {
      "source": "/storage/:path*",
      "destination": "https://ycivhrsvatslktkxqtrh.supabase.co/storage/:path*"
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ],
  "cleanUrls": true
}
```

## ترتیب Rewrites (مهم!)

1. **`/storage/v1/object/public/:bucket/:path*`** - دقیق‌ترین pattern (اول)
2. **`/storage/v1/:path*`** - pattern عمومی‌تر
3. **`/storage/:path*`** - pattern کلی
4. **`/((?!api/).*)`** - SPA fallback (آخر) - همه routes به جز `/api/*`

## فایل‌های حذف شده

- ✅ `public/_redirects` - حذف شد (مزاحم rewrite rules)
- ✅ `api/_fallback.js` - حذف شد (نیازی نیست)

## Deploy

```bash
git add vercel.json
git rm public/_redirects  # اگر در git است
git commit -m "fix: correct Vercel rewrite order - storage proxying + SPA fallback"
git push
```

## تست بعد از Deploy

### 1. تست Storage Proxy
```
https://www.mindvaultip.com/storage/v1/object/public/proofs/PROOF_ID/filename.jpg
```
باید فایل از Supabase برگردانده شود (200 OK).

### 2. تست API Routes
```
https://www.mindvaultip.com/api/health/ping
```
باید JSON response بدهد (نه redirect به index.html).

### 3. تست SPA Routes
```
https://www.mindvaultip.com/dashboard
https://www.mindvaultip.com/createproof
```
باید React Router route شود (نه 404).

## بررسی در Vercel Dashboard

بعد از deploy:
1. **Project → Deployments → Latest**
2. بخش **Routes** را باز کن
3. باید دقیقاً **4 rewrite rule** ببینی به همین ترتیب

## اگر هنوز مشکل دارد

1. چک کن که **Root Directory** در Settings درست است
2. چک کن که **Build Command** = `npm run build`
3. چک کن که **Output Directory** = `dist`
4. Hard refresh: `Ctrl+Shift+R` / `Cmd+Shift+R`

