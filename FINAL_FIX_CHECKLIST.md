# ✅ Final Fix Checklist

## مشکل A: 404 برای "createproof"

### ✅ بررسی انجام شد
```bash
grep -rn --include="*.jsx" --include="*.js" "['\"]createproof" src public
```

**نتیجه:** هیچ موردی پیدا نشد که "createproof" بدون `/` استفاده شده باشد.

همه لینک‌ها از `createPageUrl()` استفاده می‌کنند که مسیر درست را می‌دهد.

### ✅ vercel.json ساده شد
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
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**نکته:** SPA fallback آخر است (`/(.*)`) که همه routes (به جز storage) را به `index.html` می‌برد.

---

## مشکل B: "This transaction is likely to fail"

### ✅ Preflight Check اضافه شد

در `src/components/utils/cryptoUtils.jsx`:

```javascript
// 1. Preflight: simulate transaction
await contract.registerProof.callStatic(hash, ownerAddress, { value: regFeeWei });

// 2. Estimate gas
const gasEstimate = await contract.registerProof.estimateGas(hash, ownerAddress, { value: regFeeWei });

// 3. Send with gas buffer
const tx = await contract.registerProof(hash, ownerAddress, {
  value: regFeeWei,
  gasLimit: (gasEstimate * 120n) / 100n  // 20% buffer
});
```

### ✅ Error Handling
- اگر `callStatic` fail شود → error message واضح نمایش داده می‌شود
- User می‌داند چرا تراکنش fail می‌شود (fee mismatch, permissions, etc.)

---

## چک‌لیست نهایی

- [x] vercel.json - SPA fallback آخر است
- [x] هیچ "createproof" بدون `/` پیدا نشد
- [x] Preflight check با `callStatic` اضافه شد
- [x] Gas estimation با buffer اضافه شد
- [x] Error handling بهتر شد

## بعد از Deploy

1. **تست 404:**
   - `https://mindvaultip.com/createproof` → باید SPA route شود (نه 404)

2. **تست Preflight:**
   - اگر fee mismatch باشد → error message واضح می‌بیند
   - اگر همه چیز درست باشد → MetaMask بدون "likely to fail" باز می‌شود

3. **تست Storage:**
   - `https://mindvaultip.com/storage/v1/object/public/proofs/...` → باید فایل برگرداند

## اگر هنوز مشکل دارد

### برای 404:
- در Network tab → URL دقیق که 404 می‌دهد را پیدا کن
- چک کن که در Sources → createproof وجود دارد (نه 404.html)

### برای "likely to fail":
- در Console → preflight error message را ببین
- معمولاً می‌گوید: "Transaction will fail: revert reason..."

