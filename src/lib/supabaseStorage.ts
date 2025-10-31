/**
 * Supabase Storage utilities for proof file uploads
 * Uses environment variables for configuration
 */

import { supabase } from './supabaseClient';

const PROOFS_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'proofs';

/**
 * Upload a file to Supabase storage proofs bucket
 * @param path - The storage path (e.g., 'proofId/filename.jpg')
 * @param file - The file/blob to upload
 * @returns Upload result with data, error, and publicUrl
 */
export async function uploadProofFile(
  path: string,
  file: Blob | File
): Promise<{ 
  data: { path: string } | null; 
  error: { message: string } | null;
  publicUrl?: string;
}> {
  // Note: We don't check bucket existence first - anon key can't list buckets
  // Instead, we try to upload and let the error tell us if bucket is missing

  // Upload file with upsert to allow overwriting
  const { data, error } = await supabase.storage
    .from(PROOFS_BUCKET)
    .upload(path, file, {
      cacheControl: 'public, max-age=31536000',
      upsert: true, // Allow overwriting existing files
    });

  if (error) {
    console.error('[SupabaseStorage] Upload error:', error);
    
    // Provide helpful error message if bucket doesn't exist
    if (error.message?.includes('Bucket not found') || error.message?.includes('does not exist')) {
      console.error('[SupabaseStorage] ❌ Bucket "' + PROOFS_BUCKET + '" does not exist!');
      console.error('[SupabaseStorage] 📋 To fix: Create the bucket in Supabase Dashboard > Storage');
      console.error('[SupabaseStorage]   Or run SQL from: supabase-proofs-bucket-setup.sql');
    }
    
    return { data: null, error };
  }

  console.log('[SupabaseStorage] ✅ File uploaded successfully:', path);

  // Get public URL using SDK (SDK handles URL encoding automatically)
  const { data: urlData } = supabase.storage
    .from(PROOFS_BUCKET)
    .getPublicUrl(path);

  const publicUrl = urlData?.publicUrl;
  
  if (!publicUrl) {
    console.error('[SupabaseStorage] ⚠️  Failed to get public URL');
    return { data, error: null };
  }

  console.log('[SupabaseStorage] ✅ Public URL:', publicUrl);
  
  return { 
    data, 
    error: null,
    publicUrl 
  };
}

/**
 * Get public URL for a file in the proofs bucket
 * SDK automatically handles URL encoding for special characters
 * @param path - The storage path (will be automatically URL-encoded by SDK)
 * @returns Object with data containing publicUrl
 */
export function getPublicUrl(path: string): { data: { publicUrl: string } } {
  // Use SDK's getPublicUrl - it handles URL encoding automatically
  const { data } = supabase.storage
    .from(PROOFS_BUCKET)
    .getPublicUrl(path);

  if (data?.publicUrl) {
    console.log('[SupabaseStorage] Public URL for', path, ':', data.publicUrl);
  }

  return { data };
}

/**
 * Delete a file from Supabase storage
 * @param path - The storage path to delete
 * @returns true if successful, false otherwise
 */
export async function deleteProofFile(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(PROOFS_BUCKET)
      .remove([path]);

    if (error) {
      console.error('[SupabaseStorage] Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[SupabaseStorage] Delete failed:', error);
    return false;
  }
}
