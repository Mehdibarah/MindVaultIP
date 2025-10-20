# Contract Connection Guide

This guide explains the new automatic MetaMask detection and contract connection system that has been implemented to fix the "invalid contract address or ENS name" error.

## Overview

The contract connection system now automatically:
- Detects if MetaMask is installed and available
- Uses MetaMask signer when connected for write operations
- Falls back to JSON RPC provider for read operations
- Handles connection state changes and account switching
- Provides a clean React hook interface for components

## Key Features

### 🔄 **Automatic Provider Detection**
- **MetaMask Available + Connected**: Uses `BrowserProvider` with signer for all operations
- **MetaMask Available + Not Connected**: Uses `BrowserProvider` without signer (read-only)
- **MetaMask Not Available**: Falls back to `JsonRpcProvider` (read-only)
- **Server-side**: Always uses `JsonRpcProvider`

### 🔐 **Smart Signer Handling**
- Automatically uses signer when available for write operations
- Falls back to provider for read operations
- Validates signer requirements before executing contract methods
- Handles connection state changes gracefully

### 🌐 **Browser Compatibility**
- Works in both browser and server environments
- Handles MetaMask connection/disconnection events
- Listens for account and network changes
- Provides global window objects for debugging

## Files Updated

### 1. `src/lib/contract.js` - Main Contract Module
**Complete rewrite with automatic MetaMask detection:**

```javascript
// Automatic provider detection
async function getProvider() {
  if (window.ethereum) {
    // Try MetaMask first
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      // Connected: use BrowserProvider with signer
      return { provider: new ethers.BrowserProvider(window.ethereum), signer: await provider.getSigner() };
    } else {
      // Available but not connected: use BrowserProvider without signer
      return { provider: new ethers.BrowserProvider(window.ethereum), signer: null };
    }
  }
  // Fallback to JSON RPC
  return { provider: new ethers.providers.JsonRpcProvider(RPC_URL), signer: null };
}
```

**Key Functions:**
- `getContract()` - Get contract instance with automatic provider detection
- `connectWithMetaMask()` - Connect to MetaMask and get contract with signer
- `getConnectionStatus()` - Check current connection status
- `getProvider()` - Get the best available provider

### 2. `src/hooks/useContractConnection.js` - React Hook
**New React hook for easy contract integration:**

```javascript
const {
  contract,           // Contract instance
  signer,            // Signer (if connected)
  address,           // Connected address
  isConnected,       // Connection status
  isMetaMaskAvailable, // MetaMask availability
  connect,           // Connect to MetaMask
  disconnect,        // Disconnect
  executeContractMethod, // Execute contract methods
  error              // Error state
} = useContractConnection();
```

**Features:**
- Automatic initialization on mount
- Connection state management
- Error handling and recovery
- Account/network change listeners
- Method execution with signer validation

### 3. `src/components/ContractConnectionDemo.jsx` - Demo Component
**Example component showing how to use the contract connection:**

- Connection status display
- Connect/disconnect buttons
- Read/write operation testing
- Error handling and display
- Debug information panel

## Usage Examples

### Basic Contract Usage

```javascript
import { useContractConnection } from '@/hooks/useContractConnection';

function MyComponent() {
  const { contract, isConnected, connect, executeContractMethod } = useContractConnection();

  const handleReadData = async () => {
    try {
      const result = await executeContractMethod('name');
      console.log('Contract name:', result);
    } catch (error) {
      console.error('Read failed:', error);
    }
  };

  const handleWriteData = async () => {
    if (!isConnected) {
      await connect();
    }
    
    try {
      const result = await executeContractMethod('transfer', recipientAddress, amount);
      console.log('Transfer result:', result);
    } catch (error) {
      console.error('Write failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleReadData}>Read Contract</button>
      <button onClick={handleWriteData}>Write to Contract</button>
    </div>
  );
}
```

### Direct Contract Usage

```javascript
import contract, { getContract, connectWithMetaMask } from '@/lib/contract';

// Use default contract (auto-detects provider)
const contractInstance = await getContract();

// Connect to MetaMask for write operations
const { contract: contractWithSigner, signer, address } = await connectWithMetaMask();

// Execute methods
const result = await contractWithSigner.transfer(recipient, amount);
```

### Global Window Objects (Browser Only)

```javascript
// Available in browser console for debugging
window.contract              // Default contract instance
window.connectWithMetaMask   // Connect to MetaMask
window.getConnectionStatus   // Get connection status
```

## Connection Flow

### 1. **Initialization**
```
App Start → Check Environment → Validate Contract Address → Initialize Provider
```

### 2. **Provider Selection**
```
MetaMask Available?
├─ Yes → Already Connected?
│   ├─ Yes → Use BrowserProvider + Signer
│   └─ No → Use BrowserProvider (read-only)
└─ No → Use JsonRpcProvider (read-only)
```

### 3. **Method Execution**
```
Execute Method → Requires Signer?
├─ Yes → Has Signer?
│   ├─ Yes → Execute with Signer
│   └─ No → Request MetaMask Connection
└─ No → Execute with Provider
```

## Error Handling

### Common Errors and Solutions

1. **"MetaMask is not installed"**
   - Solution: Install MetaMask browser extension
   - Fallback: System uses JSON RPC provider for read operations

2. **"Method requires MetaMask connection"**
   - Solution: Call `connect()` before executing write methods
   - Automatic: Hook handles this automatically

3. **"Invalid contract address"**
   - Solution: Check `VITE_CONTRACT_ADDRESS` in `.env` file
   - Validation: Address must be 42 characters starting with '0x'

4. **"RPC URL not configured"**
   - Solution: Set `VITE_RPC_URL` in `.env` file
   - Default: Falls back to Base mainnet RPC

## Environment Variables

Required in `.env` file:

```bash
VITE_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
VITE_RPC_URL=https://mainnet.base.org
VITE_CHAIN_ID=8453
VITE_NETWORK=base
```

## Testing

### Manual Testing
1. Start development server: `npm run dev`
2. Open browser console to see initialization logs
3. Use `ContractConnectionDemo` component to test connection
4. Test with and without MetaMask installed

### Console Logs
The system provides detailed logging:
- Contract initialization status
- Provider type selection
- Connection state changes
- Method execution results
- Error details

## Migration from Old System

### Before (Old contract.js)
```javascript
// Always used JSON RPC provider
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
```

### After (New contract.js)
```javascript
// Automatic provider detection with MetaMask support
const { provider, signer } = await getProvider();
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer || provider);
```

### Component Migration
```javascript
// Old way
import contract from '@/lib/contract';
const result = await contract.someMethod();

// New way
import { useContractConnection } from '@/hooks/useContractConnection';
const { executeContractMethod } = useContractConnection();
const result = await executeContractMethod('someMethod');
```

## Benefits

1. **Automatic MetaMask Detection**: No manual provider selection needed
2. **Seamless Fallback**: Works with or without MetaMask
3. **Smart Signer Handling**: Automatically uses signer when available
4. **React Integration**: Clean hook-based interface
5. **Error Recovery**: Handles connection issues gracefully
6. **Browser Compatibility**: Works in all environments
7. **Event Handling**: Responds to account/network changes
8. **Debugging Support**: Global objects and detailed logging

This new system eliminates the "invalid contract address or ENS name" error by ensuring proper provider initialization and automatic MetaMask integration.
