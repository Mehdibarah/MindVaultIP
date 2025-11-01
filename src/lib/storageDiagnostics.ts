// ✅ supabase import removed - not used in this file

/**
 * Log Supabase environment configuration
 * Shows URL and first 8 chars of anon key for debugging
 */
export function logSupabaseEnv(): void {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const bucket = import.meta.env.VITE_SUPABASE_BUCKET || 'proofs';

  if (!url || !anonKey) {
    console.error('[StorageDiagnostics] ❌ Missing Supabase environment variables!');
    console.error('[StorageDiagnostics] Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
    return;
  }

  const anonKeyPreview = anonKey.substring(0, 8) + '...';
  
  console.log('[StorageDiagnostics] 🔍 Supabase Configuration:');
  console.log('[StorageDiagnostics]   URL:', url);
  console.log('[StorageDiagnostics]   Anon Key:', anonKeyPreview);
  console.log('[StorageDiagnostics]   Bucket:', bucket);
}

/**
 * List all buckets in the connected Supabase project
 * Helps debug bucket connection issues
 * 
 * NOTE: DISABLED - anon key doesn't have permission to list buckets
 * This function requires admin/service key which we don't use in frontend
 */
export async function listConnectedBuckets(): Promise<void> {
  // DISABLED: anon key cannot list buckets
  console.log('[StorageDiagnostics] ⚠️  listConnectedBuckets() is disabled');
  console.log('[StorageDiagnostics]   Anon key doesn\'t have permission to list buckets');
  return;
  
  /* DISABLED CODE - kept for reference
  try {
    console.log('[StorageDiagnostics] 📦 Listing buckets...');
    
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('[StorageDiagnostics] ❌ Failed to list buckets:', error);
      console.error('[StorageDiagnostics]   Error code:', error.statusCode || 'unknown');
      console.error('[StorageDiagnostics]   Error message:', error.message);
      console.error('[StorageDiagnostics]');
      console.error('[StorageDiagnostics] 🔧 Possible fixes:');
      console.error('[StorageDiagnostics]   1. Check VITE_SUPABASE_ANON_KEY is correct (from Settings > API)');
      console.error('[StorageDiagnostics]   2. Verify Storage API is enabled for your project');
      console.error('[StorageDiagnostics]   3. Ensure anon key has storage.listBuckets permission');
      console.error('[StorageDiagnostics]   4. Check you are connected to the correct Supabase project');
      
      // If it's a 401/403, provide specific guidance
      if (error.statusCode === 401 || error.statusCode === 403) {
        console.error('[StorageDiagnostics]');
        console.error('[StorageDiagnostics] 🔒 Authentication issue detected!');
        console.error('[StorageDiagnostics]   Your anon key may not have storage permissions.');
        console.error('[StorageDiagnostics]   Go to: Supabase Dashboard > Settings > API');
        console.error('[StorageDiagnostics]   Verify the anon key matches your project.');
      }
      
      return;
    }

    if (!buckets || buckets.length === 0) {
      console.warn('[StorageDiagnostics] ⚠️  No buckets found in connected project');
      console.warn('[StorageDiagnostics] 📋 This could mean:');
      console.warn('[StorageDiagnostics]   1. No buckets have been created yet in this Supabase project');
      console.warn('[StorageDiagnostics]   2. Storage API is not enabled for this project');
      console.warn('[StorageDiagnostics]   3. Anon key lacks permission to list buckets');
      console.warn('[StorageDiagnostics]');
      console.warn('[StorageDiagnostics] ✅ To fix:');
      console.warn('[StorageDiagnostics]   • Go to Supabase Dashboard > Storage');
      console.warn('[StorageDiagnostics]   • Create a bucket named "proofs" (or set VITE_SUPABASE_BUCKET env var)');
      console.warn('[StorageDiagnostics]   • Or run the SQL from: supabase-proofs-bucket-setup.sql');
      console.warn('[StorageDiagnostics]   • Verify anon key has storage permissions in Settings > API > RLS policies');
      return;
    }

    const bucketNames = buckets.map(b => b.name);
    console.log('[StorageDiagnostics] ✅ Found buckets:', bucketNames);
    
    const expectedBucket = import.meta.env.VITE_SUPABASE_BUCKET || 'proofs';
    if (!bucketNames.includes(expectedBucket)) {
      console.error('[StorageDiagnostics] ❌ Bucket "' + expectedBucket + '" not found!');
      console.error('[StorageDiagnostics]   Available buckets:', bucketNames);
      console.error('[StorageDiagnostics]   Vercel envs must match Supabase project (Settings → API). After changing, Redeploy.');
    } else {
      console.log('[StorageDiagnostics] ✅ Bucket "' + expectedBucket + '" exists');
    }
  } catch (error) {
    console.error('[StorageDiagnostics] ❌ Error listing buckets:', error);
  }
  */
}

/**
 * Assert that the proofs bucket exists in the connected project
 * Throws a descriptive error if the bucket is missing
 * 
 * NOTE: DISABLED - anon key doesn't have permission to list buckets
 * Instead, we try to upload and catch errors if bucket doesn't exist
 */
export async function assertProofsBucketExists(): Promise<void> {
  // DISABLED: anon key cannot list buckets
  // We'll rely on upload errors to detect missing buckets
  console.log('[StorageDiagnostics] ⚠️  assertProofsBucketExists() is disabled');
  console.log('[StorageDiagnostics]   Will rely on upload errors to detect missing bucket');
  return;
  
  /* DISABLED CODE - kept for reference
  const bucketName = import.meta.env.VITE_SUPABASE_BUCKET || 'proofs';
  
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    throw new Error(
      `Failed to list buckets: ${error.message}. ` +
      `Check your VITE_SUPABASE_ANON_KEY permissions.`
    );
  }

  const bucketExists = buckets?.some(b => b.name === bucketName);
  
  if (!bucketExists) {
    const availableBuckets = buckets?.map(b => b.name).join(', ') || 'none';
    throw new Error(
      `Connected project has no bucket '${bucketName}' – check Vercel envs & project ref. ` +
      `Available buckets: [${availableBuckets}]. ` +
      `Vercel envs must match Supabase project (Settings → API). After changing, Redeploy.`
    );
  }
  */
}

