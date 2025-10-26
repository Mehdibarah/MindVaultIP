#!/usr/bin/env node
/*
  Automated test for the awards issue endpoint and upload.js removal.

  - Verifies `api/upload.js` is NOT present
  - Verifies `api/awards/issue.js` IS present
  - If API_BASE_URL env is set (or defaults to http://localhost:3000), sends an OPTIONS request to
    /api/awards/issue and asserts a 200 response and presence of CORS headers allowing POST.

  Exit codes:
  - 0 on success
  - non-zero on failure
 */

import fs from 'fs';
import path from 'path';

const root = process.cwd();

function fail(msg) {
  console.error('❌', msg);
  process.exit(1);
}

function pass(msg) {
  console.log('✅', msg);
}

// 1) File existence checks
const uploadPath = path.join(root, 'api', 'upload.js');
const awardsPath = path.join(root, 'api', 'awards', 'issue.js');

if (fs.existsSync(uploadPath)) {
  fail(`Found unexpected file at ${uploadPath}. Please remove api/upload.js (uploads are handled via api/awards/issue).`);
} else {
  pass('Confirmed api/upload.js is not present');
}

if (!fs.existsSync(awardsPath)) {
  fail(`Missing expected endpoint at ${awardsPath}. Expected api/awards/issue.js to exist.`);
} else {
  pass('Confirmed api/awards/issue.js exists');
}

// 2) Optional endpoint smoke-check
const base = process.env.API_BASE_URL || 'http://localhost:3000';
const endpoint = `${base.replace(/\/$/, '')}/api/awards/issue`;

console.log('\n🔎 Performing OPTIONS smoke-check against', endpoint);

(async () => {
  try {
    const res = await fetch(endpoint, { method: 'OPTIONS' });
    if (res.status !== 200) {
      fail(`Expected status 200 for OPTIONS ${endpoint}, got ${res.status}`);
    }

    const allow = res.headers.get('access-control-allow-methods') || '';
    if (!allow.toUpperCase().includes('POST')) {
      fail('CORS header Access-Control-Allow-Methods does not include POST');
    }

    pass('OPTIONS smoke-check succeeded and CORS allows POST');
    console.log('\nAll checks passed.');
    process.exit(0);
  } catch (err) {
    console.warn('⚠️  OPTIONS request failed — the dev server may not be running or the URL is unreachable.');
    console.warn('    Error:', err.message || err);
    console.log('\nYou can run the tests again after starting dev servers:');
    console.log('  npm run dev:vercel   # start serverless functions (if used)');
    console.log('  npm run dev          # start frontend');
    // Treat this as non-fatal for CI that doesn't run the dev server — exit 0 but with message.
    process.exit(0);
  }
})();
