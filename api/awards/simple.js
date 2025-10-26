// Simple award creation endpoint without signature verification
export const runtime = 'nodejs';

import { createClient } from '@supabase/supabase-js';
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
  
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Validate environment
    try {
      assertEnv();
      logEnvStatus();
    } catch (envError) {
      console.error("awards.simple.env.error", { message: envError.message });
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Parse JSON body
    const { title, recipient, recipientName, recipientEmail, category, year, summary, walletAddress } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: "title missing" });
    }
    
    if (!walletAddress) {
      return res.status(400).json({ error: "walletAddress missing" });
    }

    // Create Supabase client
    const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_KEY);

    // Prepare award data
    const awardData = {
      issuer: walletAddress.toLowerCase(),
      recipient: recipient ? recipient.toLowerCase() : null,
      recipient_name: recipientName || null,
      recipient_email: recipientEmail || null,
      title: title,
      category: category || null,
      year: year || new Date().getFullYear().toString(),
      summary: summary || null,
      image_url: null,
      timestamp: new Date().toISOString(),
    };

    console.log("awards.simple.creating", awardData);

    // Insert into database
    const { data: insertedAward, error: insertError } = await supabase
      .from('awards')
      .insert(awardData)
      .select()
      .single();

    if (insertError) {
      console.error("awards.simple.db.insert.error", { message: insertError.message });
      return res.status(500).json({ error: "Failed to save award", details: insertError.message });
    }

    console.log("awards.simple.create.success", { id: insertedAward.id });

    return res.status(200).json({
      ok: true,
      success: true,
      message: "Award created successfully",
      award: insertedAward
    });

  } catch (error) {
    console.error("awards.simple.error", { 
      message: error.message,
      stack: error.stack?.slice(0, 500)
    });
    return res.status(500).json({ 
      error: error.message || "Internal server error" 
    });
  }
}

// Helper function to validate environment
function assertEnv() {
  const errors = [];
  
  if (!ENV.SUPABASE_URL) {
    errors.push("SUPABASE_URL missing");
  }
  
  if (!ENV.SUPABASE_SERVICE_KEY) {
    errors.push("SUPABASE_SERVICE_KEY missing");
  }
  
  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.join(', ')}`);
  }
}
