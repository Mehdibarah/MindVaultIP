# ✅ Deploy Checklist - Fix Vercel 404

## تغییرات لازم قبل از Deploy

### 1. ✅ vercel.json
```json
{
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```
**وضعیت:** ✅ انجام شد

### 2. ✅ public/_redirects
```
/*    /index.html   200
```
**وضعیت:** ✅ ایجاد شد (fallback)

### 3. Commit & Push

```bash
git add vercel.json public/_redirects
git commit -m "fix: complete SPA routing - exclude API routes from rewrite"
git push
```

### 4. بررسی در Vercel Dashboard

بعد از push:
1. Vercel Dashboard → Project → Deployments
2. منتظر بمانید تا deploy تمام شود
3. Deploy جدید را باز کنید

### 5. تست

1. **Route مستقیم:** `https://mindvaultip.com/dashboard`
   - باید صفحه Dashboard باز شود (نه 404)

2. **Storage URL:** یک فایل proof با storage URL باز کنید
   - باید فایل در Supabase باز شود (نه 404)

3. **API Route:** `https://mindvaultip.com/api/health/ping`
   - باید JSON response بدهد (نه 404)

## اگر هنوز 404 می‌دهد

### احتمال 1: Deploy نشده
- چک کنید آخرین commit push شده
- در Vercel Dashboard deployment جدید وجود دارد

### احتمال 2: Cache مرورگر
- Hard refresh: `Ctrl+Shift+R` (Windows) یا `Cmd+Shift+R` (Mac)
- یا Incognito mode امتحان کنید

### احتمال 3: Resource دیگر
- Network tab را باز کنید
- URL دقیق که 404 می‌دهد را پیدا کنید
- بررسی کنید که آیا static asset است یا route

## راه‌حل سریع (اگر نیاز است)

اگر بعد از deploy هنوز مشکل دارد، در Vercel Dashboard:

1. Settings → General
2. Framework Preset را چک کنید (باید "Vite" یا "Other" باشد)
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Install Command: `npm install`

سپس دوباره deploy کنید.

