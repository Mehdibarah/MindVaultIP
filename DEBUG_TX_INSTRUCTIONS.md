# 🔍 راهنمای استفاده از اسکریپت دیباگ تراکنش

## هدف

این اسکریپت برای تشخیص دقیق مشکل در registration transaction استفاده می‌شود. همه مراحل را شفاف لاگ می‌کند تا دقیقاً ببینیم کجا fail می‌شود.

## نحوه استفاده

### 1. باز کردن DevTools
- در مرورگر، `F12` یا `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- تب **Console** را باز کن

### 2. اطمینان از نصب MetaMask
- MetaMask باید نصب شده باشد
- Wallet باید به Base Mainnet متصل باشد (Chain ID: 8453)

### 3. اجرای اسکریپت
- فایل `debug-tx-complete.js` را باز کن
- محتوای کامل را کپی کن
- در Console پیست کن و Enter بزن

### 4. مشاهده نتایج
اسکریپت به ترتیب این مراحل را انجام می‌دهد:

1. **Connecting to wallet** - اتصال به MetaMask
2. **Setting up contract** - ساخت contract instance
3. **Reading fee** - خواندن fee از contract یا fallback
4. **Preflight check (staticCall)** - شبیه‌سازی تراکنش
5. **Estimating gas** - برآورد گس
6. **Sending transaction** - ارسال تراکنش (MetaMask popup باز می‌شود)
7. **Waiting for confirmation** - انتظار برای receipt
8. **Analyzing receipt** - بررسی status و logs
9. **Parsing event logs** - parse کردن events

## تفسیر نتایج

### ✅ اگر staticCall موفق شود:
```
✅ staticCall OK - transaction will NOT fail on blockchain
```
این یعنی تراکنش در blockchain fail نمی‌شود. اگر MetaMask هنوز "likely to fail" می‌دهد، فقط یک هشدار محافظه‌کارانه است.

### ❌ اگر staticCall fail شود:
```
❌ staticCall REVERTED!
   Reason: ...
```
این یعنی تراکنش واقعاً revert می‌شود. دلایل احتمالی:
- Fee mismatch (مقدار ارسالی ≠ مقدار مورد انتظار contract)
- Validation failed (hash/owner invalid)
- Contract state (paused, permissions, etc.)

### ⚠️ اگر estimateGas fail شود:
```
❌ estimateGas FAILED!
```
معمولاً یعنی staticCall هم fail شده (همان مشکل بالا).

### ♻️ اگر TRANSACTION_REPLACED:
```
♻️ Transaction was REPLACED
```
کاربر در MetaMask "Speed Up" یا "Cancel" زده. اسکریپت خودش replacement را track می‌کند.

### ✅ اگر receipt.status === 1:
```
✅ Transaction SUCCESSFUL
```
تراکنش با موفقیت confirm شده. اگر UI شما هنوز سبز نمی‌شود، مشکل در state management است.

## خروجی مورد نیاز برای دیباگ

اگر مشکل ادامه دارد، این 3 مورد را بفرست:

1. **staticCall output:**
   ```
   ✅ staticCall OK
   یا
   ❌ staticCall REVERTED: [reason]
   ```

2. **Fee & Gas:**
   ```
   ✅ Fee from contract: [value] wei = [ETH] ETH
   ✅ Gas estimate: [value] units
   یا
   ❌ estimateGas FAILED: [error]
   ```

3. **Receipt summary:**
   ```
   Status: [0 or 1]
   Transaction Hash: [hash]
   Block Number: [number]
   ```

## تنظیمات

قبل از اجرا، این مقادیر را در اسکریپت چک کن:

```javascript
const CONTRACT = "0xE8F47A78Bf627A4B6fA2BC99fb59aEFf61A1c74c"; // آدرس contract
const FILE_HASH = "0x" + "a".repeat(64); // hash نمونه (یا hash واقعی)
const FALLBACK_FIXED_FEE = "1000000000000000"; // 0.001 ETH
```

اگر contract آدرس یا ABI متفاوت است، آن‌ها را update کن.

## عیب‌یابی رایج

### Error: "Ethers not found"
- صفحه را refresh کن
- مطمئن شو MetaMask نصب است
- اگر از ethers v6 استفاده می‌کنی، باید `ethers` در window موجود باشد

### Error: "Wrong network"
- در MetaMask به Base Mainnet (Chain ID: 8453) switch کن

### Error: "Transaction rejected"
- کاربر در MetaMask Cancel زده
- دوباره اجرا کن و این بار Confirm بزن

## نکات

- این اسکریپت یک تراکنش واقعی ارسال می‌کند (اگر Confirm بزنی)
- اگر فقط می‌خواهی تست کنی، قبل از Step 6 (Sending transaction) متوقف کن
- برای تست بدون هزینه، از testnet استفاده کن (اما CONTRACT آدرس را تغییر بده)

