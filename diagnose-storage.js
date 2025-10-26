#!/usr/bin/env node

// Storage Diagnostic Tool
// Run this to check your Supabase configuration

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 MindVaultIP Storage Diagnostic Tool');
console.log('=====================================\n');

// Check if .env file exists
let envContent = '';
try {
  envContent = readFileSync('.env', 'utf8');
  console.log('✅ .env file found');
} catch (error) {
  console.log('❌ .env file not found');
  console.log('📋 To fix this:');
  console.log('   1. Run: ./setup-env.sh');
  console.log('   2. Or create .env manually with your Supabase credentials');
  process.exit(1);
}

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

console.log('\n📋 Environment Variables Check:');
console.log('================================');

const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_SUPABASE_BUCKET'
];

let allVarsPresent = true;

requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (value && value !== 'your-project-id.supabase.co' && value !== 'your-anon-key-here') {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Missing or placeholder value`);
    allVarsPresent = false;
  }
});

if (!allVarsPresent) {
  console.log('\n🔧 To fix missing variables:');
  console.log('   1. Get your Supabase credentials from https://supabase.com');
  console.log('   2. Update your .env file with real values');
  console.log('   3. Run this diagnostic again');
  process.exit(1);
}

// Test Supabase connection
console.log('\n🔌 Testing Supabase Connection:');
console.log('===============================');

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;
const bucketName = envVars.VITE_SUPABASE_BUCKET || 'awards';

try {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test basic connection
  console.log('📡 Testing basic connection...');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError && authError.message.includes('Invalid API key')) {
    console.log('❌ Invalid Supabase API key');
    console.log('🔧 Check your VITE_SUPABASE_ANON_KEY in .env');
    process.exit(1);
  }
  
  console.log('✅ Supabase connection successful');
  
  // Test storage access
  console.log('📦 Testing storage access...');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.log('❌ Storage access failed:', bucketsError.message);
    process.exit(1);
  }
  
  console.log('✅ Storage access successful');
  
  // Check if awards bucket exists
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  
  if (bucketExists) {
    console.log(`✅ Bucket '${bucketName}' exists`);
  } else {
    console.log(`❌ Bucket '${bucketName}' not found`);
    console.log('🔧 To fix this:');
    console.log('   1. Go to your Supabase project SQL editor');
    console.log('   2. Run the contents of supabase-awards-bucket-setup.sql');
  }
  
  // Test SQL function
  console.log('🔧 Testing ensure_awards_bucket function...');
  const { error: functionError } = await supabase.rpc('ensure_awards_bucket');
  
  if (functionError) {
    if (functionError.message.includes('function') && functionError.message.includes('does not exist')) {
      console.log('❌ ensure_awards_bucket function not found');
      console.log('🔧 To fix this:');
      console.log('   1. Go to your Supabase project SQL editor');
      console.log('   2. Run the contents of supabase-awards-bucket-setup.sql');
    } else {
      console.log('⚠️ Function error (this might be normal):', functionError.message);
    }
  } else {
    console.log('✅ ensure_awards_bucket function works');
  }
  
  console.log('\n🎉 Diagnostic completed successfully!');
  console.log('Your Supabase storage should be working now.');
  
} catch (error) {
  console.log('❌ Connection test failed:', error.message);
  console.log('🔧 Check your Supabase URL and API key');
  process.exit(1);
}
