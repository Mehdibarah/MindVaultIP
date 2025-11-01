/**
 * API Proxy: /api/createproof (redirects to /api/createproof1)
 * 
 * This endpoint exists to handle legacy calls to /createproof or /api/createproof
 * without the "1" suffix. It forwards requests to the actual createproof1 endpoint.
 */

export default async function handler(req, res) {
  // Import and forward to createproof1
  try {
    const createproof1Handler = await import('./createproof1.js');
    return createproof1Handler.default(req, res);
  } catch (error) {
    console.error('[createproof proxy] Error forwarding to createproof1:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: Failed to forward request',
    });
  }
}

