# ✅ Fix: Payment & 404 Errors

## مشکلات شناسایی شده

### 1. ❌ خطای 404: `createproof1` پیدا نشد
**علت:** API endpoint `/api/createproof1` وجود نداشت

### 2. ⚠️ Contract fee قابل خواندن نیست  
**علت:** تابع `fee()` در لیست توابع ممکن اضافه نشده بود

---

## راه‌حل‌های اعمال شده

### ✅ 1. ایجاد API Endpoint: `api/createproof1.js`

**مسیر:** `api/createproof1.js`

**عملکرد:**
- دریافت `transactionHash` و `userAddress` از request body
- ایجاد proof record در Supabase
- Idempotency check (اگر proof با همان transactionHash وجود دارد، برمی‌گرداند)
- Error handling کامل

**استفاده:**
```javascript
// POST /api/createproof1
{
  "transactionHash": "0x...",
  "userAddress": "0x...",
  "amount": "0.001",
  // Optional:
  "title": "...",
  "category": "invention",
  "fileHash": "...",
  ...
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Proof created successfully",
  "proofId": "proof_...",
  "transactionHash": "0x...",
  "proof": { ... }
}
```

### ✅ 2. بهبود Contract Fee Checker

**تغییرات:**
- اضافه شدن `'fee'` به ابتدای لیست توابع ممکن
- حالا ابتدا `fee()` را امتحان می‌کند (رایج‌ترین نام)

**قبل:**
```typescript
const possibleFunctions = [
  'registrationFee',
  'regFee',
  ...
];
```

**بعد:**
```typescript
const possibleFunctions = [
  'fee', // ✅ Try 'fee' first
  'registrationFee',
  'regFee',
  ...
];
```

### ✅ 3. بهبود `check-contract-fee.js`

همان تغییرات در اسکریپت Node.js اعمال شد.

---

## تست

### 1. تست Contract Fee

```bash
# اجرای اسکریپت چک کردن fee
node check-contract-fee.js
```

**انتظار:**
- اگر contract `fee()` دارد → باید خوانده شود ✅
- اگر ندارد → warning نمایش داده می‌شود (طبیعی است)

### 2. تست API Endpoint

```bash
# با curl:
curl -X POST http://localhost:3000/api/createproof1 \
  -H "Content-Type: application/json" \
  -d '{
    "transactionHash": "0x123...",
    "userAddress": "0xabc...",
    "amount": "0.001"
  }'
```

**انتظار:**
```json
{
  "success": true,
  "proofId": "proof_...",
  "transactionHash": "0x123...",
  "proof": { ... }
}
```

### 3. تست در Frontend

در Console مرورگر:
```javascript
// تست API endpoint
fetch('/api/createproof1', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transactionHash: '0x...',
    userAddress: '0x...',
    amount: '0.001'
  })
})
.then(r => r.json())
.then(console.log);
```

---

## متغیرهای Environment

```bash
# .env (برای Vercel)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# برای Node.js scripts
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx

# Contract
CONTRACT_ADDRESS=0xE8F47A78Bf627A4B6fA2BC99fb59aEFf61A1c74c
VITE_CONTRACT_ADDRESS=0xE8F47A78Bf627A4B6fA2BC99fb59aEFf61A1c74c
VITE_REG_FEE_ETH=0.001
```

---

## چک‌لیست

- [x] API endpoint `api/createproof1.js` ایجاد شد
- [x] Contract fee checker بهبود یافت (`fee()` اضافه شد)
- [x] Script `check-contract-fee.js` بهبود یافت
- [x] Idempotency در API endpoint پیاده‌سازی شد
- [x] Error handling کامل اضافه شد
- [x] Build موفق است

---

## نتیجه

✅ API endpoint `/api/createproof1` آماده استفاده است  
✅ Contract fee checker حالا `fee()` را هم امتحان می‌کند  
✅ Idempotency برای جلوگیری از duplicate proofs  
✅ Error handling کامل  

**نکته:** Frontend فعلاً مستقیماً از Supabase ProofClient استفاده می‌کند، اما این API endpoint برای مواردی که نیاز به API call است، آماده است.

