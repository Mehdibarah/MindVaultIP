// Debug endpoint for award creation testing
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
  
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    // Return debug information
    try {
      logEnvStatus();
      
      return res.status(200).json({
        ok: true,
        debug: {
          environment: {
            FOUNDER_ADDRESS: ENV.FOUNDER_ADDRESS ? `${ENV.FOUNDER_ADDRESS.slice(0, 6)}...${ENV.FOUNDER_ADDRESS.slice(-4)}` : 'NOT SET',
            SUPABASE_URL: ENV.SUPABASE_URL ? 'SET' : 'MISSING',
            SUPABASE_SERVICE_KEY: ENV.SUPABASE_SERVICE_KEY ? 'SET' : 'MISSING',
            SUPABASE_BUCKET: ENV.SUPABASE_BUCKET,
            MAX_UPLOAD_BYTES: ENV.MAX_UPLOAD_BYTES
          },
          timestamp: new Date().toISOString(),
          nodeVersion: process.version,
          platform: process.platform
        }
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error: error.message
      });
    }
  }

  if (req.method === "POST") {
    // Test award creation without file upload
    try {
      const { title, recipient, walletAddress } = req.body;
      
      if (!title || !walletAddress) {
        return res.status(400).json({
          ok: false,
          error: "Missing required fields: title, walletAddress"
        });
      }

      // Test with actual Supabase insertion
      if (ENV.SUPABASE_URL && ENV.SUPABASE_SERVICE_KEY) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_KEY);
        
        const testAward = {
          issuer: walletAddress,
          recipient: recipient || null,
          recipient_name: 'Test Recipient',
          recipient_email: 'test@example.com',
          title,
          category: 'Test',
          year: new Date().getFullYear().toString(),
          summary: 'This is a test award created via debug endpoint',
          image_url: null,
          timestamp: new Date().toISOString(),
        };

        console.log('debug.award.test.inserting', testAward);

        const { data: insertedAward, error: insertError } = await supabase
          .from('awards')
          .insert(testAward)
          .select()
          .single();

        if (insertError) {
          console.error('debug.award.test.insert.error', { message: insertError.message });
          return res.status(500).json({
            ok: false,
            error: `Database error: ${insertError.message}`,
            details: insertError
          });
        }

        console.log('debug.award.test.insert.success', insertedAward);

        return res.status(200).json({
          ok: true,
          success: true,
          message: 'Test award created and saved to database successfully',
          award: insertedAward
        });
      } else {
        // Fallback: simulate award creation
        const testAward = {
          id: `test_${Date.now()}`,
          title,
          recipient: recipient || null,
          issuer: walletAddress,
          timestamp: new Date().toISOString(),
          category: 'Test',
          summary: 'This is a test award created via debug endpoint (simulated)'
        };

        console.log('debug.award.test.simulated', testAward);

        return res.status(200).json({
          ok: true,
          success: true,
          message: 'Test award created successfully (simulated - no database)',
          award: testAward
        });
      }

    } catch (error) {
      console.error('debug.award.error', { message: error.message, stack: error.stack });
      return res.status(500).json({
        ok: false,
        error: error.message,
        stack: error.stack
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}