# MindVaultIP Contract Integration

This document describes the smart contract integration setup for the MindVaultIP platform.

## Overview

The platform now includes full smart contract integration with:
- **MindVaultIP Core Contract**: Main contract for token operations
- **Payment Contract**: Handles payment transactions
- **Base Network**: Deployed on Base L2 (Chain ID: 8453)

## Environment Configuration

Create a `.env.local` file in the project root with the following variables:

```env
# MindVaultIP Contract Configuration
VITE_CONTRACT_ADDRESS=0xB4be9e66c80fcbe317C5038baDca1
VITE_PAYMENT_ADDRESS=0x63A8000bD167183AA43629d7C315d0FCc14B95ea
VITE_NETWORK=base
VITE_CHAIN_ID=8453

# Web3Modal Configuration
VITE_WC_PROJECT_ID=1279cd8b19e9ce4ba19e81e410bc4552
```

## Files Created/Modified

### New Files

1. **`src/lib/mindvaultipcoreABI.json`**
   - ERC-20 ABI for contract interactions
   - Contains: `allowance`, `balanceOf`, `decimals`, `transferFrom`

2. **`src/lib/contracts.ts`**
   - Contract configuration and addresses
   - Helper functions for contract interactions
   - Environment variable validation

3. **`src/hooks/useContract.ts`**
   - React hooks for contract interactions
   - `useMindVaultIPContract()` - Read contract data
   - `usePaymentContract()` - Write contract transactions
   - `useContractUtils()` - Utility functions

4. **`src/components/contract/TokenBalance.jsx`**
   - Displays user's token balance
   - Shows connection status and loading states

5. **`src/components/contract/PaymentForm.jsx`**
   - Payment form for token transfers
   - Transaction status tracking
   - Balance validation

6. **`src/pages/ContractDemo.jsx`**
   - Demo page showcasing contract integration
   - Available at `/ContractDemo`

### Modified Files

1. **`src/components/wallet/UnifiedWalletConnect.jsx`**
   - Added token balance display in wallet dropdown
   - Shows both ETH and IDN token balances

2. **`src/pages/index.jsx`**
   - Added ContractDemo page to routing
   - Available at `/ContractDemo`

## Contract Functions

### Available Functions

| Function | Type | Description |
|----------|------|-------------|
| `balanceOf(address)` | Read | Get token balance for an address |
| `allowance(owner, spender)` | Read | Check spending allowance |
| `transferFrom(from, to, value)` | Write | Transfer tokens between addresses |
| `decimals()` | Read | Get token decimal places |

### Usage Examples

```typescript
// Get user's token balance
const { balance, isLoading } = useMindVaultIPContract()

// Make a payment
const { transferToPayment, isPending } = usePaymentContract()
await transferToPayment('10.5') // Transfer 10.5 tokens

// Check if user has sufficient balance
const { hasSufficientBalance } = useContractUtils()
const canPay = hasSufficientBalance('10.5', balance)
```

## Demo Page

Visit `/ContractDemo` to see the contract integration in action:

- **Token Balance**: View your IDN token balance
- **Payment Form**: Make test payments
- **Contract Info**: View contract addresses and network details
- **Function List**: See all available contract functions

## Integration with Existing Features

### Wallet Connection
- Token balance is now displayed in the wallet dropdown
- Shows both ETH and IDN token balances
- Real-time balance updates

### Payment Processing
- Ready for integration with registration fees
- Balance validation before transactions
- Transaction status tracking

## Development Notes

### Environment Variables
- All contract addresses are configurable via environment variables
- Fallback values are provided for development
- Validation ensures proper configuration

### Error Handling
- Comprehensive error handling for contract interactions
- User-friendly error messages
- Loading states for better UX

### Type Safety
- Full TypeScript support
- Proper type definitions for contract interactions
- Address validation using viem

## Testing

1. **Connect Wallet**: Ensure wallet is connected to Base network
2. **View Balance**: Check token balance in wallet dropdown
3. **Demo Page**: Visit `/ContractDemo` to test functionality
4. **Make Payment**: Test payment form (requires tokens)

## Troubleshooting

### Common Issues

1. **"Contract address not set"**
   - Ensure `.env.local` file exists with proper addresses
   - Check environment variable names (must start with `VITE_`)

2. **"Insufficient balance"**
   - User needs IDN tokens to make payments
   - Check token balance in wallet dropdown

3. **"Transaction failed"**
   - Ensure wallet is connected to Base network
   - Check if user has approved token spending

4. **"Network mismatch"**
   - Switch to Base network (Chain ID: 8453)
   - Use the "Switch to Base" button in wallet dropdown

## Next Steps

1. **Deploy Contracts**: Deploy actual contracts to Base network
2. **Update Addresses**: Update environment variables with real addresses
3. **Add More Functions**: Extend ABI with additional contract functions
4. **Integration**: Integrate with registration and payment flows
5. **Testing**: Add comprehensive test coverage

## Security Considerations

- All contract interactions are validated
- User approval required for all transactions
- Balance checks prevent insufficient fund errors
- Address validation prevents invalid operations

