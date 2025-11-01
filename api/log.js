/**
 * API Endpoint: Log Errors (POST /api/log)
 * 
 * Receives error logs from autoErrorMonitor.js and logs them to server console.
 * Optional endpoint - if not present, client will only log to console.
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    // Parse body (Vercel provides it as object or we need to parse)
    let body = req.body;
    
    // If body is not an object, try to parse it
    if (!body || typeof body !== 'object') {
      try {
        // In some Vercel setups, body might need parsing
        body = JSON.parse(req.body || '{}');
      } catch (parseError) {
        body = req.body || {};
      }
    }

    // Log to server console
    console.log('[LOG]', body.type, body.time, body.url, body.data);

    // Optional: Store in database or external service here
    // await storeLog(body);

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[LOG_ERR]', e);
    return res.status(500).json({
      ok: false,
      error: e.message || 'Internal server error'
    });
  }
}

