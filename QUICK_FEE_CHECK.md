# ⚡ Quick Fee Check

## روش سریع (Console مرورگر)

باز کن Console و بزن:

```javascript
// خواندن fee از کانترکت
const contractAddr = '0xYOUR_CONTRACT_ADDRESS'; // از .env بگیر
const { createPublicClient, http, parseEther } = await import('viem');
const { base } = await import('wagmi/chains');

const client = createPublicClient({ chain: base, transport: http() });

// خواندن fee
const regFeeWei = await client.readContract({
  address: contractAddr,
  abi: [{ name: 'registrationFee', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] }],
  functionName: 'registrationFee'
});

const regFeeEth = Number(regFeeWei) / 1e18;
console.log('📊 Contract Fee:', regFeeEth, 'ETH');

// مقایسه با فرانت
const frontendFee = 0.001;
console.log('📤 Frontend Fee:', frontendFee, 'ETH');

if (regFeeEth !== frontendFee) {
  console.error('❌ MISMATCH!');
  console.log('💡 باید', frontendFee, 'ETH باشد، اما', regFeeEth, 'ETH است');
} else {
  console.log('✅ Fees match!');
}
```

## راه‌حل سریع

### اگر کانترکت تابع دارد:
```javascript
// از حساب Founder:
await walletClient.writeContract({
  address: contractAddr,
  abi: [{ name: 'setRegistrationFee', type: 'function', inputs: [{ name: '_fee', type: 'uint256' }] }],
  functionName: 'setRegistrationFee',
  args: [parseEther('0.001')] // 1_000_000_000_000_000 wei
});
```

### اگر immutable است:
1. کانترکت جدید deploy با `fee = 0.001 ether`
2. آدرس جدید در `.env` → `VITE_CONTRACT_ADDRESS=0x...`
3. Redeploy در Vercel

