// Test Vercel API detection
const fs = require('fs');
const path = require('path');

const apiDir = path.join(process.cwd(), 'api');
const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.js'));

console.log('API Files found:');
files.forEach(f => {
  const content = fs.readFileSync(path.join(apiDir, f), 'utf8');
  const hasExport = content.includes('export default') || content.includes('module.exports');
  console.log(`  ${f}: ${hasExport ? '✅ Has export' : '❌ No export'}`);
});
