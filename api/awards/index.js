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
  
  res.setHeader("Access-Control-Allow-Methods", "GET,DELETE,OPTIONS");
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

  // Handle different HTTP methods
  if (req.method === "GET") {
    return handleGetAwards(req, res);
  } else if (req.method === "DELETE") {
    return handleDeleteAward(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function handleGetAwards(req, res) {
  try {
    assertEnv();
    const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_KEY);

    console.log("awards.get.request", { 
      message: "Fetching ALL awards for public access"
    });

    const { data: awards, error } = await supabase
      .from('awards')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("awards.get.db.error", { message: error.message });
      return res.status(500).json({ error: 'Failed to fetch awards' });
    }

    console.log("awards.get.success", { 
      count: awards?.length || 0,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      ok: true,
      awards: awards || [],
      count: awards?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("awards.get.error", { 
      message: e?.message, 
      stack: e?.stack?.slice(0, 300) 
    });
    return res.status(500).json({ error: e?.message || 'Internal server error' });
  }
}

async function handleDeleteAward(req, res) {
  try {
    // Validate environment
    try {
      assertEnv();
    } catch (envError) {
      console.error("awards.delete.env.error", { message: envError.message });
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Get id parameter from query string
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }

    // Get wallet address from headers (should be set by frontend)
    const walletAddress = req.headers['x-wallet-address'];
    if (!walletAddress) {
      return res.status(400).json({ error: "Missing wallet address" });
    }

    // Verify founder access
    const normalizedWallet = walletAddress.toLowerCase().trim();
    if (normalizedWallet !== ENV.FOUNDER_ADDRESS) {
      console.error("awards.delete.unauthorized", { 
        expected: ENV.FOUNDER_ADDRESS, 
        got: normalizedWallet 
      });
      return res.status(403).json({ 
        error: "Founder access required",
        details: { expected: ENV.FOUNDER_ADDRESS, got: normalizedWallet }
      });
    }

    // Create Supabase client
    const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_KEY);

    // First, get the award by id
    const { data: award, error: fetchError } = await supabase
      .from('awards')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !award) {
      console.error("awards.delete.notfound", { id, error: fetchError?.message });
      return res.status(404).json({ error: "Award not found" });
    }

    // Delete file from Supabase storage if it exists
    if (award.image_url) {
      try {
        const fileName = award.image_url.split('/').pop();
        const { error: deleteError } = await supabase.storage
          .from(ENV.SUPABASE_BUCKET)
          .remove([fileName]);

        if (deleteError) {
          console.error("awards.delete.storage.error", { message: deleteError.message });
          // Continue with database deletion even if file deletion fails
        } else {
          console.log("awards.delete.storage.success", { fileName });
        }
      } catch (storageError) {
        console.error("awards.delete.storage.exception", { message: storageError.message });
        // Continue with database deletion
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('awards')
      .delete()
      .eq('id', award.id);

    if (deleteError) {
      console.error("awards.delete.db.error", { message: deleteError.message });
      return res.status(500).json({ error: "Failed to delete award from database" });
    }

    console.log("awards.delete.success", { 
      id: award.id,
      title: award.title
    });

    // Return success response
    return res.status(200).json({
      ok: true,
      success: true,
      deleted: {
        id: award.id,
        title: award.title
      },
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("awards.delete.error", { 
      message: err?.message, 
      stack: err?.stack?.slice(0, 300) 
    });
    return res.status(500).json({ 
      error: err?.message || "Internal server error" 
    });
  }
}
