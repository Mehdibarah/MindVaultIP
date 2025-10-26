import handler from '../api/awards/issue.js';

function makeRes(label) {
  return {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(obj) { console.log(`${label} JSON RESPONSE:`, this.statusCode, JSON.stringify(obj)); return; },
    end(body) { console.log(`${label} END:`, body); return; }
  };
}

async function run() {
  console.log('Invoking handler with OPTIONS');
  const reqOptions = { method: 'OPTIONS', headers: {} };
  await handler(reqOptions, makeRes('OPTIONS'));

  console.log('\nInvoking handler with POST (no body)');
  const reqPost = { method: 'POST', headers: {} };
  await handler(reqPost, makeRes('POST'));
}

run().catch(err => console.error('Invoker error', err));
