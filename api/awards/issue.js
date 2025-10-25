// Awards API endpoint with comprehensive error handling and validation
export const runtime = 'nodejs';

import formidable from "formidable";
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';
import { ENV, assertEnv, logEnvStatus } from '../_utils/env.js';

// Disable default body parser and set size limit
export const config = { 
  api: { 
    bodyParser: false, 
    sizeLimit: '10mb'
  } 
};

// Initialize Supabase client
const supabase = ENV.SUPABASE_URL && ENV.SUPABASE_SERVICE_KEY 
  ? createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_KEY) 
  : null;

// Parse multipart form data
function parseForm(req) {
  const form = formidable({ 
    multiples: false, 
    maxFileSize: ENV.MAX_UPLOAD_BYTES,
    keepExtensions: true,
    uploadDir: '/tmp', // Use temp directory for Vercel
    createDirsFromUploads: true,
    fileWriteStreamHandler: false // Keep files in memory for Vercel
  });
  
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('formidable.parse.error', { message: err.message });
        reject(err);
      } else {
        console.log('formidable.parse.success', { 
          fields: Object.keys(fields), 
          files: Object.keys(files),
          fileDetails: Object.keys(files).map(key => ({
            key,
            mimetype: files[key].mimetype,
            size: files[key].size,
            originalFilename: files[key].originalFilename,
            filepath: files[key].filepath,
            path: files[key].path,
            buffer: files[key].buffer ? 'present' : 'missing'
          }))
        });
        resolve({ fields, files });
      }
    });
  });
}

// Normalize address for comparison
function normalizeAddress(address) {
  return (address || '').toString().trim().toLowerCase().replace(/\s/g, '');
}

// Verify signature with ethers (v5/v6 compatible)
function verifySignature(message, signature) {
  try {
    if (ethers.utils && ethers.utils.verifyMessage) {
      return ethers.utils.verifyMessage(message, signature);
    } else if (ethers.verifyMessage) {
      return ethers.verifyMessage(message, signature);
    } else {
      throw new Error('ethers verifyMessage not available');
    }
  } catch (error) {
    throw new Error(`Signature verification failed: ${error.message}`);
  }
}

