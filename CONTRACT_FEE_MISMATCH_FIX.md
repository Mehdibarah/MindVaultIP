# 🔧 Fix: Contract Registration Fee Mismatch

## مشکل

MetaMask هشدار می‌دهد: **"This transaction is likely to fail"**

### علت
- فرانت: `0.001 ETH` می‌فرستد ✅
- کانترکت: `1.0 ETH` انتظار دارد ❌
- نتیجه: تراکنش revert می‌شود

## تشخیص مشکل

### روش 1: چک در Console مرورگر

```javascript
// در console مرورگر این را اجرا کن:
const { createPublicClient, http } = await import('viem');
const { base } = await import('wagmi/chains');

const publicClient = createPublicClient({
  chain: base,
  transport: http()
});

// آدرس کانترکت را از .env بگیر
const contractAddress = '0xYOUR_CONTRACT_ADDRESS';

// اگر تابع regFee() یا registrationFee() داره:
const regFeeWei = await publicClient.readContract({
  address: contractAddress,
  abi: [{ name: 'registrationFee', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] }],
  functionName: 'registrationFee'
});

// تبدیل به ETH:
const regFeeEth = Number(regFeeWei) / 1e18;
console.log('Contract expects:', regFeeEth, 'ETH');

// فرانت می‌خواهد بفرستد:
const frontendFee = 0.001;
console.log('Frontend sends:', frontendFee, 'ETH');

if (regFeeEth !== frontendFee) {
  console.error('❌ MISMATCH! Contract expects', regFeeEth, 'but frontend sends', frontendFee);
}
```

### روش 2: استفاده از اسکریپت

```bash
node check-contract-fee.js
```

## راه‌حل

### گزینه 1: تغییر Fee در کانترکت (اگر تابع دارد)

اگر کانترکت تابع `setRegistrationFee(uint256)` دارد:

```javascript
// از حساب Founder در console مرورگر:
const { createWalletClient, http } = await import('viem');
const { base } = await import('wagmi/chains');
const { privateKeyToAccount } = await import('viem/accounts');

// حساب Founder
const account = privateKeyToAccount('0xYOUR_FOUNDER_PRIVATE_KEY');

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http()
});

// 0.001 ETH = 1_000_000_000_000_000 wei
const newFee = 1_000_000_000_000_000n;

const hash = await walletClient.writeContract({
  address: '0xYOUR_CONTRACT_ADDRESS',
  abi: [{ 
    name: 'setRegistrationFee', 
    type: 'function', 
    stateMutability: 'nonpayable',
    inputs: [{ name: '_fee', type: 'uint256' }],
    outputs: []
  }],
  functionName: 'setRegistrationFee',
  args: [newFee]
});

console.log('Transaction hash:', hash);
```

### گزینه 2: Deploy مجدد کانترکت

اگر کانترکت immutable است:

1. کانترکت جدید deploy کن با fee = `0.001 ETH`:
   ```solidity
   uint256 public constant registrationFee = 0.001 ether; // 1_000_000_000_000_000 wei
   ```

2. آدرس جدید را در `.env` بگذار:
   ```env
   VITE_CONTRACT_ADDRESS=0xNewContractAddress
   ```

3. در Vercel → Environment Variables → Redeploy

## چک کردن مقدار درست

```javascript
// 0.001 ETH در wei:
const correctFee = 0.001 * 1e18; // = 1_000_000_000_000_000 wei

// اگر کانترکت این مقدار را دارد:
const contractFee = 1000000000000000000n; // 1 ETH
console.log('Contract fee in ETH:', Number(contractFee) / 1e18); // 1.0

// باید باشد:
console.log('Should be:', 0.001);
```

## تست بعد از Fix

1. در سایت → Create Proof
2. Pay را بزن
3. MetaMask باید **بدون هشدار** باز شود
4. Network fee باید **منطقی** باشد (~$0.01-0.05)
5. تراکنش باید **موفق** شود

## فایل‌های مرتبط

- `src/lib/contracts.ts` - تنظیمات fee
- `src/hooks/useContract.ts` - hook پرداخت
- `src/utils/paymentUtils.ts` - تابع پرداخت
- `.env` - آدرس کانترکت و fee

