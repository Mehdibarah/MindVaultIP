#!/usr/bin/env node

import { ethers } from 'ethers';

console.log('🔍 RPC Endpoint Test');
console.log('===================');

const RPC_ENDPOINTS = [
  'https://base-mainnet.g.alchemy.com/v2/demo',
  'https://base.blockpi.network/v1/rpc/public',
  'https://base.llamarpc.com',
  'https://base.publicnode.com',
  'https://mainnet.base.org',
  'https://base.drpc.org',
  'https://base.gateway.tenderly.co',
  'https://base.meowrpc.com'
];

async function testRpcEndpoint(url) {
  try {
    console.log(`Testing: ${url}`);
    const provider = new ethers.providers.JsonRpcProvider(url);
    
    // Test with timeout
    const networkPromise = provider.getNetwork();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 10000)
    );
    
    const network = await Promise.race([networkPromise, timeoutPromise]);
    console.log(`✅ ${url} - Network: ${network.name} (Chain ID: ${network.chainId})`);
    return { url, working: true, network };
  } catch (error) {
    console.log(`❌ ${url} - ${error.message}`);
    return { url, working: false, error: error.message };
  }
}

async function testAllEndpoints() {
  console.log('\nTesting all RPC endpoints...\n');
  
  const results = [];
  for (const url of RPC_ENDPOINTS) {
    const result = await testRpcEndpoint(url);
    results.push(result);
  }
  
  console.log('\n📊 Results Summary:');
  console.log('==================');
  
  const workingEndpoints = results.filter(r => r.working);
  const failedEndpoints = results.filter(r => !r.working);
  
  console.log(`✅ Working endpoints: ${workingEndpoints.length}`);
  workingEndpoints.forEach(r => {
    console.log(`  - ${r.url} (${r.network.name})`);
  });
  
  console.log(`\n❌ Failed endpoints: ${failedEndpoints.length}`);
  failedEndpoints.forEach(r => {
    console.log(`  - ${r.url}: ${r.error}`);
  });
  
  if (workingEndpoints.length > 0) {
    console.log('\n🎉 Found working RPC endpoints!');
    console.log('\n💡 Update your .env file with a working endpoint:');
    console.log(`VITE_RPC_URL=${workingEndpoints[0].url}`);
  } else {
    console.log('\n❌ No working RPC endpoints found.');
    console.log('This might be a network connectivity issue.');
  }
}

testAllEndpoints().catch(console.error);

