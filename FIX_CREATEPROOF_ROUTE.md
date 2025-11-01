# ✅ Fix: CreateProof API Route

## مشکل
خطای 404 برای `/createproof` یا `/api/createproof` بعد از پرداخت.

## راه‌حل اعمال شده

### 1. ✅ API Endpoint ایجاد شد
**فایل:** `api/createproof.js`
- Endpoint: `POST /api/createproof`
- CORS headers اضافه شده
- Idempotency check (چک duplicate)
- Integration با Supabase

### 2. ✅ Vercel Config
**فایل:** `vercel.json`
- Rewrites برای API routes تنظیم شده
- SPA fallback برای سایر routes

## بررسی Frontend

بعد از بررسی کامل کد:
- ✅ **هیچ fetch به `/createproof` (بدون `/api/`) پیدا نشد**
- ✅ CreateProof.jsx از `proofClient` استفاده می‌کند (مستقیم به Supabase)
- ✅ PaymentButton.jsx فقط transaction می‌فرستد

## اگر هنوز خطا می‌بینید

### 1. Clear Browser Cache
```bash
# Hard refresh
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### 2. Rebuild & Redeploy
```bash
git add api/createproof.js vercel.json
git commit -m "fix: add createproof API endpoint"
git push
vercel --prod
```

### 3. Check Network Tab
در Browser DevTools → Network tab:
- URL دقیق که 404 می‌دهد چیست؟
- آیا `/api/createproof` است یا `/createproof` (بدون `/api/`)?

## استفاده از API (اگر نیاز بود)

اگر در آینده نیاز به استفاده از API endpoint بود:

```javascript
// ✅ درست:
fetch('/api/createproof', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    transactionHash: txHash,
    userAddress: address,
    proofData: {
      title: '...',
      // ...
    }
  })
})
.then(r => r.json())
.then(data => {
  console.log('Proof created:', data);
})
.catch(err => {
  console.error('Error:', err);
});
```

## تست

```bash
# در Console:
fetch('/api/createproof', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transactionHash: '0xtest',
    userAddress: '0xtest'
  })
})
.then(r => r.json())
.then(console.log)
```

باید response بدهد (نه 404).

