/**
 * API Endpoint: Create Proof (POST /api/createproof)
 * 
 * This endpoint creates a proof record in Supabase after payment confirmation.
 * It accepts transactionHash and userAddress from the frontend.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.error('[createproof] ❌ Supabase credentials missing');
}

export default async function handler(req, res) {
  // ✅ CORS headers - MUST be set before any response
  const origin = req.headers.origin || req.headers.host;
  const allowedOrigins = [
    'https://www.mindvaultip.com',
    'https://mindvaultip.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const isAllowed = !origin || allowedOrigins.some(allowed => 
    origin.includes('mindvaultip.com') || 
    origin.includes('localhost')
  );
  
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // ✅ Handle preflight IMMEDIATELY (no redirects allowed)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    if (!supabase) {
      console.error('[createproof] ❌ Supabase not configured');
      return res.status(500).json({
        success: false,
        error: 'Supabase not configured'
      });
    }

    const { transactionHash, userAddress, proofData } = req.body;

    if (!transactionHash) {
      return res.status(400).json({
        success: false,
        error: 'transactionHash is required'
      });
    }

    console.log('[createproof] 📥 Creating proof for transaction:', transactionHash);
    console.log('[createproof] User:', userAddress);

    // Check for existing proof with same payment_hash (idempotency)
    const { data: existing } = await supabase
      .from('proofs')
      .select('*')
      .eq('payment_hash', transactionHash)
      .single();

    if (existing) {
      console.log('[createproof] ✅ Proof already exists (idempotency):', existing.id);
      return res.status(200).json({
        success: true,
        message: 'Proof already exists',
        proofId: existing.id,
        transactionHash,
        alreadyExists: true
      });
    }

    // Prepare proof data
    const insertData = {
      payment_hash: transactionHash,
      created_by: userAddress || null,
      ...(proofData || {}), // Merge additional data if provided
    };

    // Insert proof record
    const { data: proof, error: insertError } = await supabase
      .from('proofs')
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error('[createproof] ❌ Failed to create proof:', insertError);
      
      // Handle duplicate key error (idempotency)
      if (insertError.code === '23505' || insertError.message?.includes('duplicate')) {
        // Try to get existing proof
        const { data: existingProof } = await supabase
          .from('proofs')
          .select('*')
          .eq('payment_hash', transactionHash)
          .single();
        
        if (existingProof) {
          return res.status(200).json({
            success: true,
            message: 'Proof already exists',
            proofId: existingProof.id,
            transactionHash,
            alreadyExists: true
          });
        }
      }
      
      return res.status(500).json({
        success: false,
        error: `Failed to create proof: ${insertError.message}`
      });
    }

    console.log('[createproof] ✅ Proof created successfully:', proof.id);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Proof created successfully',
      proofId: proof.id,
      transactionHash,
      proof: proof
    });

  } catch (error) {
    console.error('[createproof] ❌ Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

