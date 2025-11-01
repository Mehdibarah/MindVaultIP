# ✅ Complete Fix Summary - 6 Critical Changes

## تغییرات اعمال شده

### 1. ✅ staticCall + estimateGas قبل از ارسال
**فایل:** `src/components/utils/cryptoUtils.jsx`

```javascript
// 1) خواندن fee از contract (یا fallback)
let regFeeWei;
try {
  if (contract.fee) regFeeWei = await contract.fee();
  else if (contract.registrationFee) regFeeWei = await contract.registrationFee();
  else if (contract.regFee) regFeeWei = await contract.regFee();
  else throw new Error('No fee function found');
} catch { regFeeWei = parseEther(REG_FEE); }

// 2) Preflight: staticCall
await contract.registerProof.staticCall(hash, ownerAddress, { value: regFeeWei });

// 3) Estimate gas
const gasEstimate = await contract.registerProof.estimateGas(hash, ownerAddress, { value: regFeeWei });
const gasLimit = (gasEstimate * 120n) / 100n; // 20% buffer

// 4) Send
const tx = await contract.registerProof(hash, ownerAddress, { value: regFeeWei, gasLimit });
```

**نتیجه:** "This transaction is likely to fail" عملاً حذف می‌شود.

---

### 2. ✅ Handle TRANSACTION_REPLACED
**فایل:** `src/components/utils/cryptoUtils.jsx`

```javascript
try {
  receipt = await tx.wait();
  if (receipt?.status !== 1) throw new Error('TX_FAILED');
} catch (waitError) {
  if (waitError.code === 'TRANSACTION_REPLACED') {
    if (waitError.cancelled) {
      throw new Error('Transaction was cancelled');
    } else {
      // Speed Up - wait for replacement
      const rep = waitError.replacement;
      receipt = await rep.wait();
      if (receipt.status === 1) {
        // ✅ Success
      }
    }
  }
}
```

**نتیجه:** اگر کاربر Speed Up/Cancel بزند، replacement را track می‌کند.

---

### 3. ✅ State Machine برای Steps
**فایل:** `src/pages/CreateProof.jsx`

```javascript
const [done, setDone] = useState({
  prep: false,   // Step 1: Preparation
  upload: false, // Step 2: File upload
  db: false,     // Step 3: Database record
  chain: false,  // Step 4: Blockchain confirmation
});

// Step 2: Upload
const uploadResult = await uploadProofFile(storagePath, file);
if (testResponse.ok) {
  setDone(d => ({ ...d, upload: true }));
}

// Step 3: DB (BEFORE blockchain for faster completion)
const registrationResult = await client.create(proofData);
setDone(d => ({ ...d, db: true }));

// Step 4: Blockchain (WAIT for confirmation)
const blockchainResult = await registerProof(fileHash, address);
setDone(d => ({ ...d, chain: true }));
```

**نتیجه:** Steps فقط وقتی سبز می‌شوند که واقعاً complete شده باشند.

---

### 4. ✅ Contract Validation
**فایل:** `src/components/utils/cryptoUtils.jsx`

- ✅ خواندن fee از contract (اگر view function دارد)
- ✅ Fallback به env/constant اگر ندارد
- ✅ Validation قبل از ارسال (staticCall)

**نکته:** اگر contract تابع `fee()` ندارد، باید اضافه شود:
```solidity
function fee() external pure returns (uint256) {
  return 0.001 ether; // یا مقدار صحیح
}
```

---

### 5. ✅ لاگ‌های لازم
**فایل:** `src/components/utils/cryptoUtils.jsx`

```javascript
console.log('[TX] fee', ethers.formatEther(regFeeWei), 'ETH');
console.log('[TX] hash', tx.hash);
console.error('[TX] err', error.code, error.reason ?? error.message);
console.log('[TX] rcpt', receipt.status, receipt.transactionHash);
```

**نتیجه:** تمام مراحل قابل trace هستند.

---

### 6. ✅ Idempotency
**فایل:** `src/pages/CreateProof.jsx`

```javascript
// Check for existing proof with same file_hash and created_by
const existingProofs = await client.filter({ 
  file_hash: fileHash,
  created_by: address 
});

if (existingProofs && existingProofs.length > 0) {
  proofId = existingProofs[0].id; // Use existing
}

// Use upsert for idempotency
try {
  registrationResult = await client.create(proofData);
} catch (dbError) {
  if (dbError.message?.includes('duplicate')) {
    registrationResult = await client.update(proofId, proofData);
  }
}
```

**نتیجه:** اگر صفحه refresh شد یا duplicate submission، از record موجود استفاده می‌کند.

---

## نتیجه نهایی

✅ **"This transaction is likely to fail" حذف می‌شود** (staticCall + estimateGas)  
✅ **TRANSACTION_REPLACED handle می‌شود** (Speed Up/Cancel)  
✅ **Steps فقط بعد از completion سبز می‌شوند** (state machine)  
✅ **Contract validation کامل است** (خواندن fee از contract)  
✅ **لاگ‌های کامل** برای debugging  
✅ **Idempotency** برای duplicate submissions  

## Files Modified

- ✅ `src/components/utils/cryptoUtils.jsx` - staticCall, estimateGas, TRANSACTION_REPLACED handling
- ✅ `src/pages/CreateProof.jsx` - State machine, idempotency, step completion tracking

## تست

1. **تست staticCall:**
   - اگر fee mismatch باشد → error قبل از MetaMask
   - اگر همه چیز OK باشد → MetaMask بدون warning

2. **تست TRANSACTION_REPLACED:**
   - Payment را start کن
   - در MetaMask "Speed Up" بزن
   - باید replacement را track کند و موفق شود

3. **تست Steps:**
   - Step 2 فقط بعد از upload موفق → سبز
   - Step 3 فقط بعد از DB create → سبز
   - Step 4 فقط بعد از blockchain confirm → سبز

4. **تست Idempotency:**
   - Submit کن
   - صفحه را refresh کن
   - دوباره submit کن
   - باید از record موجود استفاده کند

