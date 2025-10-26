import { supabase } from './supabaseClient';

// Storage bucket configuration
export const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'awards';

// Bucket initialization status
let bucketInitialized = false;
let bucketInitializationFailed = false;

/**
 * Initialize the storage bucket - create if it doesn't exist
 */
export async function initializeBucket(): Promise<boolean> {
  if (bucketInitialized) return true;
  if (bucketInitializationFailed) return false;

  try {
    if (!supabase) {
      console.error('❌ Supabase not configured');
      bucketInitializationFailed = true;
      return false;
    }

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Failed to list buckets:', listError);
      bucketInitializationFailed = true;
      return false;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET);
    
    if (!bucketExists) {
      
      // Use the SQL function to create bucket with proper policies
      const { error: ensureError } = await supabase.rpc('ensure_awards_bucket');
      
        if (ensureError) {
          console.error(`❌ Failed to ensure bucket ${BUCKET}:`, ensureError);

          // If the SQL function is missing or not callable, try direct bucket creation as a fallback.
          try {
            const { data: createData, error: createError } = await supabase.storage.createBucket(BUCKET, {
              public: true,
              allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
              fileSizeLimit: 10 * 1024 * 1024 // 10MB limit
            });

            if (createError) {
              // If creation failed, surface helpful troubleshooting info and fail gracefully
              console.error(`❌ Failed to create bucket ${BUCKET}:`, createError);
              if (createError.message && createError.message.includes('permission')) {
                console.error('🔒 Permission denied when creating bucket. The anon key may not have storage admin privileges.');
              }
              bucketInitializationFailed = true;
              return false;
            }


            // Try to set bucket public policies via RPC; if RPCs are not installed, log guidance.
            try {
              const { error: policyErr } = await supabase.rpc('create_bucket_policy', {
                bucket_name: BUCKET,
                policy_name: 'awards_public_read',
                operation: 'SELECT',
                definition: 'true'
              });
              if (policyErr) {
                console.warn('⚠️ create_bucket_policy RPC failed (may not be installed):', policyErr.message || policyErr);
                console.warn('⚠️ Please run the SQL setup script in SUPABASE_STORAGE_SETUP.md to install required functions and policies.');
              } else {
              }
            } catch (rpcErr) {
              console.warn('⚠️ Could not call create_bucket_policy RPC:', rpcErr.message || rpcErr);
              console.warn('⚠️ Please run the SQL setup script in SUPABASE_STORAGE_SETUP.md to install required functions and policies.');
            }

          } catch (createCatchErr) {
            console.error(`❌ Exception while creating bucket ${BUCKET}:`, createCatchErr);
            bucketInitializationFailed = true;
            return false;
          }
        } else {
        }
    } else {
    }

    // Ensure bucket is public (double-check)
    await makeBucketPublic();
    
    bucketInitialized = true;
    return true;
  } catch (error) {
    console.error('❌ Bucket initialization failed:', error);
    bucketInitializationFailed = true;
    return false;
  }
}

/**
 * Make the bucket publicly readable
 */
async function makeBucketPublic(): Promise<void> {
  try {
    // Get current bucket policies
    const { data: policies, error: policiesError } = await supabase.rpc('get_bucket_policies', {
      bucket_name: BUCKET
    });

    if (policiesError) {
      console.warn('⚠️ Could not check bucket policies:', policiesError);
      return;
    }

    // Check if public read policy exists
    const hasPublicRead = policies?.some((policy: any) => 
      policy.policy_name === 'awards_public_read' && 
      policy.operation === 'SELECT'
    );

    if (!hasPublicRead) {
      
      // Create public read policy
      const { error: policyError } = await supabase.rpc('create_bucket_policy', {
        bucket_name: BUCKET,
        policy_name: 'awards_public_read',
        operation: 'SELECT',
        definition: 'true'
      });

      if (policyError) {
        console.warn('⚠️ Could not create public read policy:', policyError);
      } else {
      }
    } else {
    }
  } catch (error) {
    console.warn('⚠️ Failed to set bucket policies:', error);
  }
}

