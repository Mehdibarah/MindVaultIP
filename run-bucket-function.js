#!/usr/bin/env node

// Run the ensure_awards_bucket function directly
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

console.log('🚀 Running ensure_awards_bucket function');
console.log('=======================================\n');

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

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

try {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('📦 Calling ensure_awards_bucket function...');
  const { data, error } = await supabase.rpc('ensure_awards_bucket');
  
  if (error) {
    console.log('❌ Function failed:', error.message);
    process.exit(1);
  }
  
  console.log('✅ Function executed successfully!');
  console.log('📋 Response:', data);
  
  // Check if bucket now exists
  console.log('\n🔍 Checking if bucket was created...');
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.log('❌ Failed to list buckets:', listError.message);
    process.exit(1);
  }
  
  const bucketExists = buckets?.some(bucket => bucket.name === 'awards');
  
  if (bucketExists) {
    console.log('✅ Bucket "awards" now exists!');
    console.log('🎉 Setup complete!');
  } else {
    console.log('❌ Bucket "awards" still not found');
    console.log('🔧 You may need to run the SQL setup script manually');
  }
  
} catch (error) {
  console.log('❌ Unexpected error:', error.message);
  process.exit(1);
}
