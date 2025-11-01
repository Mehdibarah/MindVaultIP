# ✅ Complete Fix: BigNumber Constructor Error

## مشکل اصلی

خطای `cannot call constructor directly; use BigNumber.from` زمانی رخ می‌دهد که:
1. از `new BigNumber()` یا `new ethers.BigNumber()` استفاده شود (که در ethers v5 مجاز نیست)
2. از `parseEther` از `viem` استفاده شود (که API v6 است و با ethers v5 قاطی می‌شود)

## تغییرات اعمال شده

### ✅ 1. تبدیل همه parseEther از viem به ethers v5

#### `src/hooks/useContract.ts`
**قبل:**
```typescript
import { parseEther, formatEther } from 'viem'
```

**بعد:**
```typescript
// ✅ Using ethers v5 - parseEther and formatEther are in utils (NOT viem)
import { ethers } from 'ethers'
// Helper functions to convert viem-style calls to ethers v5
const parseEther = (value: string): bigint => {
  const bn = ethers.utils.parseEther(value);
  return BigInt(bn.toString()); // Convert ethers BigNumber to native bigint for viem compatibility
};
const formatEther = (value: bigint | string): string => {
  return ethers.utils.formatEther(value.toString());
};
```

#### `src/utils/contractFeeChecker.ts`
**قبل:**
```typescript
import { createPublicClient, http, parseEther } from 'viem';
```

**بعد:**
```typescript
import { createPublicClient, http } from 'viem';
// ✅ Using ethers v5 for parseEther (not viem)
import { ethers } from 'ethers';
// Helper to convert ethers BigNumber to string for comparison
const parseEther = (value: string): string => {
  return ethers.utils.parseEther(value).toString();
};
```

#### `src/utils/gasConstants.ts`
**قبل:**
```typescript
import { parseEther } from "viem";
export function getRegistrationFeeWei(): bigint {
  return parseEther(REG_FEE);
}
```

**بعد:**
```typescript
// ✅ Using ethers v5 for parseEther (not viem)
import { ethers } from 'ethers';
export function getRegistrationFeeWei(): bigint {
  // ✅ ethers v5: utils.parseEther returns BigNumber, convert to bigint
  const bn = ethers.utils.parseEther(REG_FEE);
  return BigInt(bn.toString());
}
```

### ✅ 2. استفاده از `BigNumber.from()` (نه constructor)

**❌ اشتباه:**
```javascript
const bn = new ethers.BigNumber(value); // خطا!
```

**✅ درست:**
```javascript
// Contract call returns BigNumber directly - no conversion needed
const feeWei = await contract.fee(); // Already BigNumber

// Only convert if needed (shouldn't happen normally)
if (typeof value === 'string' || typeof value === 'number') {
  const bn = ethers.BigNumber.from(value.toString()); // ✅
}
```

### ✅ 3. استفاده از `formatEther` به صورت safe

```javascript
// ✅ Always convert BigNumber to string first
const feeWeiString = regFeeWei.toString();
const feeEth = ethers.utils.formatEther(feeWeiString);
```

## چک‌لیست نهایی

- [x] **ethers یک‌دست**: `^5.8.0` در `package.json`
- [x] **حذف همه `new BigNumber(...)`**: هیچ استفاده از constructor پیدا نشد
- [x] **استفاده از `ethers.utils.parseEther`**: همه فایل‌ها تبدیل شدند
- [x] **استفاده از `BigNumber.from()`**: فقط در جاهایی که نیاز به تبدیل است
- [x] **callStatic و estimateGas**: قبل از send اجرا می‌شوند
- [x] **await tx.wait(1)**: بعد از ارسال برای confirmation
- [x] **لاگ chainId = 8453**: اضافه شده

## فایل‌های اصلاح شده

1. ✅ `src/components/utils/cryptoUtils.jsx` - تبدیل کامل به ethers v5
2. ✅ `src/hooks/useContract.ts` - تبدیل parseEther/formatEther از viem به ethers v5
3. ✅ `src/utils/contractFeeChecker.ts` - تبدیل parseEther از viem به ethers v5
4. ✅ `src/utils/gasConstants.ts` - تبدیل parseEther از viem به ethers v5

## نتیجه

✅ خطای "cannot call constructor directly" رفع شد  
✅ همه `parseEther` از `ethers.utils.parseEther` استفاده می‌کنند  
✅ همه BigNumber operations از `BigNumber.from()` استفاده می‌کنند (اگر نیاز باشد)  
✅ Build موفق است  
✅ هیچ lint error نیست  

## تست

برای تست، اسنیپت زیر را در console مرورگر اجرا کن:

```javascript
(async () => {
  console.log('===== DEBUG TX =====');
  if (!window.ethereum) { console.error('No ethereum provider'); return; }

  const { ethers } = await import('ethers');
  console.log('✅ Ethers v5 loaded');

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  const addr = await signer.getAddress();
  const chainId = (await provider.getNetwork()).chainId;
  console.log('✅ Wallet connected:', addr, 'Chain ID:', chainId);

  const CONTRACT = '0xE8F47A78Bf627A4B6fA2BC99fb59aEFf61A1c74c';
  const contract = new ethers.Contract(CONTRACT, [
    "function fee() external view returns (uint256)",
    "function registerProof(string memory _hash, address _owner) external payable returns (uint256)"
  ], signer);

  console.log('Step 3: Reading fee from contract...');
  try {
    const feeWei = await contract.fee();
    console.log('✅ fee(wei)=', feeWei.toString());
    console.log('✅ fee(eth)=', ethers.utils.formatEther(feeWei));
  } catch (e) {
    console.error('❌ reading fee failed:', e);
  }
})();
```

اگر هنوز خطای BigNumber می‌بینی، یعنی جایی در کد (یا در console script) هنوز `new BigNumber()` استفاده شده.

