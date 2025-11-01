# ✅ Complete Fix: Vercel 404 Error

## تغییرات اعمال شده

### 1. ✅ SPA Fallback در `vercel.json`

**قبل:**
```json
{
  "rewrites": [
    {
      "source": "/storage/v1/object/public/:bucket/:path*",
      "destination": "https://ycivhrsvatslktkxqtrh.supabase.co/storage/v1/object/public/:bucket/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**بعد:**
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
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
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store"
        }
      ]
    }
  ]
}
```

**تغییرات:**
- ✅ اضافه شدن `/api/(.*)` rewrite برای API routes
- ✅ حفظ Supabase storage rewrites
- ✅ SPA fallback `/(.*)` → `/index.html` در آخر (lowest priority)
- ✅ اضافه شدن Cache-Control header برای جلوگیری از cache

### 2. ✅ Build Scripts در `package.json`

**اضافه شده:**
```json
"scripts": {
  "build": "vite build",
  "vercel-build": "vite build",  // ✅ اضافه شد برای Vercel CLI
  ...
}
```

### 3. ✅ بررسی Navigation

**مهم:** اگر جایی از `router.push()` برای Supabase storage URLs استفاده می‌شود:

**❌ اشتباه:**
```javascript
const publicUrl = 'https://xxx.supabase.co/storage/v1/...';
router.push(publicUrl); // ❌ این باعث 404 می‌شود
```

**✅ درست:**
```javascript
const publicUrl = 'https://xxx.supabase.co/storage/v1/...';
window.open(publicUrl, '_blank', 'noopener'); // ✅ باز کردن در tab جدید
```

## Vercel Build Settings

در Vercel Dashboard:

**Framework Preset:** Vite

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm install`

## تست

### 1. تست مستقیم Route

باز کن:
```
https://your-domain.com/createproof
```

**انتظار:** باید صفحه load شود و 404 ندهد ✅

### 2. تست Refresh

1. برو به `/createproof`
2. Refresh صفحه (F5)
3. **انتظار:** باید reload شود و 404 ندهد ✅

### 3. تست Navigation

1. از صفحه اصلی به `/createproof` برو
2. **انتظار:** باید route change شود و 404 ندهد ✅

### 4. تست Supabase Storage URLs

1. یک فایل آپلود کن
2. URL را در tab جدید باز کن
3. **انتظار:** باید فایل لود شود (نه 404) ✅

## عیب‌یابی

### اگر هنوز 404 می‌بینی:

1. **چک کن که `vercel.json` در ریشه پروژه است**
   ```bash
   ls -la vercel.json
   ```

2. **چک کن که در Build Logs می‌بینی:**
   ```
   Using vercel.json
   ```

3. **Redeploy کن:**
   ```bash
   vercel --prod
   ```
   یا از Dashboard → Deployments → Redeploy

4. **Network Tab را چک کن:**
   - فیلتر: Status = 404
   - ببین دقیقاً چه URL ای 404 می‌دهد
   - اگر `mindvaultip.com/...` است → مشکل routing (با vercel.json حل می‌شود)
   - اگر `supabase.co/...` است → مشکل Supabase storage (RLS/policy)

## چک‌لیست نهایی

- [x] `vercel.json` با SPA fallback درست است
- [x] `/api/(.*)` rewrite اضافه شده
- [x] Supabase storage rewrites حفظ شده
- [x] Cache-Control header اضافه شده
- [x] `vercel-build` script در `package.json` اضافه شده
- [ ] Redeploy در Vercel انجام شده
- [ ] تست مستقیم `/createproof` انجام شده

## نتیجه

✅ `vercel.json` برای SPA routing درست است  
✅ همه routes به `index.html` redirect می‌شوند  
✅ Supabase storage URLs به Supabase proxy می‌شوند  
✅ API routes به `/api/` proxy می‌شوند  
✅ Cache-Control header برای جلوگیری از cache issues  

بعد از redeploy، مشکل 404 باید حل شود.
