# ✅ Fix: BigNumber Constructor Error

## مشکل

```
Error: cannot call constructor directly; use BigNumber.from (operation="new (BigNumber)", code=UNSUPPORTED_OPERATION, version=bignumber/5.8.0)
```

این خطا زمانی رخ می‌دهد که:
1. جایی از `new BigNumber()` یا `new ethers.BigNumber()` استفاده شده (که در ethers v5 مجاز نیست)
2. یا مقدار برگشته از contract call به درستی به BigNumber تبدیل نشده

## راه‌حل

### ✅ استفاده از `BigNumber.from()` (نه constructor)

**❌ اشتباه:**
```javascript
const bn = new ethers.BigNumber(value); // خطا!
```

**✅ درست:**
```javascript
const bn = ethers.BigNumber.from(value.toString()); // ✅
```

### ✅ Contract Call Results

در ethers v5، وقتی از contract یک view function صدا می‌زنیم (مثل `contract.fee()`):
- نتیجه به صورت **BigNumber** برمی‌گردد
- نیاز به تبدیل ندارد
- فقط باید مطمئن شویم که درست استفاده می‌شود

```javascript
// ✅ Contract call returns BigNumber directly
let regFeeWei = await contract.fee();

// ✅ formatEther accepts BigNumber (or string)
const feeEth = ethers.utils.formatEther(regFeeWei.toString());

// ✅ parseEther returns BigNumber
regFeeWei = ethers.utils.parseEther(REG_FEE);
```

### ✅ Safe Conversion

اگر نیاز به تبدیل داریم:

```javascript
// ✅ Safe conversion using from()
if (typeof regFeeWei === 'string' || typeof regFeeWei === 'number' || typeof regFeeWei === 'bigint') {
  regFeeWei = ethers.BigNumber.from(regFeeWei.toString());
}

// ✅ Check if already BigNumber (has _hex property)
if (regFeeWei._hex || typeof regFeeWei === 'object') {
  // Already BigNumber - use as is
}
```

## تغییرات اعمال شده

1. ✅ تبدیل `formatEther` به صورت safe (با toString())
2. ✅ تبدیل مقدار contract call به BigNumber با `BigNumber.from()` (نه constructor)
3. ✅ اضافه شدن try-catch برای conversion
4. ✅ Fallback به `parseEther` اگر conversion fail شود

## نتیجه

✅ خطای "cannot call constructor directly" رفع شد  
✅ همه BigNumber operations از `BigNumber.from()` استفاده می‌کنند  
✅ Contract calls به درستی handle می‌شوند  