/**
 * Verify bucket has public read access
 */
export async function verifyPublicAccess(): Promise<boolean> {
  try {
    if (!supabase) return false;

    // Try to get bucket policies
    const { data: policies, error: policiesError } = await supabase.rpc('get_bucket_policies', {
      bucket_name: BUCKET
    });

    if (policiesError) {
      console.warn('⚠️ Could not verify bucket policies:', policiesError);
      return false;
    }

    // Check if public read policy exists
    const hasPublicRead = policies?.some((policy: any) => 
      policy.policy_name === 'awards_public_read' && 
      policy.operation === 'SELECT'
    );

    if (hasPublicRead) {
      return true;
    } else {
      console.warn(`⚠️ Public read access not found for bucket ${BUCKET}`);
      return false;
    }
  } catch (error) {
    console.warn('⚠️ Failed to verify public access:', error);
    return false;
  }
}

/**
 * Ensure awards bucket exists with auto-retry mechanism
 */
export async function ensureAwardsBucket(): Promise<boolean> {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      if (!supabase) {
        console.error('❌ Supabase not configured');
        console.error('📋 Environment check:');
        console.error('   VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
        console.error('   VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
        console.error('   VITE_SUPABASE_BUCKET:', import.meta.env.VITE_SUPABASE_BUCKET || 'awards (default)');
        console.error('');
        console.error('🔧 To fix this:');
        console.error('   1. Create a .env file in your project root');
        console.error('   2. Add your Supabase credentials:');
        console.error('      VITE_SUPABASE_URL=https://your-project-id.supabase.co');
        console.error('      VITE_SUPABASE_ANON_KEY=your-anon-key');
        console.error('   3. Run: ./setup-env.sh (for guided setup)');
        return false;
      }

      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error(`❌ Failed to list buckets (attempt ${retryCount + 1}):`, listError);
        
        // If it's a 404 or bucket not found error, try to create it
        if (listError.message?.includes('404') || listError.message?.includes('not found')) {
          
          // Use the SQL function to create bucket with proper policies
          const { error: ensureError } = await supabase.rpc('ensure_awards_bucket');
          
          if (ensureError) {
            console.error(`❌ Failed to ensure bucket ${BUCKET} (attempt ${retryCount + 1}):`, ensureError);
            retryCount++;
            if (retryCount < maxRetries) {
              console.log(`🔄 Retrying in 1 second... (${retryCount}/${maxRetries})`);
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            return false;
          }

          return true;
        }
        
        retryCount++;
        if (retryCount < maxRetries) {
          console.log(`🔄 Retrying in 1 second... (${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        return false;
      }

      const bucketExists = buckets?.some(bucket => bucket.name === BUCKET);
      
      if (!bucketExists) {
        
        // Use the SQL function to create bucket with proper policies
        const { error: ensureError } = await supabase.rpc('ensure_awards_bucket');
        
        if (ensureError) {
          console.error(`❌ Failed to ensure bucket ${BUCKET} (attempt ${retryCount + 1}):`, ensureError);
          
          // Check if it's a function not found error
          if (ensureError.message?.includes('function') && ensureError.message?.includes('does not exist')) {
            console.log('🔧 SQL function not found, creating bucket directly...');
            
            // Fallback to direct bucket creation
            try {
              const { data: createData, error: createError } = await supabase.storage.createBucket(BUCKET, {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
                fileSizeLimit: 10 * 1024 * 1024 // 10MB limit
              });

              if (createError) {
                console.error(`❌ Failed to create bucket ${BUCKET}:`, createError);
                if (createError.message && createError.message.includes('permission')) {
                  console.error('🔒 Permission denied. You may need to run the SQL setup script first.');
                  console.error('📋 Go to your Supabase SQL editor and run: supabase-awards-bucket-setup.sql');
                }
                retryCount++;
                if (retryCount < maxRetries) {
                  console.log(`🔄 Retrying in 1 second... (${retryCount}/${maxRetries})`);
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  continue;
                }
                return false;
              }

              console.log(`✅ Bucket ${BUCKET} created successfully!`);
              return true;
            } catch (createCatchErr) {
              console.error(`❌ Exception while creating bucket ${BUCKET}:`, createCatchErr);
              retryCount++;
              if (retryCount < maxRetries) {
                console.log(`🔄 Retrying in 1 second... (${retryCount}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
              }
              return false;
            }
          }
          
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`🔄 Retrying in 1 second... (${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          return false;
        }

        console.log(`✅ Bucket ${BUCKET} ensured via SQL function`);
        return true;
      } else {
        return true;
      }
    } catch (error) {
      console.error(`❌ Failed to ensure bucket exists (attempt ${retryCount + 1}):`, error);
      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`🔄 Retrying in 1 second... (${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      return false;
    }
  }

  console.error(`❌ Failed to ensure bucket ${BUCKET} after ${maxRetries} attempts`);
  return false;
}

/**
 * Check and ensure bucket exists before upload (legacy function for compatibility)
 */
async function ensureBucketExists(): Promise<boolean> {
  return await ensureAwardsBucket();
}

/**
 * Upload file to the storage bucket
 */
export async function uploadFile(file: File, path: string): Promise<string | null> {
  try {
    // First ensure bucket exists with auto-retry
    const bucketExists = await ensureAwardsBucket();
    if (!bucketExists) {
      throw new Error(`Failed to ensure bucket ${BUCKET} exists after retries`);
    }

    // Then ensure bucket is initialized
    const bucketReady = await initializeBucket();
    if (!bucketReady) {
      throw new Error(`Failed to initialize bucket ${BUCKET}`);
    }

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { 
        cacheControl: 'public, max-age=31536000',
        upsert: true // Allow overwriting existing files
      });

    if (uploadError) {
      console.error('❌ File upload failed:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    const publicUrl = urlData?.publicUrl;
    if (!publicUrl) {
      throw new Error('Failed to get public URL');
    }

    // Verify public access is working
    const hasPublicAccess = await verifyPublicAccess();
    if (!hasPublicAccess) {
      console.warn('⚠️ Public access verification failed, but file uploaded');
    }

    console.log(`✅ File uploaded successfully: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

/**
 * Delete file from storage bucket
 */
export async function deleteFile(path: string): Promise<boolean> {
  try {
    if (!supabase) return false;

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([path]);

    if (error) {
      console.error('❌ File deletion failed:', error);
      return false;
    }

    console.log(`✅ File deleted: ${path}`);
    return true;
  } catch (error) {
    console.error('❌ Delete failed:', error);
    return false;
  }
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(path: string): string | null {
  if (!supabase) return null;

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return data?.publicUrl || null;
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  return !!supabase && bucketInitialized && !bucketInitializationFailed;
}

/**
 * Initialize storage on app startup
 */
export async function initializeStorageOnStartup(): Promise<boolean> {
  try {
    console.log('🚀 Initializing Supabase storage on app startup...');
    
    if (!supabase) {
      console.warn('⚠️ Supabase not configured, skipping storage initialization');
      return false;
    }

    // Ensure awards bucket exists
    const bucketReady = await ensureAwardsBucket();
    if (!bucketReady) {
      console.error('❌ Failed to ensure awards bucket on startup');
      return false;
    }

    // Verify public access
    const hasPublicAccess = await verifyPublicAccess();
    if (!hasPublicAccess) {
      console.warn('⚠️ Public access verification failed on startup');
    }

    console.log('✅ Supabase storage initialized successfully on startup');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize storage on startup:', error);
    return false;
  }
}

/**
 * Get storage status for debugging
 */
export async function getStorageStatus() {
  const publicAccess = await verifyPublicAccess();
  
  return {
    supabaseConfigured: !!supabase,
    bucketName: BUCKET,
    bucketInitialized,
    bucketInitializationFailed,
    isAvailable: isStorageAvailable(),
    hasPublicAccess: publicAccess,
    environment: {
      bucketEnvVar: import.meta.env.VITE_SUPABASE_BUCKET,
      supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      supabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
    }
  };
}
