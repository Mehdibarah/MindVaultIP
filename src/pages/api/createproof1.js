/**
 * API Endpoint: Create Proof (POST /api/createproof1)
 * Creates a proof record in Supabase after payment transaction is confirmed
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[createproof1] ❌ Supabase credentials missing');
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Handler for POST /api/createproof1
 */
export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    // Validate Supabase client
    if (!supabase) {
      console.error('[createproof1] Supabase not configured');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: Supabase not configured'
      });
    }

    // Parse request body
    const { 
      transactionHash, 
      userAddress, 
      amount,
      // Optional: proof data if frontend sends it
      title,
      category,
      description,
      fileHash,
      fileName,
      fileSize,
      fileType,
      isPublic = true,
      ipfsHash
    } = req.body;

    // Validate required fields
    if (!transactionHash) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: transactionHash'
      });
    }

    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: userAddress'
      });
    }

    console.log('[createproof1] 📥 Creating proof for transaction:', transactionHash);
    console.log('[createproof1] User:', userAddress);

    // Generate proof ID (deterministic from transaction hash for idempotency)
    const proofId = `proof_${transactionHash.substring(2, 10)}_${Date.now()}`;

    // Prepare proof data
    const proofData = {
      id: proofId,
      title: title || `Proof ${proofId}`,
      category: category || 'invention',
      description: description || '',
      file_hash: fileHash || null,
      file_name: fileName || null,
      file_size: fileSize || null,
      file_type: fileType || null,
      is_public: isPublic,
      payment_hash: transactionHash,
      transaction_id: transactionHash, // Same as payment_hash
      ipfs_hash: ipfsHash || null,
      created_by: userAddress,
    };

    // Check if proof already exists (idempotency)
    const { data: existing } = await supabase
      .from('proofs')
      .select('id')
      .eq('payment_hash', transactionHash)
      .eq('created_by', userAddress)
      .single();

    if (existing) {
      console.log('[createproof1] ✅ Proof already exists (idempotency):', existing.id);
      return res.status(200).json({
        success: true,
        message: 'Proof already exists',
        proofId: existing.id,
        transactionHash,
        alreadyExists: true
      });
    }

    // Insert proof record
    const { data: proof, error: insertError } = await supabase
      .from('proofs')
      .insert(proofData)
      .select()
      .single();

    if (insertError) {
      console.error('[createproof1] ❌ Failed to create proof:', insertError);
      
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

    console.log('[createproof1] ✅ Proof created successfully:', proof.id);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Proof created successfully',
      proofId: proof.id,
      transactionHash,
      proof: proof
    });

  } catch (error) {
    console.error('[createproof1] ❌ Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

