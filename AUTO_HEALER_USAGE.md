# 🛠️ Auto Healer - راهنمای استفاده

## فایل اضافه شده

### ✅ `src/autoHealer.js`
سیستم خودکار ترمیم برای خطاهای رایج:
- ✅ Retry هوشمند برای درخواست‌های ناموفق
- ✅ نرمال‌سازی URLهای API
- ✅ Fallback برای 404های Vercel functions
- ✅ JSON parse امن
- ✅ ترمیم BigNumber/ethers errors
- ✅ Switch خودکار به Base network

### ✅ `src/main.jsx`
Import اضافه شده: `import './autoHealer.js'`

## قابلیت‌ها

### 1. 🔄 Retry هوشمند
```javascript
// برای status codes: 408, 425, 429, 500, 502, 503, 504
// 3 بار retry با exponential backoff
fetch('/api/endpoint');
// → اگر 500 بدهد، 3 بار دوباره تلاش می‌کند
```

### 2. 🔗 نرمال‌سازی URL
```javascript
// خودکار /api/createproof را به کامل تبدیل می‌کند
fetch('/api/createproof');
// → https://mindvaultip.com/api/createproof
```

### 3. 🔄 Fallback برای 404
```javascript
// اگر /api/foo/bar 404 بدهد، /api/bar را امتحان می‌کند
fetch('/api/createproof/nested');
// → اگر 404: تلاش به /api/nested
```

### 4. 🛡️ Safe JSON Parse
```javascript
// استفاده:
const data = await window.safeJson(response);
// → اگر JSON parse fail شود، object با parseError برمی‌گرداند
```

### 5. 💰 Ethers.js Self-Heal

#### ترمیم BigNumber:
```javascript
// خودکار override برای fee
window.__FEE_WEI_OVERRIDE__ // '1000000000000000' (0.001 ETH)
```

#### تبدیل امن:
```javascript
const feeWei = window.__FEE_WEI_OVERRIDE__ ?? 
               window.ethHeal.toWeiSafe(inputFee);
```

#### Switch به Base Network:
```javascript
// قبل از تراکنش:
await window.ethHeal?.ensureBaseNetwork();
```

## استفاده در کد

### مثال: استفاده از Fee Override
```javascript
// در کد پرداخت:
const feeWei = window.__FEE_WEI_OVERRIDE__ ?? 
               (window.ethHeal ? window.ethHeal.toWeiSafe(inputFee) : String(inputFee));

// استفاده:
const tx = await contract.registerProof(fileHash, title, {
  value: feeWei
});
```

### مثال: Switch Network قبل از تراکنش
```javascript
// در cryptoUtils.jsx یا PaymentButton:
await window.ethHeal?.ensureBaseNetwork();

// سپس تراکنش را ارسال کن
const tx = await contract.registerProof(...);
```

### مثال: Safe JSON Parse
```javascript
const response = await fetch('/api/createproof', {...});
const data = await window.safeJson(response);

if (data.parseError) {
  console.error('Failed to parse JSON:', data.body);
  // fallback logic
} else {
  // use data
}
```

## خطاهایی که خودکار ترمیم می‌شوند

### 1. BigNumber Constructor Error
```
Error: cannot call constructor directly; use BigNumber.from
```
**ترمیم:** `window.__FEE_WEI_OVERRIDE__` تنظیم می‌شود

### 2. Fee Not Readable
```
Error: Could not read fee
```
**ترمیم:** `window.__USE_FIXED_FEE__ = true` + override

### 3. Network Mismatch
```javascript
// اگر روی chain دیگری باشد:
await window.ethHeal?.ensureBaseNetwork();
// → خودکار switch به Base (8453)
```

### 4. API 404
```
GET /api/createproof/nested → 404
```
**ترمیم:** تلاش به `/api/nested` (fallback)

### 5. Temporary Server Errors (500, 502, 503)
```javascript
// خودکار retry با exponential backoff
// 300ms, 600ms, 1200ms
```

## تنظیمات

در `autoHealer.js`:
```javascript
const CFG = {
  API_BASE: location.origin,
  RETRY_STATUS: [408, 425, 429, 500, 502, 503, 504],
  RETRIES: 3,                    // تعداد retry
  BASE_CHAIN_ID: 8453,            // Base mainnet
  FALLBACK_FEE_WEI: '1000000000000000',  // 0.001 ETH
};
```

## مثال کامل

```javascript
// در CreateProof.jsx یا PaymentButton:
const handlePayment = async () => {
  // 1. Switch به Base network
  await window.ethHeal?.ensureBaseNetwork();
  
  // 2. استفاده از fee override (اگر BigNumber error داشتیم)
  const feeWei = window.__FEE_WEI_OVERRIDE__ ?? 
                 window.ethHeal?.toWeiSafe(0.001) ?? 
                 '1000000000000000';
  
  // 3. ارسال تراکنش
  const tx = await contract.registerProof(fileHash, title, {
    value: feeWei
  });
  
  // 4. Wait for confirmation
  await tx.wait(1);
  
  // 5. API call (با retry خودکار)
  const response = await fetch('/api/createproof', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionHash: tx.hash })
  });
  
  // 6. Safe JSON parse
  const data = await window.safeJson(response);
  
  if (data.parseError) {
    console.error('Failed to parse response');
  } else {
    console.log('Success:', data);
  }
};
```

## نکات مهم

1. **Non-blocking**: Healer مانع اجرای کد نمی‌شود
2. **Fallback-only**: فقط برای خطاهای رایج کار می‌کند
3. **Performance**: Retry ها فقط برای status codes خاص
4. **Override flags**: `window.__FEE_WEI_OVERRIDE__` و `window.__USE_FIXED_FEE__`

## تست

```javascript
// در Console:
// 1. تست retry
fetch('/api/test-500'); // → 3 بار retry می‌کند

// 2. تست fallback
fetch('/api/createproof/test'); // → اگر 404: /api/test

// 3. تست BigNumber override
throw new Error('cannot call constructor directly; use BigNumber.from');
// → console.warn: '[autoHealer] BigNumber issue detected'

// 4. تست network switch
await window.ethHeal?.ensureBaseNetwork();
```

همه چیز آماده است! ✅

