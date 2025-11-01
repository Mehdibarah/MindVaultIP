# ✅ Fix: ContractFeeChecker Safe Implementation

## مشکل

- `ContractFeeChecker` در `main.jsx` در startup اجرا می‌شود
- اگر خطا بدهد، ممکن است app را crash کند
- خطای "Contract fee not readable" یک warning است، نه error

## راه‌حل

### ✅ 1. Safe Wrapper برای `logFeeComparison`

**قبل:**
```typescript
export async function logFeeComparison(): Promise<void> {
  const result = await checkContractFee();
  // ... ممکن است throw کند
}
```

**بعد:**
```typescript
export async function logFeeComparison(): Promise<void> {
  try {
    // ... تمام منطق داخل try
  } catch (error) {
    // ✅ Silently handle - don't crash app
    console.warn('[ContractFeeChecker] ⚠️  Fee check failed (non-critical):', error.message);
    // Don't throw - this is diagnostic, not critical
  }
}
```

### ✅ 2. Early Return برای Expected Errors

```typescript
if (result.error) {
  if (result.error.includes('Could not read fee')) {
    // ✅ این یک warning است، نه error - early return
    console.log('[ContractFeeChecker] ⚠️  Contract fee not readable (no public function)');
    return; // ✅ Expected behavior
  }
  // Other errors also return early
  return;
}
```

### ✅ 3. Safe parseEther در Warning

```typescript
try {
  const fixFeeWei = ethers.utils.parseEther(result.frontendFee).toString();
  console.warn('[ContractFeeChecker]   1. If contract has setRegistrationFee(): call it with', fixFeeWei);
} catch (parseError) {
  // ✅ Fallback اگر parseEther fail شود
  console.warn('[ContractFeeChecker]   1. If contract has setRegistrationFee(): call it with fee =', result.frontendFee, 'ETH');
}
```

### ✅ 4. Safe Call در `main.jsx`

**قبل:**
```javascript
void (async () => {
  try {
    await logFeeComparison();
  } catch (error) {
    console.error('[Main] Failed to check contract fee:', error);
  }
})();
```

**بعد:**
```javascript
void (async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for provider
    await logFeeComparison(); // ✅ Now safe - won't throw
  } catch (error) {
    // ✅ Even if it throws (shouldn't), silently handle
    console.warn('[Main] Contract fee check skipped (non-critical):', error.message);
    // Don't crash the app
  }
})();
```

## نتیجه

✅ `logFeeComparison` کاملاً safe است - هرگز app را crash نمی‌کند  
✅ Expected errors (مثل "fee not readable") به صورت warning نمایش داده می‌شوند  
✅ تمام exceptions handle می‌شوند  
✅ App بدون مشکل load می‌شود حتی اگر contract fee check fail شود  

## چک‌لیست

- [x] `logFeeComparison` با try-catch wrapped شده
- [x] Early return برای expected errors
- [x] Safe parseEther با fallback
- [x] Safe call در `main.jsx`
- [x] Build موفق است
- [x] هیچ lint error نیست

## تست

برای تست، می‌توانی در console این را اجرا کنی:

```javascript
// این باید بدون خطا اجرا شود، حتی اگر contract fee قابل خواندن نباشد
window.__testFeeCheck = async () => {
  const { logFeeComparison } = await import('./utils/contractFeeChecker');
  await logFeeComparison();
};
window.__testFeeCheck();
```

اگر خطای 404 از Vercel می‌بینی، مشکل از routing است، نه از ContractFeeChecker. `vercel.json` درست است و باید کار کند.

