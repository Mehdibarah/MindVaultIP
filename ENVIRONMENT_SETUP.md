# Environment Variable Setup Guide

This guide explains how to properly configure environment variables for the MindVaultIP project to resolve the "invalid contract address or ENS name" error.

## Problem Fixed

The project was experiencing issues with environment variable loading, specifically:
- Missing `.env` file
- Inconsistent environment variable naming between Next.js (`NEXT_PUBLIC_*`) and Vite (`VITE_*`) formats
- Invalid contract address format (incomplete 42-character address)
- Missing RPC URL configuration

## Solution Implemented

### 1. Environment Variable Standardization
All environment variables now use the Vite format (`VITE_*`) for consistency across the project:

- `VITE_CONTRACT_ADDRESS` - Main contract address
- `VITE_PAYMENT_ADDRESS` - Payment contract address  
- `VITE_RPC_URL` - RPC endpoint for ethers.js provider
- `VITE_CHAIN_ID` - Blockchain chain ID
- `VITE_NETWORK` - Network name

### 2. Files Updated

#### `src/lib/contract.js`
- Changed from `process.env.NEXT_PUBLIC_*` to `import.meta.env.VITE_*`
- Added validation for contract address format
- Added validation for RPC URL
- Added console logging for debugging

#### `src/lib/contracts.ts`
- Updated fallback contract address to valid 42-character format
- Maintained existing `import.meta.env.VITE_*` usage

#### `src/lib/ethersContract.js`
- Updated fallback contract address to valid 42-character format
- Maintained existing `import.meta.env.VITE_*` usage

#### `vite.config.js`
- Added proper environment variable loading with `loadEnv`
- Added `define` configuration to expose VITE_* variables to client
- Enhanced configuration for better environment variable handling

#### `env.example`
- Fixed contract address format (now 42 characters)
- Added missing `VITE_RPC_URL` variable
- Updated all addresses to valid format

### 3. Environment File Setup

The project now includes a proper `.env` file with all required variables:

```bash
# MindVaultIP Contract Configuration
VITE_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
VITE_PAYMENT_ADDRESS=0x63A8000bD167183AA43629d7C315d0FCc14B95ea
VITE_NETWORK=base
VITE_CHAIN_ID=8453

# RPC URL for ethers.js provider
VITE_RPC_URL=https://mainnet.base.org

# Web3Modal Configuration
VITE_WC_PROJECT_ID=1279cd8b19e9ce4ba19e81e410bc4552

# AI Mentor Configuration (optional)
VITE_TAVILY_API_KEY=your_tavily_api_key_here
VITE_JINA_API_KEY=your_jina_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## How to Use

### 1. Copy Environment File
```bash
cp env.example .env
```

### 2. Update Contract Addresses
Replace the example addresses in `.env` with your actual contract addresses:
- `VITE_CONTRACT_ADDRESS` - Your deployed contract address
- `VITE_PAYMENT_ADDRESS` - Your payment contract address

### 3. Verify Configuration
The project now includes validation that will:
- Check contract address format (42 characters, starts with 0x)
- Validate RPC URL is provided
- Log configuration details for debugging

### 4. Start Development Server
```bash
npm run dev
```

## Validation

The updated code includes comprehensive validation:

1. **Contract Address Format**: Must be 42 characters starting with '0x'
2. **RPC URL**: Must be provided and valid
3. **Environment Variables**: All required variables must be set

If validation fails, you'll see clear error messages indicating what needs to be fixed.

## Troubleshooting

### "Invalid contract address" Error
- Ensure `VITE_CONTRACT_ADDRESS` is exactly 42 characters
- Verify the address starts with '0x'
- Check that the contract is deployed on the specified network

### "RPC URL not configured" Error
- Ensure `VITE_RPC_URL` is set in your `.env` file
- Verify the RPC endpoint is accessible
- For Base network, use: `https://mainnet.base.org`

### Environment Variables Not Loading
- Restart the development server after changing `.env`
- Ensure variables start with `VITE_`
- Check that `.env` file is in the project root

## Files Modified

- `src/lib/contract.js` - Updated environment variable usage and validation
- `src/lib/contracts.ts` - Fixed fallback contract address
- `src/lib/ethersContract.js` - Fixed fallback contract address  
- `vite.config.js` - Enhanced environment variable handling
- `env.example` - Updated with correct format and missing variables
- `.env` - Created with proper configuration

This fix ensures that ethers.js receives valid contract addresses from environment variables and eliminates the "invalid contract address or ENS name" error.
