# 🔧 Troubleshooting: 404 Error & Transaction Failure

## مشکلات گزارش شده

1. **Failed to load resource: 404**
2. **"This transaction is likely to fail"** در MetaMask

## تشخیص مشکل 404

### مرحله 1: پیدا کردن Resource که 404 می‌دهد

1. **باز کن Console (F12)**
2. **Tab "Network" را باز کن**
3. **404 error را پیدا کن** - روی آن کلیک کن
4. **URL را کپی کن** - این نشان می‌دهد چه resource ای مشکل دارد

### احتمال‌های رایج:

#### 1. فایل Storage (Supabase)
```
URL: https://xxx.supabase.co/storage/v1/object/public/proofs/...
Status: 404
```

**راه‌حل:**
```javascript
// در Console اجرا کن:
const proofId = 'YOUR_PROOF_ID';
const { data: files } = await window.__sb.storage
  .from('proofs')
  .list(proofId, { limit: 100 });

console.log('Files in proofId:', files);

// اگر فایل نیست → مشکل آپلود
// اگر فایل هست → مشکل URL encoding یا RLS policy
```

#### 2. API Endpoint
```
URL: https://www.mindvaultip.com/api/...
Status: 404
```

**راه‌حل:**
- چک کن که endpoint در production موجود است
- یا endpoint deprecated شده و باید به endpoint جدید تغییر کند

#### 3. Image/Asset
```
URL: https://www.mindvaultip.com/assets/...
Status: 404
```

**راه‌حل:**
- چک کن فایل در build موجود است
- ممکن است path اشتباه باشد

## تشخیص مشکل "Transaction Likely to Fail"

### این هشدار یعنی:
- MetaMask پیش‌بینی می‌کند تراکنش revert می‌شود
- معمولاً به دلیل:
  1. **Fee mismatch** - فرانت و کانترکت fee یکسان نیستند
  2. **Insufficient balance** - موجودی کافی نیست
  3. **Wrong network** - شبکه اشتباه است
  4. **Contract error** - مشکل در کانترکت

### چک سریع:

```javascript
// در Console اجرا کن:
const { createPublicClient, http, parseEther } = await import('viem');
const { base } = await import('wagmi/chains');

const publicClient = createPublicClient({
  chain: base,
  transport: http()
});

// 1. چک Fee در کانترکت
const contractAddr = '0xYOUR_CONTRACT_ADDRESS'; // از .env بگیر
try {
  const regFeeWei = await publicClient.readContract({
    address: contractAddr,
    abi: [{ 
      name: 'registrationFee', 
      type: 'function', 
      stateMutability: 'view', 
      inputs: [], 
      outputs: [{ type: 'uint256' }] 
    }],
    functionName: 'registrationFee'
  });
  
  const regFeeEth = Number(regFeeWei) / 1e18;
  console.log('📊 Contract Fee:', regFeeEth, 'ETH');
  console.log('📤 Frontend Fee: 0.001 ETH');
  
  if (regFeeEth !== 0.001) {
    console.error('❌ MISMATCH! Contract expects', regFeeEth, 'but frontend sends 0.001');
  }
} catch (err) {
  console.log('⚠️  Contract has no public fee function (may be hardcoded)');
}

// 2. چک Balance
const { address } = window.ethereum.selectedAddress || {};
if (address) {
  const balance = await publicClient.getBalance({ address });
  const balanceEth = Number(balance) / 1e18;
  console.log('💰 Balance:', balanceEth, 'ETH');
  
  if (balanceEth < 0.001) {
    console.error('❌ Insufficient balance! Need 0.001 ETH');
  }
}

// 3. چک Network
const chainId = await window.ethereum.request({ method: 'eth_chainId' });
console.log('🌐 Chain ID:', chainId, '(should be 0x2105 for Base)');
```

## راه‌حل‌ها

### اگر 404 از Storage است:

1. **چک کن فایل آپلود شده:**
   ```javascript
   await window.__sb.storage.from('proofs').list('proofId');
   ```

2. **چک کن Bucket Public است:**
   - Supabase Dashboard → Storage → Buckets
   - `proofs` باید **Public** باشد

3. **چک کن RLS Policy:**
   ```sql
   SELECT * FROM storage.objects WHERE bucket_id = 'proofs';
   ```

### اگر Transaction Fail می‌شود:

#### 1. اگر Fee Mismatch است:
- **گزینه 1:** Fee را در کانترکت تغییر بده (اگر تابع دارد)
- **گزینه 2:** کانترکت جدید deploy کن با fee = 0.001 ETH

#### 2. اگر Insufficient Balance:
- موجودی را افزایش بده (حداقل 0.001 ETH + gas)

#### 3. اگر Wrong Network:
- به Base network (Chain ID: 8453) switch کن

## لاگ‌های مفید

```javascript
// تمام لاگ‌های مرتبط با payment:
console.log('[useETHPayment] Payment transaction sent:', {...});
console.log('[CreateProof] Registration error:', err);

// تمام لاگ‌های مرتبط با storage:
console.log('[SupabaseStorage] ✅ File uploaded successfully:', path);
console.log('[CreateProof] ✅ Public URL:', storageUrl);
```

## تماس با Support

اگر مشکل حل نشد، این اطلاعات را بفرست:
1. **URL دقیق که 404 می‌دهد**
2. **Console logs** (کامل)
3. **Network tab** screenshot
4. **MetaMask error message** (کامل)

