#!/usr/bin/env node

// Direct Bucket Creation Script
// This script creates the awards bucket directly without relying on SQL functions

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

console.log('🚀 Creating Awards Bucket Directly');
console.log('==================================\n');

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
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;
const bucketName = envVars.VITE_SUPABASE_BUCKET || 'awards';

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

console.log(`📋 Creating bucket: ${bucketName}`);
console.log(`🔗 Supabase URL: ${supabaseUrl}\n`);

try {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Check if bucket already exists
  console.log('🔍 Checking if bucket already exists...');
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.log('❌ Failed to list buckets:', listError.message);
    process.exit(1);
  }
  
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  
  if (bucketExists) {
    console.log(`✅ Bucket '${bucketName}' already exists!`);
    console.log('🎉 No action needed.');
    process.exit(0);
  }
  
  // Create the bucket
  console.log(`📦 Creating bucket '${bucketName}'...`);
  const { data, error } = await supabase.storage.createBucket(bucketName, {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    fileSizeLimit: 10 * 1024 * 1024 // 10MB
  });
  
  if (error) {
    console.log('❌ Failed to create bucket:', error.message);
    
    if (error.message.includes('permission')) {
      console.log('\n🔒 Permission denied. This usually means:');
      console.log('   1. Your anon key doesn\'t have storage admin privileges');
      console.log('   2. You need to run the SQL setup script first');
      console.log('\n📋 To fix this:');
      console.log('   1. Go to your Supabase project SQL editor');
      console.log('   2. Run the contents of supabase-awards-bucket-setup.sql');
      console.log('   3. Or create the bucket manually in the Supabase dashboard');
    }
    
    process.exit(1);
  }
  
  console.log(`✅ Bucket '${bucketName}' created successfully!`);
  console.log('\n🎉 Setup complete! Your storage should now work.');
  console.log('\n📋 Next steps:');
  console.log('   1. Test your setup: node diagnose-storage.js');
  console.log('   2. Start your app: npm run dev');
  
} catch (error) {
  console.log('❌ Unexpected error:', error.message);
  process.exit(1);
}
