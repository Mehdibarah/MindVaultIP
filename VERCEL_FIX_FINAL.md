# ✅ Vercel Configuration - Final Fix

## فایل‌های نهایی

### ✅ `vercel.json`
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### ✅ `api/health.js`
```javascript
export default function handler(req, res) {
  res.status(200).json({ ok: true, time: Date.now() });
}
```

## تغییرات اعمال شده

1. ✅ `buildCommand` و `outputDirectory` اضافه شد (برای وضوح بیشتر)
2. ✅ `builds[0].src` از `index.html` به `package.json` تغییر کرد (صحیح‌تر)
3. ✅ Routes ساده‌تر شد (بدون regex پیچیده)
4. ✅ API route pattern: `/api/(.*)` → `/api/$1`

## مراحل دیپلوی

```bash
# 1. کامیت
git add vercel.json api/health.js
git commit -m "fix: Vercel config for static + Node API"

# 2. دیپلوی
vercel --prod
```

## تست

بعد از deploy:
```bash
# در مرورگر:
https://YOUR_DOMAIN/api/health

# در Console:
fetch('/api/health').then(r => r.json()).then(console.log)
```

## اگر هنوز مشکل دارد

1. **چک Build Logs در Vercel Dashboard:**
   - باید ببینید: `@vercel/static-build matched package.json`
   - باید ببینید: `@vercel/node matched api/health.js`

2. **چک Project Settings در Vercel:**
   - Framework Preset: "Other" یا "Vite"
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **اگر API پیدا نمی‌شود:**
   - مطمئن شوید `api/health.js` در **root** پروژه است (نه در `src/`)
   - مطمئن شوید فایل `vercel.json` در **root** است

