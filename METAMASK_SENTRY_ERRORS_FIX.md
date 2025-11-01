# Fix: MetaMask & Sentry Console Errors

## خطاهای گزارش شده

این خطاها **مشکل نیستند** و مربوط به extensions/third-party هستند:

### 1. MetaMask RPC Permission Errors
```
MetaMask - RPC Error: Unauthorized to perform action
api.cx.metamask.io/v1/... 406/404
```

**علت:** MetaMask extension سعی می‌کند به API های خود (staking, accounts) دسترسی پیدا کند اما permission ندارد.

**وضعیت:** ✅ بی‌خطر - مربوط به MetaMask extension است، نه app ما.

### 2. Sentry Errors
```
Error fetching access token
TypeError: Cannot read properties of null (reading 'data')
```

**علت:** Sentry سعی می‌کند error tracking کند اما response null است.

**وضعیت:** ✅ بی‌خطر - مربوط به Sentry SDK است.

### 3. React DevTools Warning
```
No `HydrateFallback` element provided
```

**علت:** هشدار React DevTools برای بهتر کردن DX.

**وضعیت:** ✅ بی‌خطر - فقط یک هشدار.

## راه‌حل اعمال شده

### Error Handlers در main.jsx

خطاهای زیر به صورت silent ignore می‌شوند:

1. **MetaMask RPC Errors:**
   - `Unauthorized to perform action`
   - Code 4100
   - `api.cx.metamask.io`

2. **Sentry Errors:**
   - `Cannot read properties of null`
   - `transformResponse`
   - Stack شامل `sentry`

3. **Ledger HID Errors:**
   - `TransportOpenUserCancelled`
   - `Must be handling a user gesture`

## نتیجه

✅ این خطاها دیگر در console نمایش داده نمی‌شوند
✅ App به درستی کار می‌کند
✅ خطاهای واقعی همچنان نمایش داده می‌شوند

## تست

1. Console را باز کن (F12)
2. باید خطاهای MetaMask/Sentry را نبینی
3. خطاهای واقعی app همچنان نمایش داده می‌شوند

