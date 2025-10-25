import { createClient } from '@supabase/supabase-js';
import { ENV, assertEnv } from '../_utils/env.js';

export const runtime = 'nodejs';

// CORS headers
const setCorsHeaders = (res, origin) => {
  const allowed = new Set([
    "https://www.mindvaultip.com",
    "https://mindvaultip.com", 
    "http://localhost:5173",
    "http://localhost:3000"
  ]);
  
  if (allowed.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Max-Age", "86400");
};

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  setCorsHeaders(res, origin);

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Validate environment
    try {
      assertEnv();
    } catch (envError) {
      console.error("awards.get.env.error", { message: envError.message });
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Create Supabase client
    const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_KEY);

    // Fetch awards from database
    const { data: awards, error } = await supabase
      .from('awards')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("awards.get.db.error", { message: error.message });
      return res.status(500).json({ error: "Failed to fetch awards" });
    }

    console.log("awards.get.success", { 
      count: awards?.length || 0,
      timestamp: new Date().toISOString()
    });

    // Return awards list
    return res.status(200).json({
      ok: true,
      success: true,
      awards: awards || [],
      count: awards?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("awards.get.error", { 
      message: err?.message, 
      stack: err?.stack?.slice(0, 300) 
    });
    return res.status(500).json({ 
      error: err?.message || "Internal server error" 
    });
  }
}
