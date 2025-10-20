# MindVaultIP - Decentralized IP Platform

A Vite+React application for registering, validating, and trading intellectual property on the blockchain using smart contracts and MetaMask integration.

## Features

- 🔗 **Automatic MetaMask Integration**: Seamless wallet connection with fallback to JSON RPC
- 📝 **IP Registration**: Register and validate intellectual property on-chain
- 💰 **Token Economy**: IDN token for platform operations and governance
- 🛡️ **Smart Contracts**: Secure blockchain-based IP management
- 🌐 **Multi-language Support**: Internationalization for global users

## Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Update contract addresses in .env
VITE_CONTRACT_ADDRESS=your_contract_address_here
VITE_PAYMENT_ADDRESS=your_payment_contract_address_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Contract Connection

The app features automatic MetaMask detection and connection:

- **With MetaMask**: Uses signer for write operations, provider for reads
- **Without MetaMask**: Falls back to JSON RPC provider (read-only)
- **Automatic Fallback**: Seamless experience regardless of wallet availability

### Usage in Components

```javascript
import { useContractConnection } from '@/hooks/useContractConnection';

function MyComponent() {
  const { contract, isConnected, connect, executeContractMethod } = useContractConnection();
  
  // Use contract methods automatically
  const handleAction = async () => {
    const result = await executeContractMethod('methodName', ...args);
  };
}
```

## Documentation

- [Environment Setup Guide](./ENVIRONMENT_SETUP.md) - Configure environment variables
- [Contract Connection Guide](./CONTRACT_CONNECTION_GUIDE.md) - MetaMask integration and contract usage
- [Feature Documentation](./FEATURE-FLAGS.md) - Available features and configuration

## Troubleshooting

### Common Issues

1. **"Invalid contract address" Error**
   - Check `VITE_CONTRACT_ADDRESS` in `.env` file
   - Ensure address is 42 characters starting with '0x'

2. **MetaMask Connection Issues**
   - Install MetaMask browser extension
   - Ensure you're on the correct network (Base)
   - Check browser console for detailed error messages

3. **Environment Variables Not Loading**
   - Restart development server after changing `.env`
   - Ensure variables start with `VITE_`
   - Check that `.env` file is in project root

## Support

For technical support and questions:
- Check the documentation files in the project root
- Review browser console logs for detailed error information
- Contact: app@base44.com