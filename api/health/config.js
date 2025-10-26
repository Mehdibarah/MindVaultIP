// Health check endpoint for configuration
export const runtime = 'nodejs';

import { ENV, logEnvStatus } from '../_utils/env.js';

export default async function handler(req, res) {
  // Set CORS headers
  const allowed = new Set([
    "https://www.mindvaultip.com",
    "https://mindvaultip.com", 
    "http://localhost:5173",
    "http://localhost:3000"
  ]);
  
  const origin = req.headers.origin || "";
  if (allowed.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Log environment status
    logEnvStatus();
    
    // Check environment variables
    const envStatus = {
      FOUNDER_ADDRESS: ENV.FOUNDER_ADDRESS ? 'SET' : 'MISSING',
      SUPABASE_URL: ENV.SUPABASE_URL ? 'SET' : 'MISSING',
      SUPABASE_SERVICE_KEY: ENV.SUPABASE_SERVICE_KEY ? 'SET' : 'MISSING',
      SUPABASE_BUCKET: ENV.SUPABASE_BUCKET,
      MAX_UPLOAD_BYTES: ENV.MAX_UPLOAD_BYTES
    };

    const isHealthy = ENV.FOUNDER_ADDRESS && ENV.SUPABASE_URL && ENV.SUPABASE_SERVICE_KEY;

    return res.status(200).json({
      ok: true,
      healthy: isHealthy,
      timestamp: new Date().toISOString(),
      environment: envStatus,
      message: isHealthy ? 'All systems operational' : 'Configuration issues detected'
    });

  } catch (error) {
    console.error('health.config.error', { message: error.message });
    return res.status(500).json({
      ok: false,
      healthy: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}