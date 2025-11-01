# ✅ Fix: Ethers v5 API Unification

## مشکل

پروژه از `ethers@5.8.0` استفاده می‌کند اما APIهای v6 (مثل `parseEther` از `viem`, `BrowserProvider`, `staticCall`) استفاده شده بود که باعث خطا می‌شد:

```
cannot call constructor directly; use BigNumber.from (version=5.x)
```

## تغییرات اعمال شده

### 1. تبدیل parseEther از viem به ethers v5
**قبل:**
```javascript
import { parseEther } from "viem";
regFeeWei = parseEther(REG_FEE);
```

**بعد:**
```javascript
// ✅ Using ethers v5
regFeeWei = ethers.utils.parseEther(REG_FEE);
```

### 2. تبدیل formatEther
**قبل:**
```javascript
ethers.formatEther(regFeeWei)
```

**بعد:**
```javascript
// ✅ ethers v5: utils.formatEther
ethers.utils.formatEther(regFeeWei)
```

### 3. تبدیل BrowserProvider به Web3Provider
**قبل:**
```javascript
const provider = new ethers.BrowserProvider(window.ethereum); // v6
const signer = await provider.getSigner(); // v6 async
```

**بعد:**
```javascript
// ✅ ethers v5: Web3Provider (not BrowserProvider)
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner(); // v5 sync
```

### 4. تبدیل staticCall به callStatic
**قبل:**
```javascript
await contract.registerProof.staticCall(...); // v6
```

**بعد:**
```javascript
// ✅ ethers v5: callStatic (not staticCall)
await contract.callStatic.registerProof(...);
```

### 5. تبدیل BigNumber operations
**قبل:**
```javascript
const gasLimit = (gasEstimate * 120n) / 100n; // bigint (v6)
const requiredBalance = ethers.parseEther(REG_FEE) + ethers.parseEther('0.0005');
```

**بعد:**
```javascript
// ✅ ethers v5: BigNumber methods
const gasLimit = gasEstimate.mul(120).div(100);
const requiredBalance = ethers.utils.parseEther(REG_FEE).add(ethers.utils.parseEther('0.0005'));
```

### 6. تبدیل chainId check
**قبل:**
```javascript
if (network.chainId !== 8453n) { // bigint (v6)
```

**بعد:**
```javascript
// ✅ ethers v5: chainId is number
if (Number(network.chainId) !== 8453) {
```

### 7. اضافه شدن Debug Logs
```javascript
console.log('[dbg] chainId=', currentNetwork.chainId.toString());
console.log('[dbg] contract code length:', contractCode.length);
console.log('[dbg] fee(wei)=', regFeeWei.toString());
console.log('[dbg] args:', { hash, ownerAddress });
```

## نتیجه

✅ همه APIها یکپارچه به ethers v5 تبدیل شدند  
✅ `callStatic` و `estimateGas` قبل از ارسال اجرا می‌شوند  
✅ `tx.wait(1)` برای 1 confirmation استفاده می‌شود  
✅ Debug logs کامل اضافه شدند  

## Files Modified

- ✅ `src/components/utils/cryptoUtils.jsx` - تبدیل کامل به ethers v5

## چک‌لیست

- [x] همه `parseEther` به `ethers.utils.parseEther` تبدیل شد
- [x] همه `formatEther` به `ethers.utils.formatEther` تبدیل شد
- [x] `BrowserProvider` به `Web3Provider` تبدیل شد
- [x] `staticCall` به `callStatic` تبدیل شد
- [x] BigNumber operations به `.mul()/.div()/.add()` تبدیل شد
- [x] `callStatic` قبل از ارسال اجرا می‌شود
- [x] `estimateGas` قبل از ارسال اجرا می‌شود
- [x] `tx.wait(1)` برای confirmation استفاده می‌شود
- [x] Debug logs اضافه شدند

