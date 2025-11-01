# ✅ Final BigNumber Fix Summary

## مشکل

خطای `cannot call constructor directly; use BigNumber.from` به دلیل:
1. استفاده از `parseEther` از `viem` (API v6) در پروژه‌ای که از `ethers v5` استفاده می‌کند
2. قاطی شدن APIهای v5 و v6

## تغییرات نهایی

### ✅ همه `parseEther` از viem به ethers v5 تبدیل شد

1. **`src/components/utils/cryptoUtils.jsx`**
   - ✅ قبلاً تبدیل شده بود - از `ethers.utils.parseEther` استفاده می‌کند

2. **`src/hooks/useContract.ts`**
   - ❌ قبل: `import { parseEther, formatEther } from 'viem'`
   - ✅ بعد: `import { ethers } from 'ethers'` + helper functions

3. **`src/utils/contractFeeChecker.ts`**
   - ❌ قبل: `import { parseEther } from 'viem'`
   - ✅ بعد: `import { ethers } from 'ethers'` + helper function

4. **`src/utils/gasConstants.ts`**
   - ❌ قبل: `import { parseEther } from "viem"`
   - ✅ بعد: `import { ethers } from 'ethers'` + استفاده از `ethers.utils.parseEther`

### ✅ استفاده از `BigNumber.from()` (نه constructor)

- ✅ همه جا از `ethers.BigNumber.from()` استفاده می‌شود (اگر نیاز به تبدیل باشد)
- ✅ Contract calls به طور مستقیم BigNumber برمی‌گردانند - نیاز به تبدیل نیست

### ✅ formatEther به صورت safe

- ✅ همیشه `toString()` قبل از `formatEther` برای جلوگیری از constructor calls

## چک‌لیست نهایی

- [x] **ethers یک‌دست**: `^5.8.0` در `package.json`
- [x] **حذف همه `new BigNumber(...)`**: هیچ استفاده از constructor پیدا نشد
- [x] **استفاده از `ethers.utils.parseEther`**: همه فایل‌ها تبدیل شدند
- [x] **استفاده از `BigNumber.from()`**: فقط در جاهایی که نیاز است
- [x] **callStatic و estimateGas**: قبل از send اجرا می‌شوند
- [x] **await tx.wait(1)**: بعد از ارسال برای confirmation
- [x] **لاگ chainId = 8453**: اضافه شده
- [x] **Build موفق**: ✓ built in 1m 9s

## نتیجه

✅ خطای "cannot call constructor directly" باید رفع شده باشد  
✅ همه `parseEther` از `ethers.utils.parseEther` استفاده می‌کنند  
✅ هیچ استفاده از constructor در کد وجود ندارد  
✅ Build موفق است  

## تست

اگر هنوز خطا می‌بینی، این اسنیپت را در console اجرا کن:

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

اگر هنوز خطای BigNumber می‌بینی، یعنی جایی در کد یا console script هنوز `new BigNumber()` استفاده شده - باید پیدا و رفع شود.

