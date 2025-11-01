/**
 * API Endpoint: Create Proof (POST /api/createproof1)
 * Creates a proof record in Supabase after payment transaction is confirmed
 */

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[createproof1] ❌ Supabase credentials missing");
}

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
  // ✅ CORS headers - MUST be set before any response
  const origin = req.headers.origin || req.headers.host;
  const allowedOrigins = [
    "https://www.mindvaultip.com",
    "https://mindvaultip.com",
    "http://localhost:5173",
    "http://localhost:3000",
  ];

  const isAllowed =
    !origin ||
    allowedOrigins.some(
      (allowed) =>
        origin.includes("mindvaultip.com") || origin.includes("localhost")
    );

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400");

  // ✅ Handle preflight requests IMMEDIATELY (no redirects allowed)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Log the method for debugging
  console.log("[createproof1] Request method:", req.method);
  console.log("[createproof1] Request URL:", req.url);

  // Only allow POST
  if (req.method !== "POST") {
    console.error("[createproof1] ❌ Method not allowed:", req.method);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed. Use POST.`,
      allowedMethods: ["POST", "OPTIONS"],
    });
  }

  try {
    // Validate Supabase client
    if (!supabase) {
      console.error("[createproof1] ❌ Supabase not configured");
      return res.status(500).json({
        success: false,
        error: "Server configuration error: Supabase not configured",
      });
    }

    // Parse body safely
    let body = {};
    if (req.body) {
      if (typeof req.body === "string") {
        try {
          body = JSON.parse(req.body);
        } catch (e) {
          console.error("[createproof1] ❌ Failed to parse JSON body:", e);
          return res.status(400).json({
            success: false,
            error: "Invalid JSON in request body",
          });
        }
      } else {
        body = req.body;
      }
    }

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
      ipfsHash,
    } = body;

    // Validate required fields
    if (!transactionHash) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: transactionHash",
      });
    }

    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: userAddress",
      });
    }

    console.log(
      "[createproof1] 📥 Creating proof for transaction:",
      transactionHash
    );
    console.log("[createproof1] User:", userAddress);
    console.log(
      "[createproof1] 📥 Request body:",
      JSON.stringify(body, null, 2)
    );

    // Generate proof ID (deterministic from transaction hash for idempotency)
    const proofId = `proof_${transactionHash.substring(2, 10)}_${Date.now()}`;

    // Prepare proof data
    const proofData = {
      id: proofId,
      title: title || `Proof ${proofId}`,
      category: category || "invention",
      description: description || "",
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
    const { data: existing, error: checkError } = await supabase
      .from("proofs")
      .select("id")
      .eq("payment_hash", transactionHash)
      .eq("created_by", userAddress)
      .single();

    if (existing) {
      console.log(
        "[createproof1] ✅ Proof already exists (idempotency):",
        existing.id
      );
      return res.status(200).json({
        success: true,
        message: "Proof already exists",
        proofId: existing.id,
        transactionHash,
        alreadyExists: true,
      });
    }

    // Insert proof record
    console.log(
      "[createproof1] 📝 Inserting proof data:",
      JSON.stringify(proofData, null, 2)
    );
    const { data: proof, error: insertError } = await supabase
      .from("proofs")
      .insert(proofData)
      .select()
      .single();

    if (insertError) {
      console.error("[createproof1] ❌ Failed to create proof:", insertError);

      // Handle duplicate key error (idempotency)
      if (
        insertError.code === "23505" ||
        insertError.message?.includes("duplicate")
      ) {
        // Try to get existing proof
        const { data: existingProof } = await supabase
          .from("proofs")
          .select("*")
          .eq("payment_hash", transactionHash)
          .single();

        if (existingProof) {
          return res.status(200).json({
            success: true,
            message: "Proof already exists",
            proofId: existingProof.id,
            transactionHash,
            alreadyExists: true,
          });
        }
      }

      return res.status(500).json({
        success: false,
        error: `Failed to create proof: ${insertError.message}`,
      });
    }

    console.log("[createproof1] ✅ Proof created successfully:", proof?.id);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Proof created successfully",
      proofId: proof.id,
      transactionHash,
      proof: proof,
    });
  } catch (error) {
    console.error("[createproof1] ❌ Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
