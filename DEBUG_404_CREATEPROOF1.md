# 🔍 Debug: خطای 404 برای createproof1

## ✅ وضعیت فایل API

**فایل:** `api/createproof1.js` ✅ موجود است

**محتوای فایل:** 
- ✅ Export default handler دارد
- ✅ CORS headers اضافه شد
- ✅ POST method validation دارد
- ✅ Supabase integration دارد

---

## 🔍 بررسی Frontend

**نتیجه جستجو:** 
- ❌ هیچ فایل frontend پیدا نشد که `createproof1` را call کند
- ✅ Frontend از `ProofClient` استفاده می‌کند (مستقیماً به Supabase متصل می‌شود)

---

## 🎯 علت احتمالی خطای 404

### 1. Frontend Build قدیمی
**مشکل:** فایل build شده هنوز کد قدیمی دارد که `/createproof1` را call می‌کند.

**راه‌حل:**
```bash
# پاک کردن build قدیمی
rm -rf dist .next

# Build جدید
npm run build

# یا در dev mode
npm run dev
```

### 2. خطای Runtime در Browser
**مشکل:** کد در browser console یا network tab نشان می‌دهد `/createproof1` بدون `/api/` فراخوانی می‌شود.

**چک کنید:**
1. Browser Console را باز کنید (F12)
2. Network tab را باز کنید
3. دکمه پرداخت را بزنید
4. در Network tab، خطایی که `/createproof1` را call می‌کند پیدا کنید
5. Request URL را چک کنید:
   - ❌ `http://localhost:3000/createproof1` (بدون `/api/`)
   - ✅ `http://localhost:3000/api/createproof1` (درست)

### 3. فایل API در Vercel Deploy نشده
**مشکل:** فایل محلی وجود دارد اما در Vercel deploy نشده.

**راه‌حل:**
```bash
# Push به git
git add api/createproof1.js
git commit -m "fix: add createproof1 API endpoint"
git push

# یا مستقیماً deploy
vercel --prod
```

---

## ✅ تست Local

### 1. تست با curl

```bash
curl -X POST http://localhost:3000/api/createproof1 \
  -H "Content-Type: application/json" \
  -d '{
    "transactionHash": "0xtest123",
    "userAddress": "0xabc123",
    "amount": "0.001"
  }'
```

**پاسخ مورد انتظار:**
```json
{
  "success": true,
  "message": "Proof created successfully",
  "proofId": "proof_...",
  "transactionHash": "0xtest123",
  ...
}
```

### 2. تست در Browser Console

```javascript
fetch('/api/createproof1', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    transactionHash: '0xtest123',
    userAddress: '0xabc123',
    amount: '0.001'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

---

## 📋 چک‌لیست کامل

- [x] فایل `api/createproof1.js` وجود دارد
- [x] CORS headers اضافه شد
- [x] Export default handler دارد
- [ ] Frontend از این API استفاده می‌کند؟ (نیافت)
- [ ] Build جدید انجام شده؟
- [ ] Vercel deploy شده؟
- [ ] Browser cache پاک شده؟

---

## 🎯 مراحل بعدی

1. **اگر frontend این API را call می‌کند:**
   - مسیر را چک کنید: باید `/api/createproof1` باشد (نه `/createproof1`)
   - Build جدید بگیرید

2. **اگر frontend از Supabase استفاده می‌کند:**
   - خطای 404 برای `createproof1` ممکن است از جای دیگری باشد
   - Network tab را چک کنید تا ببینید دقیقاً کجا call می‌شود

3. **اگر هنوز مشکل دارید:**
   - Screenshot از Network tab بفرستید
   - خطای دقیق console را کپی کنید
   - Request URL و Status code را نشان دهید

---

## 💡 نکته مهم

Frontend فعلی از `ProofClient` استفاده می‌کند که مستقیماً به Supabase متصل می‌شود. اگر خطای 404 برای `createproof1` می‌دهد، ممکن است:

1. کد قدیمی در browser cache باشد
2. یا در جایی از کد که پیدا نکردیم، این API call می‌شود

**راه‌حل سریع:**
```bash
# Hard refresh در browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# یا Incognito mode امتحان کنید
```

