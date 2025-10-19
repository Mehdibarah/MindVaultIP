/**
 * Simple test for AI Mentor functionality
 */

import { detectIntent, shouldSearch, detectLanguage } from './intent';
import { handleAIRequest } from '../api/aiHandler';

// Test intent detection
console.log('Testing Intent Detection:');
console.log('detectIntent("What is machine learning?") =', detectIntent("What is machine learning?"));
console.log('detectIntent("How to file a patent?") =', detectIntent("How to file a patent?"));
console.log('detectIntent("ثبت اختراع چگونه است؟") =', detectIntent("ثبت اختراع چگونه است؟"));

// Test web search triggers
console.log('\nTesting Web Search Triggers:');
console.log('shouldSearch("What is AI?") =', shouldSearch("What is AI?"));
console.log('shouldSearch("Bitcoin price today") =', shouldSearch("Bitcoin price today"));
console.log('shouldSearch("Latest news about AI") =', shouldSearch("Latest news about AI"));
console.log('shouldSearch("قیمت بیت کوین امروز") =', shouldSearch("قیمت بیت کوین امروز"));

// Test language detection
console.log('\nTesting Language Detection:');
console.log('detectLanguage("Hello world") =', detectLanguage("Hello world"));
console.log('detectLanguage("سلام دنیا") =', detectLanguage("سلام دنیا"));

// Test AI request
console.log('\nTesting AI Request:');
async function testAI() {
  try {
    const response = await handleAIRequest({
      messages: [
        {
          role: 'user',
          content: 'What is artificial intelligence?'
        }
      ]
    });
    console.log('AI Response:', response);
  } catch (error) {
    console.error('AI Test Error:', error);
  }
}

// Run the test
testAI();

export { testAI };
