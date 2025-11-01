# ✅ Complete Fix: Assets 404 Error

## مشکل

مرورگر فایل‌های `assets/*` را از `/createproof/assets/*` می‌خواهد (relative path) و 404 می‌گیرد.

**خطا:** `createproof:1 – Failed to load resource: 404`

## تغییرات اعمال شده

### 1. ✅ `<base href="/" />` در `index.html`

**قبل:**
```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/brain-favicon.svg" />
  ...
</head>
```

**بعد:**
```html
<head>
  <meta charset="UTF-8" />
  <base href="/" />
  <link rel="icon" type="image/svg+xml" href="/brain-favicon.svg" />
  ...
</head>
```

**نتیجه:** همه لینک‌ها/اسکریپت‌ها از root خوانده می‌شوند، نه relative به `/createproof`.

### 2. ✅ `base: '/'` در `vite.config.js`

**قبل:**
```javascript
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: { allowedHosts: true },
    ...
  }
})
```

**بعد:**
```javascript
export default defineConfig(({ mode }) => {
  return {
    base: '/', // ✅ خیلی مهم
    plugins: [react()],
    server: { allowedHosts: true },
    build: {
      outDir: 'dist' // ✅ مطمئن شو output directory درست است
    },
    ...
  }
})
```

**نتیجه:** Vite همه assets را از root build می‌کند.

### 3. ✅ `vercel.json` با Routes (به جای Rewrites)

**قبل (rewrites):**
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**بعد (routes):**
```json
{
  "version": 2,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/storage/...", "dest": "https://..." },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
```

**تفاوت:**
- `"handle": "filesystem"` - ابتدا فایل‌های واقعی را سرو می‌کند
- سپس rewrite rules اعمال می‌شوند
- `cleanUrls` و `trailingSlash` برای URL structure بهتر

## ترتیب Routes (مهم!)

1. **`"handle": "filesystem"`** - ابتدا فایل‌های واقعی (assets, index.html, etc.)
2. **`/storage/...`** - Supabase storage proxy
3. **`/(.*)` → `/index.html`** - SPA fallback (آخر)

## Build و Deploy

```bash
# 1. Clean build
rm -rf dist

# 2. Build
npm run build

# 3. Deploy
vercel --prod
```

یا از Vercel Dashboard → Redeploy

## تست

### 1. تست Assets

**Chrome DevTools → Network:**
1. فیلتر: `Doc`
2. برو به: `https://your-domain.com/createproof`
3. Refresh صفحه
4. **انتظار:** همه `assets/*.js`, `assets/*.css` باید `200 OK` باشند ✅

### 2. تست Direct Route

برو به:
```
https://your-domain.com/createproof
```

**انتظار:** صفحه باید load شود و 404 ندهد ✅

### 3. بررسی Console

**قبل:**
```
createproof:1 Failed to load resource: 404
```

**بعد:** نباید هیچ خطای 404 برای assets ببینی ✅

## چک‌لیست

- [x] `<base href="/" />` در `index.html` اضافه شد
- [x] `base: '/'` در `vite.config.js` اضافه شد
- [x] `build.outDir: 'dist'` در `vite.config.js` اضافه شد
- [x] `vercel.json` با `routes` (به جای `rewrites`) تنظیم شد
- [x] `"handle": "filesystem"` اضافه شد
- [x] Build موفق است
- [ ] Redeploy در Vercel (باید انجام بدهی)
- [ ] تست Network Tab (بعد از redeploy)

## اگر هنوز مشکل داری

### 1. Hard Refresh
- `Ctrl+Shift+R` (Windows) یا `Cmd+Shift+R` (Mac)
- یا Incognito mode

### 2. بررسی Build Output
```bash
ls -la dist/assets/
```
باید فایل‌های JS/CSS را ببینی.

### 3. بررسی Vercel Build Logs
در Vercel Dashboard → Build Logs، باید ببینی:
```
✓ Built in Xs
```

اگر خطا دیدی، share کن تا بررسی کنم.

## نتیجه

✅ همه assets از root خوانده می‌شوند (`/assets/*` نه `/createproof/assets/*`)  
✅ `base` tag در HTML همه relative paths را از root می‌سازد  
✅ Vite config مطمئن می‌شود که همه assets از root build می‌شوند  
✅ Vercel routes ابتدا فایل‌های واقعی را سرو می‌کند، سپس SPA fallback  

بعد از redeploy، مشکل 404 برای assets باید کاملاً حل شود! 🎉

