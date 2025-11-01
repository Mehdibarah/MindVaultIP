# ✅ حل کامل مشکل 404 برای API Routes

## 🔍 بررسی مشکل

خطای 404 در Vercel معمولاً به این دلایل رخ می‌دهد:

1. **فایل API در مسیر اشتباه است**
2. **Vercel فایل API را detect نمی‌کند**
3. **Frontend URL اشتباه call می‌کند**
4. **vercel.json تنظیمات نادرست دارد**

---

## ✅ راه‌حل‌های اعمال شده

### 1. ✅ ساده‌سازی `vercel.json`

**قبل:**
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },  // ❌ تکراری
    { "source": "/((?!api|assets|.*\\..*).*)", "destination": "/index.html" }
  ],
  "headers": [...] // ❌ ممکن است interfere کند
}
```

**بعد (فعلی):**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/((?!api|assets|.*\\..*).*)",
      "destination": "/index.html"
    }
  ]
}
```

**چرا این بهتر است:**
- Vercel به صورت **خودکار** فایل‌های `api/*.js` را به عنوان serverless functions detect می‌کند
- Rewrite فقط برای SPA routing است و `api/` را exclude می‌کند
- Headers در سطح edge ممکن است با API routes conflict کند

---

### 2. ✅ بررسی فایل‌های API

همه فایل‌های API در `api/` باید:

```javascript
export default async function handler(req, res) {
  // ... کد
}
```

**فایل‌های موجود:**
- ✅ `api/createproof1.js` - 223 خط، کامل
- ✅ `api/createproof.js` - کامل
- ✅ `api/health.js` - کامل  
- ✅ `api/log.js` - کامل

---

### 3. ✅ بررسی Frontend Calls

**در `CreateProof.jsx`:**
- از `proofClient()` استفاده می‌کند (✅ مستقیم با Supabase)
- API endpoint را call نمی‌کند

**اگر جای دیگری API را call می‌کند:**
```javascript
// ❌ اشتباه:
fetch('createproof1', ...)
fetch('/createproof1', ...)

// ✅ درست:
fetch('/api/createproof1', ...)
```

---

## 🚀 مراحل Deploy

### 1. Commit تغییرات:
```bash
git add vercel.json api/
git commit -m "fix: simplify vercel.json for auto API route detection"
git push
```

### 2. Deploy:
```bash
vercel --prod
```

### 3. بررسی Vercel Dashboard:

**Deploy Logs باید نشان دهد:**
```
✓ Detected API routes in api/
```

یا:
```
@vercel/node matched api/createproof1.js
@vercel/node matched api/createproof.js
```

---

## 🔍 اگر هنوز 404 می‌دهد:

### چک 1: Vercel Project Settings

1. **Vercel Dashboard** → **Project** → **Settings**
2. **General**:
   - **Root Directory**: باید خالی باشد یا `./` (root پروژه)
   - **Framework Preset**: "Other" یا "Vite"
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Functions**:
   - **Node.js Version**: `22.x` (از `package.json` می‌خواند)
   - **Max Duration**: کافی باشد (مثلاً 10s)

### چک 2: بررسی Environment Variables

```bash
# در Vercel Dashboard → Settings → Environment Variables:
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
# یا:
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...  # برای write operations
```

### چک 3: Clear Cache

1. **Vercel Dashboard** → **Project** → **Settings** → **Build & Development Settings**
2. **Clear Build Cache** → Clear

### چک 4: بررسی URL دقیق در Network Tab

**در Browser Console (F12 → Network):**
1. درخواست را بزنید
2. در Network tab، خطا را پیدا کنید
3. **Request URL** را چک کنید:

```
❌ اشتباه:
https://mindvaultip.com/createproof1
https://www.mindvaultip.com/createproof1

✅ درست:
https://mindvaultip.com/api/createproof1
https://www.mindvaultip.com/api/createproof1
```

---

## 🧪 تست API Endpoint

### Test در Browser Console:

```javascript
// Test health endpoint:
fetch('/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test createproof1:
fetch('/api/createproof1', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transactionHash: '0xtest123',
    userAddress: '0xtest456'
  })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### Test با curl:

```bash
# Health check:
curl https://YOUR_DOMAIN/api/health

# Create proof:
curl -X POST https://YOUR_DOMAIN/api/createproof1 \
  -H "Content-Type: application/json" \
  -d '{"transactionHash":"0xtest","userAddress":"0xtest"}'
```

---

## 📝 Summary

✅ **تغییرات اعمال شده:**
- `vercel.json` ساده شد
- Rewrite rules بهینه شد
- فایل‌های API کامل و درست هستند

✅ **مراحل بعدی:**
1. Commit و push
2. Deploy به Vercel
3. بررسی Logs در Dashboard
4. تست با Browser Console

✅ **اگر مشکل ادامه دارد:**
- چک Project Settings
- Clear Build Cache
- بررسی Environment Variables
- بررسی Network Tab در Browser

---

**Status:** ✅ Ready for deploy

