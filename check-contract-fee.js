#!/usr/bin/env node

/**
 * Check Contract Registration Fee
 * 
 * این اسکریپت fee در کانترکت را با fee در فرانت مقایسه می‌کند.
 * 
 * استفاده:
 *   node check-contract-fee.js
 * 
 * یا با آدرس سفارشی:
 *   CONTRACT_ADDRESS=0x... node check-contract-fee.js
 */

const { createPublicClient, http, parseEther } = require('viem');
const { base } = require('wagmi/chains');

// خواندن از env
const contractAddress = process.env.CONTRACT_ADDRESS || process.env.VITE_CONTRACT_ADDRESS;
const frontendFee = process.env.VITE_REG_FEE_ETH || '0.001';

if (!contractAddress) {
  console.error('❌ CONTRACT_ADDRESS not found in environment');
  console.log('Usage: CONTRACT_ADDRESS=0x... node check-contract-fee.js');
  process.exit(1);
}

async function checkFee() {
  try {
    console.log('🔍 Checking contract registration fee...\n');
    
    const publicClient = createPublicClient({
      chain: base,
      transport: http('https://mainnet.base.org')
    });

    console.log('📋 Configuration:');
    console.log('  Contract Address:', contractAddress);
    console.log('  Frontend Fee:', frontendFee, 'ETH');
    console.log('  Network: Base Mainnet (8453)\n');

    // سعی می‌کنیم fee را از کانترکت بخوانیم
    // چند تابع رایج: fee(), registrationFee(), regFee(), REGISTRATION_FEE()
    const possibleFunctions = [
      'fee', // ✅ Try 'fee' first (most common)
      'registrationFee',
      'regFee', 
      'REGISTRATION_FEE',
      'getRegistrationFee',
    ];

    let contractFeeWei = null;
    let functionName = null;

    for (const funcName of possibleFunctions) {
      try {
        const result = await publicClient.readContract({
          address: contractAddress,
          abi: [{
            name: funcName,
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ type: 'uint256' }]
          }],
          functionName: funcName
        });
        
        contractFeeWei = result;
        functionName = funcName;
        break;
      } catch (err) {
        // تابع وجود ندارد، ادامه می‌دهیم
        continue;
      }
    }

    if (!contractFeeWei) {
      console.error('❌ Could not read fee from contract');
      console.log('\n💡 Try reading manually:');
      console.log('  - Check contract on BaseScan: https://basescan.org/address/' + contractAddress);
      console.log('  - Look for function: registrationFee() or regFee()');
      console.log('  - Or check if fee is stored in a public variable');
      process.exit(1);
    }

    const contractFeeEth = Number(contractFeeWei) / 1e18;
    const frontendFeeNum = parseFloat(frontendFee);
    const frontendFeeWei = parseEther(frontendFee);

    console.log('✅ Contract Fee (from function "' + functionName + '"):');
    console.log('  Wei:', contractFeeWei.toString());
    console.log('  ETH:', contractFeeEth);
    console.log('\n📤 Frontend Fee:');
    console.log('  Wei:', frontendFeeWei.toString());
    console.log('  ETH:', frontendFeeNum);

    console.log('\n🔍 Comparison:');
    
    if (contractFeeWei === frontendFeeWei) {
      console.log('✅ Fees match! No issue.');
      console.log('   Both are:', frontendFeeNum, 'ETH');
    } else {
      console.log('❌ FEES DO NOT MATCH!');
      console.log('   Contract expects:', contractFeeEth, 'ETH');
      console.log('   Frontend sends:', frontendFeeNum, 'ETH');
      console.log('   Difference:', Math.abs(contractFeeEth - frontendFeeNum), 'ETH');
      
      console.log('\n🔧 Solutions:');
      console.log('  1. If contract has setRegistrationFee(uint256):');
      console.log('     Call: setRegistrationFee(' + frontendFeeWei.toString() + ')');
      console.log('  2. If fee is immutable:');
      console.log('     Deploy new contract with fee =', frontendFeeNum, 'ETH');
      console.log('     Update VITE_CONTRACT_ADDRESS in .env');
      
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
}

checkFee();

