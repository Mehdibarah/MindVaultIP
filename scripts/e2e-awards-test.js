import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { ethers } from 'ethers';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Normalize env names for handler compatibility
process.env.SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
process.env.SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE;
process.env.SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || process.env.VITE_SUPABASE_BUCKET || 'awards';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. Please set them in .env or the environment.');
  process.exit(1);
}

(async function run() {
  // Create temporary founder wallet for signing
  const wallet = ethers.Wallet.createRandom();
  process.env.FOUNDER_ADDRESS = wallet.address;
  console.log('Temporary founder address for test:', wallet.address);

  // Dynamically import the handler after env is set
  const modulePath = path.resolve(process.cwd(), 'api', 'awards', 'issue.js');
  const handlerModule = await import(`file://${modulePath}`);
  const handler = handlerModule.default;

  const PORT = 3002;

  // Start local HTTP server using the handler
  const server = http.createServer((req, res) => {
    // Ensure req.url matches expected path
    // Delegate to the handler
    try {
      const maybePromise = handler(req, res);
      if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.catch((err) => {
          console.error('Handler promise rejected', err);
          if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err?.message || 'Handler error' }));
        });
      }
    } catch (err) {
      console.error('Handler threw', err);
      if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err?.message || 'Handler error' }));
    }
  });

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Server listening at http://localhost:${PORT}/api/awards/issue`);

  // Prepare payload
  const id = randomUUID();
  const title = 'E2E Test Award';
  const category = 'integration';
  const recipient = ethers.Wallet.createRandom().address;
  const timestamp = new Date().toISOString();

  const message = JSON.stringify({ id, title, category, recipient, timestamp });
  const signature = await wallet.signMessage(message);

  // Use global FormData and fetch (Node 18+)
  const FormData = globalThis.FormData;
  if (!FormData) {
    console.error('FormData not available in this Node runtime. Node 18+ required.');
    server.close();
    process.exit(1);
  }

  const form = new FormData();
  form.append('id', id);
  form.append('title', title);
  form.append('category', category);
  form.append('recipient', recipient);
  form.append('timestamp', timestamp);
  form.append('signature', signature);

  // Send POST
  try {
    const res = await fetch(`http://localhost:${PORT}/api/awards/issue`, {
      method: 'POST',
      body: form
    });

    const text = await res.text();
    console.log('Response status:', res.status);
    try {
      const json = JSON.parse(text);
      console.log('Response JSON:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Response text (non-json):', text);
    }
  } catch (err) {
    console.error('Fetch failed', err);
  } finally {
    server.close();
    console.log('Server closed');
  }
})();
