#!/usr/bin/env node

// Test script for API route
console.log('🧪 Testing API Route');
console.log('===================\n');

const API_URL = '/api/awards/issue';

async function testAPI() {
  try {
    console.log('📡 Testing GET request to API route...');
    
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response:', data);
    
    if (response.ok && data.ok) {
      console.log('✅ API route is working correctly!');
    } else {
      console.log('❌ API route returned error');
    }
    
  } catch (error) {
    console.log('❌ Failed to test API route:', error.message);
  }
}

testAPI();
