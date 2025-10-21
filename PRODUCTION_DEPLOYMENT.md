# Production Deployment Guide

## Required Environment Variables

The following environment variables must be set for production deployment:

### Required Variables
```bash
VITE_RPC_URL=https://mainnet.base.org
VITE_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
VITE_CHAIN_ID=8453
```

### Optional Variables
```bash
VITE_DEBUG=1                    # Enable debug mode (shows diagnostics widget)
VITE_PAYMENT_ADDRESS=0x...      # Payment contract address (if used)
VITE_WC_PROJECT_ID=...          # WalletConnect project ID
```

## Base Chain Configuration

The app is configured to work with **Base Mainnet** (Chain ID: 8453). 

### Supported Networks
- **Base Mainnet**: Chain ID 8453 (primary)
- **Base Sepolia**: Chain ID 84532 (testnet)

### Network Detection
The app automatically detects the connected network and shows warnings for unsupported chains. Users can switch to Base Mainnet using the built-in network switcher.

## Production Issues Fixed

### 1. Network Detection
- ✅ Fixed `getNetwork()` returning `{ chainId: 8453, name: "unknown" }`
- ✅ Added proper network normalization with `normalizeNetwork()`
- ✅ Provider now includes network metadata: `{ chainId: 8453, name: "base" }`

### 2. Navigation Issues
- ✅ Fixed Create Proof page navigation in production
- ✅ Added proper SPA routing with `vercel.json` rewrites
- ✅ Wrapped router with ErrorBoundary for graceful error handling
- ✅ Added RequireWallet guard that shows network warnings but never blocks navigation

### 3. Environment Variables
- ✅ Added environment validation at startup
- ✅ Created `useEnv` hook for safe environment access
- ✅ Added diagnostics logging (non-sensitive)

### 4. Error Handling
- ✅ Added comprehensive ErrorBoundary
- ✅ Graceful provider error handling in CreateProof page
- ✅ Network switching utilities with proper error handling

### 5. Debug Tools
- ✅ Added diagnostics widget (enabled with `VITE_DEBUG=1`)
- ✅ Environment validation and logging
- ✅ RPC connectivity testing

## Deployment Checklist

- [ ] Set all required environment variables
- [ ] Ensure `vercel.json` is deployed (SPA rewrites)
- [ ] Test Create Proof navigation
- [ ] Verify network detection works
- [ ] Check error boundaries function properly
- [ ] Test wallet connection and network switching

## Troubleshooting

### Create Proof Page Not Loading
1. Check browser console for errors
2. Verify environment variables are set
3. Check network connection (Base Mainnet)
4. Enable debug mode (`VITE_DEBUG=1`) to see diagnostics

### Network Issues
1. Ensure user is on Base Mainnet (Chain ID: 8453)
2. Use the network switcher in the app
3. Check RPC endpoint connectivity

### Environment Issues
1. Verify all required variables are set
2. Check variable names (must start with `VITE_`)
3. Ensure no typos in contract addresses