// Upload file to Supabase storage
async function uploadFile(file, filename) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Debug file object
  console.log('uploadFile.debug', { 
    file: {
      mimetype: file.mimetype,
      size: file.size,
      originalFilename: file.originalFilename,
      filepath: file.filepath,
      path: file.path
    }
  });

  // Get file size from buffer if not available
  let fileSize = file.size;
  if (!fileSize && file.filepath) {
    try {
      const stats = fs.statSync(file.filepath);
      fileSize = stats.size;
    } catch (e) {
      console.warn('Could not get file size from stats:', e.message);
    }
  }

  // Validate file type - be more flexible with mimetype detection
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  let detectedMimeType = file.mimetype;
  
  // If mimetype is missing or is generic, try to detect from filename
  if ((!detectedMimeType || detectedMimeType === 'application/octet-stream') && file.originalFilename) {
    const ext = file.originalFilename.toLowerCase().split('.').pop();
    const mimeMap = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg', 
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'pdf': 'application/pdf'
    };
    detectedMimeType = mimeMap[ext];
  }
  
  // If still no valid mimetype, try to detect from file content (basic check)
  if (!detectedMimeType || detectedMimeType === 'application/octet-stream') {
    try {
      let fileBuffer;
      
      // Try to get buffer for signature detection
      if (file.buffer) {
        fileBuffer = file.buffer;
      } else if (file.filepath || file.path) {
        const filePath = file.filepath || file.path;
        if (filePath && typeof filePath === 'string') {
          fileBuffer = fs.readFileSync(filePath);
        }
      }
      
      if (fileBuffer && fileBuffer.length > 0) {
        const header = fileBuffer.slice(0, 10);
        
        // Check file signatures
        if (header[0] === 0xFF && header[1] === 0xD8) {
          detectedMimeType = 'image/jpeg';
        } else if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) {
          detectedMimeType = 'image/png';
        } else if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) {
          detectedMimeType = 'image/gif';
        } else if (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46) {
          detectedMimeType = 'image/webp';
        } else if (header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46) {
          detectedMimeType = 'application/pdf';
        }
      }
    } catch (e) {
      console.warn('Could not detect file type from content:', e.message);
    }
  }
  
  // If still no valid mimetype, default to application/octet-stream but allow it
  if (!detectedMimeType) {
    detectedMimeType = 'application/octet-stream';
  }

  // Allow application/octet-stream for unknown file types
  const allowedTypesWithGeneric = [...allowedTypes, 'application/octet-stream'];
  
  if (!allowedTypesWithGeneric.includes(detectedMimeType)) {
    throw new Error(`File type ${detectedMimeType} not allowed. Allowed types: ${allowedTypes.join(', ')}, or unknown files`);
  }

  // Validate file size
  if (fileSize && fileSize > ENV.MAX_UPLOAD_BYTES) {
    const maxMB = Math.round(ENV.MAX_UPLOAD_BYTES / 1024 / 1024);
    const fileMB = Math.round(fileSize / 1024 / 1024);
    throw new Error(`File too large. Maximum size: ${maxMB}MB, received: ${fileMB}MB`);
  }

  // Get file buffer - try different sources for Vercel compatibility
  let fileBuffer;
  try {
    // First try to get buffer directly (Vercel serverless)
    if (file.buffer) {
      fileBuffer = file.buffer;
      console.log('Using file.buffer (Vercel serverless mode)');
    } 
    // Fallback to reading from file path
    else if (file.filepath || file.path) {
      const filePath = file.filepath || file.path;
      if (typeof filePath === 'string') {
        fileBuffer = fs.readFileSync(filePath);
        console.log('Using fs.readFileSync from path');
      } else {
        throw new Error('File path is not a string');
      }
    } 
    // Last resort - try to read from file object
    else if (file.toBuffer) {
      fileBuffer = await file.toBuffer();
      console.log('Using file.toBuffer()');
    } else {
      throw new Error('No file buffer or path available');
    }
  } catch (readError) {
    console.error('file.read.error', { 
      filepath: file.filepath, 
      path: file.path,
      hasBuffer: !!file.buffer,
      hasToBuffer: !!file.toBuffer,
      error: readError.message 
    });
    throw new Error(`Failed to read uploaded file: ${readError.message}`);
  }

  // Upload to Supabase
  const { error: uploadError } = await supabase.storage
    .from(ENV.SUPABASE_BUCKET)
    .upload(filename, fileBuffer, {
      cacheControl: '3600',
      upsert: false,
      contentType: detectedMimeType,
    });

  if (uploadError) {
    throw new Error(`File upload failed: ${uploadError.message}`);
  }

  // Get public URL
  const { data } = supabase.storage.from(ENV.SUPABASE_BUCKET).getPublicUrl(filename);
  return data?.publicUrl || null;
}

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
    // Validate environment on first request
    try {
      assertEnv();
      logEnvStatus();
    } catch (envError) {
      console.error("awards.env.error", { message: envError.message });
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Parse form data
    const { fields, files } = await parseForm(req);
    
    // Extract and validate required fields
    const pick = (v) => (Array.isArray(v) ? v[0] : v);
    
    const walletAddress = normalizeAddress(pick(fields.walletAddress));
    const title = pick(fields.title);
    const signature = pick(fields.signature);
    const message = pick(fields.message);

    // Validate required fields
    if (!walletAddress) {
      return res.status(400).json({ error: "walletAddress missing" });
    }
    
    if (!title) {
      return res.status(400).json({ error: "title missing" });
    }
    
    if (!signature) {
      return res.status(400).json({ error: "signature missing" });
    }

    // Verify founder access
    if (walletAddress !== ENV.FOUNDER_ADDRESS) {
      console.warn("awards.auth.failed", { 
        expected: ENV.FOUNDER_ADDRESS, 
        got: walletAddress 
      });
      return res.status(403).json({ 
        error: "Founder access required",
        details: { expected: ENV.FOUNDER_ADDRESS, got: walletAddress }
      });
    }

    // Verify signature
    let recoveredAddress;
    try {
      recoveredAddress = verifySignature(message || title, signature);
    } catch (sigError) {
      console.error("awards.signature.error", { message: sigError.message });
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Verify recovered address matches
    const normalizedRecovered = normalizeAddress(recoveredAddress);
    if (normalizedRecovered !== ENV.FOUNDER_ADDRESS) {
      console.warn("awards.signature.mismatch", {
        expected: ENV.FOUNDER_ADDRESS,
        recovered: normalizedRecovered
      });
      return res.status(403).json({ 
        error: "Signature verification failed",
        details: { expected: ENV.FOUNDER_ADDRESS, recovered: normalizedRecovered }
      });
    }

    // Handle file upload (optional)
    let imageUrl = null;
    const file = files?.image || files?.file;
    
    if (file) {
      try {
        const filename = `${Date.now()}_${file.originalFilename || file.name}`.replace(/\s+/g, '_');
        imageUrl = await uploadFile(file, filename);
        console.log("awards.upload.success", { filename, url: imageUrl });
      } catch (uploadError) {
        console.error("awards.upload.error", { message: uploadError.message });
        return res.status(400).json({ error: uploadError.message });
      }
    }

    // Prepare award data
    const awardData = {
      issuer: ENV.FOUNDER_ADDRESS,
      recipient: normalizeAddress(pick(fields.recipient)) || null,
      recipient_name: pick(fields.recipient_name) || null,
      recipient_email: pick(fields.recipient_email) || null,
      title: title,
      category: pick(fields.category) || null,
      year: pick(fields.year) || null,
      summary: pick(fields.summary) || null,
      image_url: imageUrl,
      timestamp: pick(fields.timestamp) || new Date().toISOString(),
    };

    // Insert into database
    if (!supabase) {
      throw new Error('Database not configured');
    }

    const { data: insertedAward, error: insertError } = await supabase
      .from('awards')
      .insert(awardData)
      .select()
      .single();

    if (insertError) {
      console.error("awards.db.insert.error", { message: insertError.message });
      return res.status(500).json({ error: "Failed to save award" });
    }

    console.log("awards.create.success", { 
      id: insertedAward?.id, 
      title: title,
      hasImage: !!imageUrl 
    });

    // Return success response
    return res.status(201).json({ 
      ok: true, 
      success: true,
      award: insertedAward,
      meta: {
        filename: file?.originalFilename || null,
        imageUrl: imageUrl
      }
    });

  } catch (err) {
    console.error("awards.upload.error", { 
      message: err?.message, 
      stack: err?.stack?.slice(0, 300) 
    });
    return res.status(500).json({ 
      error: err?.message || "Internal server error" 
    });
  }
}