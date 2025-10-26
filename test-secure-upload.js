#!/usr/bin/env node

// Test script for secure upload functionality
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

console.log('🧪 Testing Secure Upload Setup');
console.log('==============================\n');

// Read environment variables
let envContent = '';
try {
  envContent = readFileSync('.env', 'utf8');
} catch (error) {
  console.log('❌ .env file not found!');
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

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_KEY;
const bucketName = envVars.VITE_SUPABASE_BUCKET || 'awards';

console.log('📋 Environment Check:');
console.log('====================');
console.log(`✅ VITE_SUPABASE_URL: ${supabaseUrl ? 'Set' : '❌ Missing'}`);
console.log(`✅ VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'Set' : '❌ Missing'}`);
console.log(`✅ SUPABASE_SERVICE_KEY: ${supabaseServiceKey ? 'Set' : '❌ Missing'}`);
console.log(`✅ VITE_SUPABASE_BUCKET: ${bucketName}`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Missing required Supabase credentials');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.log('\n⚠️  SUPABASE_SERVICE_KEY not set - secure upload will not work');
  console.log('📋 To fix: Add SUPABASE_SERVICE_KEY to your .env file');
  console.log('   Get it from: Supabase Dashboard -> Settings -> API -> service_role key');
}

console.log('\n🔌 Testing Supabase Connection:');
console.log('===============================');

try {
  // Test with anon key
  const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
  
  const { data: buckets, error: listError } = await supabaseAnon.storage.listBuckets();
  
  if (listError) {
    console.log('❌ Failed to list buckets:', listError.message);
    process.exit(1);
  }
  
  console.log('✅ Supabase connection successful');
  
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  console.log(`✅ Bucket '${bucketName}': ${bucketExists ? 'Exists' : '❌ Not found'}`);
  
  if (!bucketExists) {
    console.log('\n🔧 To create the bucket:');
    console.log('   1. Go to your Supabase SQL editor');
    console.log('   2. Run the contents of create-bucket-manual.sql');
  }
  
} catch (error) {
  console.log('❌ Connection test failed:', error.message);
  process.exit(1);
}

console.log('\n🔐 Testing Service Key (if available):');
console.log('=====================================');

if (supabaseServiceKey) {
  try {
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Test service key permissions
    const { data: serviceBuckets, error: serviceError } = await supabaseService.storage.listBuckets();
    
    if (serviceError) {
      console.log('❌ Service key test failed:', serviceError.message);
    } else {
      console.log('✅ Service key working correctly');
      console.log(`✅ Can access ${serviceBuckets?.length || 0} buckets`);
    }
    
  } catch (error) {
    console.log('❌ Service key test failed:', error.message);
  }
} else {
  console.log('⚠️  Skipping service key test (not configured)');
}

console.log('\n📁 API Route Check:');
console.log('===================');

try {
  const fs = await import('fs');
  const apiRoutePath = './api/awards/issue.js';
  
  if (fs.existsSync(apiRoutePath)) {
  console.log('✅ API route exists: api/awards/issue.js');
  } else {
  console.log('❌ API route not found: api/awards/issue.js');
  }
} catch (error) {
  console.log('❌ Could not check API route:', error.message);
}

console.log('\n🎯 Next Steps:');
console.log('==============');
console.log('1. If SUPABASE_SERVICE_KEY is missing:');
console.log('   - Get it from Supabase Dashboard -> Settings -> API');
console.log('   - Add it to your .env file');
console.log('');
console.log('2. If bucket is missing:');
console.log('   - Run the SQL script in create-bucket-manual.sql');
console.log('');
console.log('3. Test the upload:');
console.log('   - Start your app: npm run dev');
console.log('   - Try uploading a file in the Awards form');
console.log('');
console.log('4. Deploy to Vercel:');
console.log('   - Add SUPABASE_SERVICE_KEY to Vercel environment variables');
console.log('   - Deploy your project');

console.log('\n🎉 Setup check completed!');
