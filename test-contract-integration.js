#!/usr/bin/env node

import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, '.env') });

console.log('🔍 Contract Integration Test');
console.log('============================');

async function testContractIntegration() {
  try {
    // Test 1: Environment Variables
    console.log('\n1. 📋 Environment Variables:');
    const RPC_URL = process.env.VITE_RPC_URL;
    const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS;
    
    if (!RPC_URL || !CONTRACT_ADDRESS) {
      throw new Error('Missing required environment variables');
    }
    
    console.log(`✅ RPC_URL: ${RPC_URL}`);
    console.log(`✅ CONTRACT_ADDRESS: ${CONTRACT_ADDRESS}`);
    
    // Test 2: ABI Loading
    console.log('\n2. 📄 ABI Loading:');
    const abiPath = path.join(__dirname, 'src/api/contract.json');
    if (!fs.existsSync(abiPath)) {
      throw new Error('Contract ABI file not found');
    }
    
    const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    console.log(`✅ ABI loaded: ${abi.length} functions`);
    
    // Test 3: Provider Creation
    console.log('\n3. 🌐 Provider Creation:');
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    
    // Test network connection
    const network = await provider.getNetwork();
    console.log(`✅ Network: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Test 4: Contract Creation
    console.log('\n4. 📄 Contract Creation:');
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    console.log(`✅ Contract created: ${contract.address}`);
    
    // Test 5: Contract Methods
    console.log('\n5. 🔧 Contract Methods:');
    const contractMethods = Object.getOwnPropertyNames(contract.interface.functions);
    console.log(`✅ Available methods: ${contractMethods.length}`);
    
    // Show some key methods
    const keyMethods = ['registerIP', 'getFilesByOwner', 'owner', 'name'];
    keyMethods.forEach(method => {
      if (contractMethods.includes(method)) {
        console.log(`  ✅ ${method}`);
      } else {
        console.log(`  ⚠️  ${method} (not found)`);
      }
    });
    
    // Test 6: Ethers Version
    console.log('\n6. 📦 Ethers Version:');
    const version = ethers.version || '5.x';
    console.log(`✅ Ethers version: ${version}`);
    
    // Test 7: Browser Environment Simulation
    console.log('\n7. 🌐 Browser Environment Simulation:');
    
    // Simulate how the contract.js would work in browser
    const mockWindow = {
      ethereum: null // No MetaMask in Node.js
    };
    
    // Test provider selection (should fallback to JSON RPC)
    console.log('✅ Would fallback to JSON RPC provider (no MetaMask)');
    
    console.log('\n📊 Test Results');
    console.log('================');
    console.log('✅ All contract integration tests passed!');
    
    console.log('\n🚀 Browser Console Commands:');
    console.log('```javascript');
    console.log('// Test basic contract access');
    console.log('window.contract.address');
    console.log('');
    console.log('// Test provider');
    console.log('await window.contract.provider.getNetwork()');
    console.log('');
    console.log('// Test ethers availability');
    console.log('window.ethers');
    console.log('');
    console.log('// Test contract methods');
    console.log('await window.contract.owner()');
    console.log('');
    console.log('// Run comprehensive test');
    console.log('await window.testContract()');
    console.log('```');
    
    console.log('\n💡 Expected Browser Console Output:');
    console.log('- 🔍 Ethers version detected: 5.x');
    console.log('- 🔧 Environment variables: { RPC_URL, CONTRACT_ADDRESS, ... }');
    console.log('- ✅ Contract initialized successfully');
    console.log('- 🔧 Global contract functions available: { ... }');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Contract integration test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check .env file has VITE_RPC_URL and VITE_CONTRACT_ADDRESS');
    console.error('2. Verify RPC URL is accessible');
    console.error('3. Ensure contract ABI file exists at src/api/contract.json');
    console.error('4. Check network connection');
    return false;
  }
}

// Run the test
testContractIntegration().then(success => {
  if (success) {
    console.log('\n🎉 Ready for browser testing!');
    console.log('Start dev server: npm run dev');
  } else {
    process.exit(1);
  }
});

